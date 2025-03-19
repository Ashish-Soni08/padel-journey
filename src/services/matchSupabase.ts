
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
    date: match.date,
    matchType: match.match_type,
    matchFormat: match.match_format,
    player1: match.player1,
    player2: match.player2 || undefined,
    player3: match.player3 || undefined,
    result: match.result || undefined,
    duration: parseInt(match.duration),
    venue: match.venue,
    notes: match.notes || undefined
  };
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
    stats.totalDuration += match.duration;
    
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
