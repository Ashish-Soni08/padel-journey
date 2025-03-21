
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

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

export default StatCard;
