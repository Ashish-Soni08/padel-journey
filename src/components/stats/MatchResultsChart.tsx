
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Percent } from "lucide-react";

// Colors for the charts
const COLORS = ['#0088FE', '#FF8042', '#8B5CF6'];

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

  return (
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
  );
};

export default MatchResultsChart;
