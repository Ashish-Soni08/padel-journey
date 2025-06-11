
import { enableRealtime } from './realtimeSetup';

export const setupDatabase = async () => {
  console.log("Setting up database...");
  
  // Enable realtime for matches table
  const realtimeEnabled = await enableRealtime();
  console.log("Realtime setup completed:", realtimeEnabled ? "success" : "failed");
  
  return {
    rlsEnabled: true, // RLS is now properly configured
    realtimeEnabled
  };
};
