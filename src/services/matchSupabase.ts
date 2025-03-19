
import { supabase } from "@/integrations/supabase/client";
import { MatchData } from "./matchDatabase";

// Type for Supabase match data
export type SupabaseMatchData = {
  id: string;
  date: string;
  match_type: "training" | "competitive";
  match_format: "1v1" | "2v2";
  player1: string;
  player2?: string;
  player3?: string;
  result?: "win" | "loss" | "training";
  duration: string;
  venue: string;
  notes?: string;
  created_at?: string;
};

// Function to convert Supabase match data to our app's MatchData format
export const convertSupabaseMatch = (match: SupabaseMatchData): MatchData => ({
  id: match.id,
  date: new Date(match.date),
  matchType: match.match_type,
  matchFormat: match.match_format,
  player1: match.player1,
  player2: match.player2,
  player3: match.player3,
  result: match.result,
  duration: match.duration,
  venue: match.venue,
  notes: match.notes
});

// Function to convert our app's MatchData to Supabase format
export const convertToSupabaseMatch = (match: Omit<MatchData, 'id'>): Omit<SupabaseMatchData, 'id' | 'created_at'> => ({
  date: match.date.toISOString(),
  match_type: match.matchType,
  match_format: match.matchFormat,
  player1: match.player1,
  player2: match.player2,
  player3: match.player3,
  result: match.result,
  duration: match.duration,
  venue: match.venue,
  notes: match.notes
});

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
  
  return data.map(convertSupabaseMatch);
};

// Add a new match to Supabase
export const addMatchToSupabase = async (match: Omit<MatchData, 'id'>): Promise<MatchData | null> => {
  const supabaseMatch = convertToSupabaseMatch(match);
  
  const { data, error } = await supabase
    .from('matches')
    .insert(supabaseMatch)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding match:', error);
    return null;
  }
  
  return convertSupabaseMatch(data);
};

// Get match stats from Supabase
export const getMatchStatsFromSupabase = async () => {
  const matches = await getAllMatchesFromSupabase();
  
  // Total matches
  const totalMatches = matches.length;
  
  // Total duration in minutes
  const totalDuration = matches.reduce((total, match) => {
    const minutes = parseInt(match.duration.replace(/[^0-9]/g, ''));
    return isNaN(minutes) ? total : total + minutes;
  }, 0);
  
  // Matches by result
  const resultCounts = {
    win: matches.filter(match => match.result === 'win').length,
    loss: matches.filter(match => match.result === 'loss').length,
    training: matches.filter(match => match.result === 'training').length
  };
  
  // Matches by month (for current year)
  const currentYear = new Date().getFullYear();
  const monthlyMatches = Array(12).fill(0);
  
  matches.forEach(match => {
    if (match.date.getFullYear() === currentYear) {
      const month = match.date.getMonth();
      monthlyMatches[month]++;
    }
  });
  
  return {
    totalMatches,
    totalDuration,
    resultCounts,
    monthlyMatches
  };
};

// Set up a real-time subscription for matches
export const subscribeToMatches = (callback: (matches: MatchData[]) => void) => {
  // Set up the real-time channel
  const channel = supabase
    .channel('matches-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches'
      },
      () => {
        // When any change happens, fetch all matches
        getAllMatchesFromSupabase().then(callback);
      }
    )
    .subscribe();

  // Return the channel for cleanup
  return channel;
};

// Enable real-time for the matches table
export const enableRealtimeForMatches = async () => {
  const { error } = await supabase.rpc('supabase_realtime.enable_publication', {
    publication_name: 'supabase_realtime'
  });
  
  if (error) {
    console.error('Error enabling realtime for matches:', error);
  }
};
