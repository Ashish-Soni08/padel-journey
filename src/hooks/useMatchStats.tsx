
import { useState, useEffect } from 'react';
import { MatchData } from "@/services/matchDatabase";
import { getAllMatchesFromSupabase, getMatchStatsFromSupabase, subscribeToMatches } from "@/services/matchSupabase";
import { supabase } from "@/integrations/supabase/client";

// Month abbreviations
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface MatchStats {
  totalMatches: number;
  totalDuration: number;
  resultCounts: { win: number; loss: number; training: number };
  monthlyMatches: number[];
}

export interface ChartData {
  matchData: { month: string; matches: number }[];
  resultData: { name: string; value: number }[];
}

export const useMatchStats = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [stats, setStats] = useState<MatchStats>({
    totalMatches: 0,
    totalDuration: 0,
    resultCounts: { win: 0, loss: 0, training: 0 },
    monthlyMatches: Array(12).fill(0)
  });
  const [chartData, setChartData] = useState<ChartData>({
    matchData: [],
    resultData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Loading match data...');
        const allMatches = await getAllMatchesFromSupabase();
        console.log('Loaded matches:', allMatches.length, allMatches);
        
        const matchStats = await getMatchStatsFromSupabase();
        console.log('Calculated stats:', matchStats);
        
        setMatches(allMatches);
        setStats(matchStats);
        
        // Format data for charts
        updateChartData(matchStats);
      } catch (error) {
        console.error('Error loading match data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const updateChartData = (stats: MatchStats) => {
      console.log('Updating chart data with stats:', stats);
      
      // Format monthly data for bar chart
      const monthData = MONTHS.map((month, index) => ({
        month: month,
        matches: stats.monthlyMatches[index]
      }));
      
      // Format result data for pie chart
      const resultData = [
        { name: 'Wins', value: stats.resultCounts.win },
        { name: 'Losses', value: stats.resultCounts.loss },
        { name: 'Training', value: stats.resultCounts.training }
      ].filter(item => item.value > 0); // Only include non-zero results
      
      console.log('Chart data - monthly:', monthData);
      console.log('Chart data - results:', resultData);
      
      setChartData({
        matchData: monthData,
        resultData: resultData
      });
    };
    
    // Initial load
    loadData();
    
    // Set up real-time subscription
    const channel = subscribeToMatches(async (updatedMatches) => {
      console.log('Real-time update received:', updatedMatches.length, 'matches');
      setMatches(updatedMatches);
      const updatedStats = await getMatchStatsFromSupabase();
      console.log('Updated stats from real-time:', updatedStats);
      setStats(updatedStats);
      
      // Update chart data
      updateChartData(updatedStats);
    });
    
    return () => {
      // Clean up subscription on unmount
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate win rate
  const winRate = stats.resultCounts.win + stats.resultCounts.loss > 0
    ? Math.round((stats.resultCounts.win / (stats.resultCounts.win + stats.resultCounts.loss)) * 100)
    : 0;

  // Format total duration - corrected to handle hours and minutes properly
  const formatDuration = (minutes: number) => {
    if (isNaN(minutes) || minutes <= 0) return "0 mins";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'}${mins > 0 ? ` ${mins} min${mins === 1 ? '' : 's'}` : ''}`;
    } else {
      return `${mins} min${mins === 1 ? '' : 's'}`;
    }
  };

  // Get recent matches (top 5)
  const recentMatches = matches.slice(0, 5);

  console.log('Hook returning stats:', stats);
  console.log('Hook returning matches count:', matches.length);

  return {
    matches,
    stats,
    chartData,
    loading,
    winRate,
    formatDuration,
    recentMatches
  };
};
