
import { supabase } from "@/integrations/supabase/client";

// Function to enable realtime for the matches table
export const enableRealtime = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('enable-realtime');
    
    if (error) {
      console.error('Error enabling realtime:', error);
      return false;
    }
    
    console.log('Realtime enabled:', data);
    return true;
  } catch (error) {
    console.error('Error calling enable-realtime function:', error);
    return false;
  }
};
