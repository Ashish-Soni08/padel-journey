
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface MonthlyMatchesChartProps {
  matchData: { month: string; matches: number }[];
}

const MonthlyMatchesChart: React.FC<MonthlyMatchesChartProps> = ({ matchData }) => {
  // Chart configuration
  const chartConfig = {
    matches: {
      label: "Matches",
      color: "hsl(var(--chart-1))"
    }
  };

  return (
    <Card className="glass-panel col-span-1 animate-fade-up shadow-md border-border" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Court Time by Month - {new Date().getFullYear()} Season
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full">
          <BarChart
            data={matchData}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.8} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'var(--foreground)' }}
              axisLine={{ stroke: 'var(--border)', strokeWidth: 1.5 }}
              tickLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fill: 'var(--foreground)' }}
              axisLine={{ stroke: 'var(--border)', strokeWidth: 1.5 }}
              tickLine={{ stroke: 'var(--border)' }}
              width={40}
            />
            <ChartTooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border rounded-md shadow-md p-3 text-sm">
                      <p className="font-medium">{`${label}: ${payload[0].value} matches`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="square"
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Bar 
              name="Match Count" 
              dataKey="matches" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              barSize={30}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyMatchesChart;
