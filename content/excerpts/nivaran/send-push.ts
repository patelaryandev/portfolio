import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'https://esm.sh/google-auth-library@8'

serve(async (req) => {
  try {
    // 1. Get the notification row from the Webhook payload
    const payload = await req.json();
    const notification = payload.record;

    // 2. Initialize Supabase client to fetch the citizen's FCM token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('fcm_token')
      .eq('id', notification.user_id)
      .single();

    if (!profile?.fcm_token) {
      return new Response("Citizen has no FCM token. Skipping.", { status: 200 });
    }

    // 3. Authenticate with Firebase using your Service Account JSON
    // (You will set FIREBASE_SERVICE_ACCOUNT as a Supabase Secret later)
    const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT') ?? '{}');

    const jwtClient = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    const tokens = await jwtClient.getAccessToken();

    // 4. Send the push via FCM v1 API
    const fcmPayload = {
      message: {
        token: profile.fcm_token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          issueId: notification.issue_id || "", 
        }
      }
    };

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fcmPayload),
      }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
})