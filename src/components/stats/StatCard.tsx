
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
    <Card className="glass-panel card-hover animate-fade-up overflow-hidden relative" style={{ animationDelay: "0.1s" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 dark:opacity-30" />
      <CardContent className="pt-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-primary/15 rounded-full text-primary dark:text-primary-foreground">
            {icon}
          </div>
          <span className="text-3xl font-bold text-primary dark:text-primary-foreground">{value}</span>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
