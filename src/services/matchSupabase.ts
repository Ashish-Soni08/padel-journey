
import { supabase } from "@/integrations/supabase/client";
import { MatchData } from "./matchDatabase";
import { RealtimeChannel } from "@supabase/supabase-js";

// Type for Supabase match data that strictly follows the DB schema
type SupabaseMatchData = {
  id: string;
  date: string;
  match_type: "training" | "competitive";
  match_format: string;
  player1: string;
  player2: string | null;
  player3: string | null;
  result: "win" | "loss" | "training" | null;
  duration: string;
  venue: string;
  notes: string | null;
  created_at: string | null;
};

// Convert Supabase data to our application MatchData
const convertSupabaseToMatchData = (match: SupabaseMatchData): MatchData => {
  return {
    id: match.id,
    date: new Date(match.date),
    matchType: match.match_type,
    matchFormat: match.match_format as "1v1" | "2v2",
    player1: match.player1,
    player2: match.player2 || undefined,
    player3: match.player3 || undefined,
    result: match.result || undefined,
    duration: match.duration,
    venue: match.venue,
    notes: match.notes || undefined
  };
};

// Convert application MatchData to Supabase format for insertion
const convertMatchDataToSupabase = (match: Omit<MatchData, 'id'>): Omit<SupabaseMatchData, 'id' | 'created_at'> => {
  return {
    date: match.date.toISOString(),
    match_type: match.matchType,
    match_format: match.matchFormat,
    player1: match.player1,
    player2: match.player2 || null,
    player3: match.player3 || null,
    result: match.result || null,
    duration: match.duration,
    venue: match.venue,
    notes: match.notes || null
  };
};

// Add a new match to Supabase
export const addMatchToSupabase = async (match: Omit<MatchData, 'id'>): Promise<MatchData | null> => {
  const matchData = convertMatchDataToSupabase(match);
  
  const { data, error } = await supabase
    .from('matches')
    .insert(matchData)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding match:', error);
    return null;
  }
  
  return convertSupabaseToMatchData(data as SupabaseMatchData);
};

// Get all matches from Supabase
export const getAllMatchesFromSupabase = async (): Promise<MatchData[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  
  // Type assertion here to handle the conversion safely
  return (data as SupabaseMatchData[]).map(match => convertSupabaseToMatchData(match));
};

// Set up a subscription to the matches table
export const subscribeToMatches = (callback: (matches: MatchData[]) => void): RealtimeChannel => {
  const channel = supabase
    .channel('match-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'matches' }, 
      async () => {
        // When any change occurs, fetch the full data again
        const matches = await getAllMatchesFromSupabase();
        callback(matches);
      }
    )
    .subscribe();
  
  return channel;
};

// Calculate statistics from match data
export const getMatchStatsFromSupabase = async () => {
  const matches = await getAllMatchesFromSupabase();
  
  // Initialize statistics object
  const stats = {
    totalMatches: matches.length,
    totalDuration: 0,
    resultCounts: {
      win: 0,
      loss: 0,
      training: 0
    },
    monthlyMatches: Array(12).fill(0) as number[]
  };
  
  // Process each match to calculate statistics
  matches.forEach(match => {
    // Add duration
    const durationValue = parseInt(match.duration);
    stats.totalDuration += isNaN(durationValue) ? 0 : durationValue;
    
    // Count results
    if (match.result === 'win') stats.resultCounts.win++;
    else if (match.result === 'loss') stats.resultCounts.loss++;
    else stats.resultCounts.training++;
    
    // Count matches by month
    const matchDate = new Date(match.date);
    const monthIndex = matchDate.getMonth();
    stats.monthlyMatches[monthIndex]++;
  });
  
  return stats;
};
