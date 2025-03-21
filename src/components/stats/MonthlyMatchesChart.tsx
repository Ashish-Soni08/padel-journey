
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from "lucide-react";

interface MonthlyMatchesChartProps {
  matchData: { month: string; matches: number }[];
}

const MonthlyMatchesChart: React.FC<MonthlyMatchesChartProps> = ({ matchData }) => {
  // Custom bar chart tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{`${label}: ${payload[0].value} matches`}</p>
        </div>
      );
    }
    return null;
  };

  return (
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.1)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'var(--foreground)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fill: 'var(--foreground)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend />
            <Bar 
              name="Match Count" 
              dataKey="matches" 
              fill="#0088FE" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              barSize={30}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyMatchesChart;
