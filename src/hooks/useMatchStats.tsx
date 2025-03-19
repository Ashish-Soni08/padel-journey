
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
        const allMatches = await getAllMatchesFromSupabase();
        const matchStats = await getMatchStatsFromSupabase();
        
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
      // Format monthly data for bar chart
      const monthData = stats.monthlyMatches
        .map((count, index) => ({
          month: MONTHS[index],
          matches: count
        }));
      
      // Format result data for pie chart
      const resultData = [
        { name: 'Wins', value: stats.resultCounts.win },
        { name: 'Losses', value: stats.resultCounts.loss },
        { name: 'Training', value: stats.resultCounts.training }
      ];
      
      setChartData({
        matchData: monthData,
        resultData: resultData
      });
    };
    
    // Initial load
    loadData();
    
    // Set up real-time subscription
    const channel = subscribeToMatches(async (updatedMatches) => {
      setMatches(updatedMatches);
      const updatedStats = await getMatchStatsFromSupabase();
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

  // Format total duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}${mins > 0 ? ` ${mins} min` : ''}`;
  };

  // Get recent matches (top 5)
  const recentMatches = matches.slice(0, 5);

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
