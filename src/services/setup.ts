
import { enableRealtime } from './realtimeSetup';
import { migrateLocalStorageToSupabase } from './dataMigration';

export const setupDatabase = async () => {
  console.log("Setting up database...");
  
  // First, try to migrate any data from localStorage
  const migrationResult = await migrateLocalStorageToSupabase();
  console.log("Migration result:", migrationResult);
  
  // Enable realtime for matches table
  const realtimeEnabled = await enableRealtime();
  console.log("Realtime setup completed:", realtimeEnabled ? "success" : "failed");
  
  return {
    rlsEnabled: true, // RLS is already enabled via the SQL init
    realtimeEnabled,
    migrationResult
  };
};
