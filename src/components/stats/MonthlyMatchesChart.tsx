
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface MonthlyMatchesChartProps {
  matchData: { month: string; matches: number }[];
  currentYear?: number;
}

const MonthlyMatchesChart: React.FC<MonthlyMatchesChartProps> = ({ 
  matchData,
  currentYear = new Date().getFullYear()
}) => {
  return (
    <Card className="h-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Monthly Matches ({currentYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            matches: {
              label: "Matches",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={matchData}
              margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar
                dataKey="matches"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyMatchesChart;
