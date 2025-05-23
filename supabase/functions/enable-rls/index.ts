
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

    // Run SQL query to enable RLS directly (this uses service role which has sufficient permissions)
    const { error: enableRlsError } = await supabaseClient.rpc('enable_rls_for_matches');
    
    if (enableRlsError) {
      console.error('Error enabling RLS:', enableRlsError);
      return new Response(
        JSON.stringify({ success: false, error: enableRlsError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create policies for the matches table
    // Since we don't have a user_id column in the matches table, we'll create more generic policies

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

    // Create an update policy - allowing authenticated users to update matches
    const { error: updatePolicyError } = await supabaseClient.rpc('create_update_policy_for_matches');
    if (updatePolicyError) {
      console.error('Error creating update policy:', updatePolicyError);
    }

    // Create a delete policy - allowing authenticated users to delete matches
    const { error: deletePolicyError } = await supabaseClient.rpc('create_delete_policy_for_matches');
    if (deletePolicyError) {
      console.error('Error creating delete policy:', deletePolicyError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "RLS enabled and policies created for matches table",
        details: {
          select_policy: selectPolicyError ? "failed" : "created",
          insert_policy: insertPolicyError ? "failed" : "created",
          update_policy: updatePolicyError ? "failed" : "created",
          delete_policy: deletePolicyError ? "failed" : "created"
        }
      }),
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
