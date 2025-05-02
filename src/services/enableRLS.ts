
import { supabase } from "@/integrations/supabase/client";

export const enableRLSForMatches = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('enable-rls');
    
    if (error) {
      console.error('Error enabling RLS:', error);
      return false;
    }
    
    console.log('RLS enabled successfully:', data);
    return true;
  } catch (error) {
    console.error('Error calling enable-rls function:', error);
    return false;
  }
};
