
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2, Award, Clock, Calendar } from "lucide-react";
import { useMatchStats } from "@/hooks/useMatchStats";
import StatCard from "@/components/stats/StatCard";
import MonthlyMatchesChart from "@/components/stats/MonthlyMatchesChart";
import MatchResultsChart from "@/components/stats/MatchResultsChart";
import RecentMatchesList from "@/components/stats/RecentMatchesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsView: React.FC<{ className?: string }> = ({ className }) => {
  const { 
    stats, 
    chartData, 
    loading, 
    winRate, 
    formatDuration,
    matches 
  } = useMatchStats();

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
          description="Since November 2024"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Total Duration"
          value={formatDuration(stats.totalDuration)}
          description={`${stats.totalDuration} minutes played`}
        />
      </div>

      <Card className="shadow-md border-border">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MonthlyMatchesChart matchData={chartData.matchData} />
            <MatchResultsChart resultData={chartData.resultData} />
          </div>
        </CardContent>
      </Card>

      <RecentMatchesList matches={matches} />
    </div>
  );
};

export default StatsView;
