
import { getAllMatches } from './matchDatabase';
import { addMatchToSupabase } from './matchSupabase';

export const migrateLocalStorageToSupabase = async () => {
  console.log("Starting data migration from localStorage to Supabase...");
  
  // Get data from localStorage
  const localMatches = getAllMatches();
  console.log("Found matches in localStorage:", localMatches.length, localMatches);
  
  if (localMatches.length === 0) {
    console.log("No matches found in localStorage to migrate");
    return { migrated: 0, errors: [] };
  }
  
  let migratedCount = 0;
  const errors = [];
  
  for (const match of localMatches) {
    try {
      console.log("Migrating match:", match.id);
      const { id, ...matchData } = match; // Remove the ID since Supabase will generate a new one
      
      const result = await addMatchToSupabase(matchData);
      if (result) {
        migratedCount++;
        console.log("Successfully migrated match:", match.id);
      } else {
        console.error("Failed to migrate match:", match.id);
        errors.push(`Failed to migrate match ${match.id}`);
      }
    } catch (error) {
      console.error("Error migrating match:", match.id, error);
      errors.push(`Error migrating match ${match.id}: ${error.message}`);
    }
  }
  
  console.log(`Migration completed. Migrated: ${migratedCount}, Errors: ${errors.length}`);
  return { migrated: migratedCount, errors };
};
