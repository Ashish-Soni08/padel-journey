
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, Clock, Calendar, Activity, Users, Percent, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MatchData } from "@/services/matchDatabase";
import { getAllMatchesFromSupabase, getMatchStatsFromSupabase, subscribeToMatches } from "@/services/matchSupabase";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface StatsViewProps {
  className?: string;
}

// Colors for the charts
const COLORS = ['#0088FE', '#FF8042', '#8B5CF6'];

// Month abbreviations
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatsView: React.FC<StatsViewProps> = ({ className }) => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalDuration: 0,
    resultCounts: { win: 0, loss: 0, training: 0 },
    monthlyMatches: Array(12).fill(0)
  });
  const [matchData, setMatchData] = useState<{ month: string; matches: number }[]>([]);
  const [resultData, setResultData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allMatches = await getAllMatchesFromSupabase();
        const matchStats = await getMatchStatsFromSupabase();
        
        setMatches(allMatches);
        setStats(matchStats);
        
        // Format data for charts
        const monthData = matchStats.monthlyMatches
          .map((count, index) => ({
            month: MONTHS[index],
            matches: count
          }));
        
        const resultData = [
          { name: 'Wins', value: matchStats.resultCounts.win },
          { name: 'Losses', value: matchStats.resultCounts.loss },
          { name: 'Training', value: matchStats.resultCounts.training }
        ];
        
        setMatchData(monthData);
        setResultData(resultData);
      } catch (error) {
        console.error('Error loading match data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial load
    loadData();
    
    // Set up real-time subscription
    const channel = subscribeToMatches(async (updatedMatches) => {
      setMatches(updatedMatches);
      const updatedStats = await getMatchStatsFromSupabase();
      setStats(updatedStats);
      
      // Update chart data
      const monthData = updatedStats.monthlyMatches
        .map((count, index) => ({
          month: MONTHS[index],
          matches: count
        }));
      
      const resultData = [
        { name: 'Wins', value: updatedStats.resultCounts.win },
        { name: 'Losses', value: updatedStats.resultCounts.loss },
        { name: 'Training', value: updatedStats.resultCounts.training }
      ];
      
      setMatchData(monthData);
      setResultData(resultData);
    });
    
    return () => {
      // Clean up subscription on unmount
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper function to format partners list
  const formatPartners = (partners: string[]) => {
    if (partners.length === 0) return "";
    if (partners.length === 1) return partners[0];
    return partners.join(", ");
  };

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // If the value is 0, don't render a label
    if (resultData[index].value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    // Increase the distance from the center for better separation
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 animate-fade-up", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Award className="h-6 w-6" />}
          title="Win Rate"
          value={`${winRate}%`}
          description={`${stats.resultCounts.win} wins, ${stats.resultCounts.loss} losses, ${stats.resultCounts.training} training`}
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          title="Total Matches"
          value={stats.totalMatches.toString()}
          description={`Since January 2023`}
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Total Duration"
          value={formatDuration(stats.totalDuration)}
          description={`${stats.totalDuration} minutes played`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel col-span-1 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Court Time by Month - {new Date().getFullYear()} Season
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={matchData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="matches" 
                  fill="#0088FE" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel col-span-1 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="h-5 w-5 mr-2" />
              Match Results
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resultData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {resultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium mb-4">Last 5 Matches</h3>
          <div className="space-y-4">
            {recentMatches.length > 0 ? (
              recentMatches.map((match) => {
                const partners = [];
                if (match.player1) partners.push(match.player1);
                if (match.player2) partners.push(match.player2);
                if (match.player3) partners.push(match.player3);
                
                return (
                  <div key={match.id} className="flex items-center p-3 border rounded-lg">
                    <div className="flex items-center flex-1">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="User" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">You with {formatPartners(partners)}</span>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(match.date), 'yyyy-MM-dd')}
                        </div>
                        <div className={`text-sm mt-1 font-medium ${
                          match.result === 'win' 
                            ? 'text-green-500' 
                            : match.result === 'loss' 
                              ? 'text-red-500' 
                              : 'text-blue-500'
                        }`}>
                          {match.result === 'win' ? 'Win' : match.result === 'loss' ? 'Loss' : 'Training'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No matches found. Add your first match to see stats!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => {
  return (
    <Card className="glass-panel animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
          <span className="text-3xl font-bold">{value}</span>
        </div>
        <div className="mt-2">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsView;
