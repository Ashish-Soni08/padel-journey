
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Run SQL to enable RLS for the matches table
    const { error: rlsError } = await supabaseClient.rpc('enable_realtime_for_table', {
      table_name: 'matches'
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
      return new Response(
        JSON.stringify({ success: false, error: rlsError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create policies for the matches table
    // Since we don't have a user_id column in the matches table, we'll need to create more generic policies
    // based on the existing schema structure

    // Create a select policy - allowing authenticated users to view matches
    const { error: selectPolicyError } = await supabaseClient.rpc('create_select_policy_for_matches');
    if (selectPolicyError) {
      console.error('Error creating select policy:', selectPolicyError);
    }

    // Create an insert policy - allowing authenticated users to add matches
    const { error: insertPolicyError } = await supabaseClient.rpc('create_insert_policy_for_matches');
    if (insertPolicyError) {
      console.error('Error creating insert policy:', insertPolicyError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "RLS enabled and policies created for matches table" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
