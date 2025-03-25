
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Percent } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface MatchResultsChartProps {
  resultData: { name: string; value: number }[];
}

const MatchResultsChart: React.FC<MatchResultsChartProps> = ({ resultData }) => {
  // Improved color palette for better contrast and accessibility
  const COLORS = [
    '#0EA5E9', // Ocean Blue
    '#F97316', // Bright Orange
    '#8B5CF6'  // Vivid Purple
  ];

  // Chart configuration
  const chartConfig = {
    wins: {
      label: "Wins",
      color: COLORS[0]
    },
    losses: {
      label: "Losses",
      color: COLORS[1]
    },
    training: {
      label: "Training",
      color: COLORS[2]
    }
  };

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // If the value is 0, don't render a label
    if (resultData[index].value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    // Increase the distance from the center for better separation
    const radius = outerRadius * 0.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#FFFFFF"
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="13"
        fontWeight="600"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.4))' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="glass-panel col-span-1 animate-fade-up shadow-md border-border" style={{ animationDelay: "0.3s" }}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Percent className="h-5 w-5 mr-2 text-primary" />
          Match Results
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full">
          <PieChart>
            <Pie
              data={resultData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
              label={renderCustomizedLabel}
              labelLine={false}
              strokeWidth={2}
              stroke="var(--card)"
            >
              {resultData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="drop-shadow-md hover:opacity-90 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  const total = resultData.reduce((sum, item) => sum + item.value, 0);
                  const percent = total > 0 ? ((data.value as number) / total) * 100 : 0;
                  
                  return (
                    <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                      <p className="font-semibold text-sm">{`${data.name}: ${data.value}`}</p>
                      <p className="text-xs text-muted-foreground">{`${percent.toFixed(1)}% of total`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MatchResultsChart;
