
import { enableRLSForMatches } from './enableRLS';
import { enableRealtime } from './realtimeSetup';

export const setupDatabase = async () => {
  console.log("Setting up database security...");
  
  // Enable RLS for matches table
  const rlsEnabled = await enableRLSForMatches();
  console.log("RLS setup completed:", rlsEnabled ? "success" : "failed");
  
  // Enable realtime for matches table
  const realtimeEnabled = await enableRealtime();
  console.log("Realtime setup completed:", realtimeEnabled ? "success" : "failed");
  
  return {
    rlsEnabled,
    realtimeEnabled
  };
};
