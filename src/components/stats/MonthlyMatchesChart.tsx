
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
        <div className="glass-panel px-3 py-2 text-sm">
          <p className="font-medium">{`${label}: ${payload[0].value} matches`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-panel card-hover col-span-1 animate-fade-up overflow-hidden" style={{ animationDelay: "0.2s" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Court Time by Month
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={matchData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'var(--foreground)', fontSize: 12 }}  
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fill: 'var(--foreground)', fontSize: 12 }}  
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={{ stroke: 'var(--border)' }}
              width={30}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--primary)', opacity: 0.1 }} />
            <Legend 
              formatter={(value) => <span style={{ color: 'var(--foreground)', fontSize: '12px' }}>{value}</span>}
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Bar 
              name="Match Count" 
              dataKey="matches" 
              fill="hsl(var(--primary))" 
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
