
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, Clock, Calendar, Activity, Users, Percent } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StatsViewProps {
  className?: string;
}

// Sample data - would be replaced with real data in a production app
const matchData = [
  { month: 'Jan', matches: 1 },
  { month: 'Feb', matches: 1 },
  { month: 'Mar', matches: 3 },
  { month: 'Apr', matches: 0 },
  { month: 'May', matches: 0 },
  { month: 'Jun', matches: 0 },
];

// Updated to show 0 wins, 0 losses, and 5 training sessions
const resultData = [
  { name: 'Wins', value: 0 },
  { name: 'Losses', value: 0 },
  { name: 'Training', value: 5 }
];

// Last 5 matches sample data - ordered with most recent first
const recentMatches = [
  { 
    id: 1, 
    date: '2023-06-25',
    partners: ['Sarah', 'John'],
    type: 'Tournament',
    result: 'Training'
  },
  { 
    id: 2, 
    date: '2023-06-18',
    partners: ['David'],
    type: 'Match',
    result: 'Training'
  },
  { 
    id: 3, 
    date: '2023-06-15',
    partners: ['Michael', 'Emma'],
    type: 'Training',
    result: 'Training'
  },
  { 
    id: 4, 
    date: '2023-06-08',
    partners: ['Carlos'],
    type: 'Match',
    result: 'Training'
  },
  { 
    id: 5, 
    date: '2023-06-01',
    partners: ['Alex'],
    type: 'Match',
    result: 'Training'
  }
];

// Updated colors to include training (blue)
const COLORS = ['#0088FE', '#FF8042', '#8B5CF6'];

const StatsView: React.FC<StatsViewProps> = ({ className }) => {
  // Helper function to format partners list
  const formatPartners = (partners: string[]) => {
    if (partners.length === 0) return "";
    if (partners.length === 1) return partners[0];
    return partners.join(", ");
  };

  // Custom label renderer that improves spacing and handles overlapping
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
    <div className={cn("space-y-8 animate-fade-up", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Award className="h-6 w-6" />}
          title="Win Rate"
          value="0%"
          description="0 wins, 0 losses, 5 training"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          title="Total Matches"
          value="5"
          description="Since January 2025"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Total Duration"
          value="6 hrs"
          description="360 minutes played"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel col-span-1 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Court Time by Month - 2025 Season
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
            {recentMatches.map((match) => (
              <div key={match.id} className="flex items-center p-3 border rounded-lg">
                <div className="flex items-center flex-1">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="User" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">You with {formatPartners(match.partners)}</span>
                    <div className="text-sm text-muted-foreground">
                      {match.date}
                    </div>
                    <div className={`text-sm mt-1 font-medium ${
                      match.result === 'Win' 
                        ? 'text-green-500' 
                        : match.result === 'Loss' 
                          ? 'text-red-500' 
                          : 'text-blue-500'
                    }`}>
                      {match.result}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
