-- 1. Add a JSONB column to track who voted what (e.g., {"user_id": true/false})
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS verification_votes jsonb DEFAULT '{}'::jsonb;

-- 2. Create the Consensus Engine (RPC Function)
-- … cut: comment line
CREATE OR REPLACE FUNCTION public.cast_verification_vote(p_issue_id UUID, p_is_fixed BOOLEAN)
RETURNS void AS $$
DECLARE
    v_issue RECORD;
    v_votes JSONB;
    v_yes_count INT := 0;
    v_no_count INT := 0;
    v_total_jury INT := 0;
BEGIN
    -- Get current issue
    SELECT * INTO v_issue FROM public.issues WHERE id = p_issue_id;

    -- Update the votes JSON array with the current user's vote
    v_votes := COALESCE(v_issue.verification_votes, '{}'::jsonb);
    v_votes := jsonb_set(v_votes, ARRAY[auth.uid()::text], to_jsonb(p_is_fixed));

    -- Save the vote
    UPDATE public.issues SET verification_votes = v_votes WHERE id = p_issue_id;

    -- RULE 1: If the original reporter says "Yes", it is instantly Verified.
    IF auth.uid() = v_issue.user_id AND p_is_fixed = true THEN
        UPDATE public.issues SET status = 'Verified' WHERE id = p_issue_id;
        RETURN;
    END IF;

    -- Calculate the current tallies
    SELECT 
        COUNT(*) FILTER (WHERE value::text = 'true'),
        COUNT(*) FILTER (WHERE value::text = 'false')
    INTO v_yes_count, v_no_count
    FROM jsonb_each(v_votes);

    -- Calculate total possible jury members (Reporter + Affected Users)
    v_total_jury := COALESCE(array_length(v_issue.affected_user_ids, 1), 0) + 1;

    -- RULE 2: If > 50% say YES, it's Verified.
    IF v_yes_count > (v_total_jury / 2.0) THEN
        UPDATE public.issues SET status = 'Verified' WHERE id = p_issue_id;
    -- RULE 3: If >= 50% say NO, it gets kicked back to In Progress!
    ELSIF v_no_count >= (v_total_jury / 2.0) THEN
        UPDATE public.issues SET status = 'In Progress' WHERE id = p_issue_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update the Notification Trigger to alert the Jury
CREATE OR REPLACE FUNCTION public.notify_user_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
    jury_id UUID;
BEGIN
  IF NEW.status <> OLD.status THEN
    -- A. Notify Original Reporter
    INSERT INTO public.notifications (user_id, issue_id, title, body, is_read)
    VALUES (NEW.user_id, NEW.id, 'Issue Update: ' || NEW.status, 'Your issue has been updated to ' || NEW.status || '.', false);

    -- B. If it's RESOLVED, notify the Jury!
    IF NEW.status = 'Resolved' AND NEW.affected_user_ids IS NOT NULL THEN
        FOREACH jury_id IN ARRAY NEW.affected_user_ids
        LOOP
            -- Don't double-notify the reporter if they are in both arrays
            IF jury_id <> NEW.user_id THEN
                INSERT INTO public.notifications (user_id, issue_id, title, body, is_read)
                VALUES (jury_id, NEW.id, 'Verification Required', 'An issue you confirmed visibility for has been marked Resolved by the officer. Please verify if it is actually fixed!', false);
            END IF;
        END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
