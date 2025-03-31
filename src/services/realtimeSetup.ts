
import { supabase } from "@/integrations/supabase/client";

// Function to enable realtime for the matches table
export const enableRealtime = async () => {
  try {
    // Apply REPLICA IDENTITY FULL to the matches table
    const { data, error } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'matches'
    });
    
    if (error) {
      console.error('Error enabling realtime for matches table:', error);
      return false;
    }
    
    console.log('Realtime enabled for matches table:', data);
    return true;
  } catch (error) {
    console.error('Error enabling realtime:', error);
    return false;
  }
};
