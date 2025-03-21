
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Percent } from "lucide-react";

// Colors that will respect the current theme from our CSS variables
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-5))'
];

interface MatchResultsChartProps {
  resultData: { name: string; value: number }[];
}

const MatchResultsChart: React.FC<MatchResultsChartProps> = ({ resultData }) => {
  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // If the value is 0, don't render a label
    if (resultData[index].value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    // Increase the distance from the center for better separation
    const radius = outerRadius * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="13"
        fontWeight="600"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip component to show exact counts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-panel px-3 py-2 text-sm">
          <p className="font-semibold">{`${data.name}: ${data.value}`}</p>
          <p className="text-xs text-muted-foreground">{`${(data.payload.percent * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate percentages for tooltip
  const total = resultData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercent = resultData.map(item => ({
    ...item,
    percent: total > 0 ? item.value / total : 0
  }));

  return (
    <Card className="glass-panel card-hover col-span-1 animate-fade-up overflow-hidden" style={{ animationDelay: "0.3s" }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Percent className="h-5 w-5 mr-2 text-primary" />
          Match Results
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              fill="hsl(var(--primary))"
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
              label={renderCustomizedLabel}
              labelLine={false}
              strokeWidth={1}
              stroke="var(--background)"
            >
              {dataWithPercent.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="drop-shadow-sm hover:opacity-90 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MatchResultsChart;
