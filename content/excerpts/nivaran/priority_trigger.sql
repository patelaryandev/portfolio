-- Add priority and visibility_score columns to existing issues table
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS priority text DEFAULT 'MEDIUM';
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS visibility_score integer DEFAULT 42;

-- Function to calculate priority based on upvotes and downvotes
CREATE OR REPLACE FUNCTION public.calculate_issue_priority()
RETURNS TRIGGER AS $$
DECLARE
    v_score integer;
BEGIN
    -- Formula: 42 + (upvotes * 1.6 - downvotes * 1.1)
    v_score := ROUND(42 + (NEW.upvotes * 1.6 - NEW.downvotes * 1.1));
    
    -- Bound score between 0 and 100
    IF v_score > 100 THEN v_score := 100; END IF;
    IF v_score < 0 THEN v_score := 0; END IF;
    
    NEW.visibility_score := v_score;
    
    IF v_score > 80 THEN
        NEW.priority := 'CRITICAL';
    ELSIF v_score > 60 THEN
        NEW.priority := 'HIGH';
    ELSIF v_score > 40 THEN
        NEW.priority := 'MEDIUM';
    ELSE
        NEW.priority := 'LOW';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update priority and score on upvote/downvote changes
DROP TRIGGER IF EXISTS trigger_update_issue_priority ON public.issues;
CREATE TRIGGER trigger_update_issue_priority
BEFORE INSERT OR UPDATE OF upvotes, downvotes ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.calculate_issue_priority();

-- Run a one-time update for existing rows
UPDATE public.issues SET upvotes = COALESCE(upvotes, 0) WHERE priority IS NULL;
