
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, Clock, Calendar, Activity, Users, Percent } from "lucide-react";

interface StatsViewProps {
  className?: string;
}

// Sample data - would be replaced with real data in a production app
const matchData = [
  { month: 'Jan', matches: 2 },
  { month: 'Feb', matches: 3 },
  { month: 'Mar', matches: 5 },
  { month: 'Apr', matches: 4 },
  { month: 'May', matches: 6 },
  { month: 'Jun', matches: 4 },
];

const resultData = [
  { name: 'Wins', value: 12 },
  { name: 'Losses', value: 8 },
];

const COLORS = ['#0088FE', '#FF8042'];

const StatsView: React.FC<StatsViewProps> = ({ className }) => {
  return (
    <div className={cn("space-y-8 animate-fade-up", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Award className="h-6 w-6" />}
          title="Win Rate"
          value="60%"
          description="12 wins, 8 losses"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          title="Total Matches"
          value="20"
          description="Since January 2023"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Avg. Duration"
          value="1h 20m"
          description="Per match"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel col-span-1 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Matches by Month
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
            Common Partners and Opponents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Frequent Partners</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>David</span>
                  <span className="text-muted-foreground">6 matches</span>
                </li>
                <li className="flex justify-between">
                  <span>Sarah</span>
                  <span className="text-muted-foreground">4 matches</span>
                </li>
                <li className="flex justify-between">
                  <span>Michael</span>
                  <span className="text-muted-foreground">3 matches</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Common Opponents</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>James & Emma</span>
                  <span className="text-muted-foreground">5 matches</span>
                </li>
                <li className="flex justify-between">
                  <span>Carlos & Sophia</span>
                  <span className="text-muted-foreground">3 matches</span>
                </li>
                <li className="flex justify-between">
                  <span>Alex & Rachel</span>
                  <span className="text-muted-foreground">2 matches</span>
                </li>
              </ul>
            </div>
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
