
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProfileHeader from "./ProfileHeader";
import MatchForm from "./MatchForm";
import StatsView from "./StatsView";
import { Home, BarChart2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface PadelJourneyProps {
  className?: string;
  defaultTab?: "home" | "stats";
}

const PadelJourney: React.FC<PadelJourneyProps> = ({ 
  className,
  defaultTab = "home"
}) => {
  return (
    <div className={cn("container px-4 py-8 mx-auto max-w-6xl relative", className)}>
      <div className="absolute top-4 right-0 z-10">
        <ThemeToggle />
      </div>
      
      <ProfileHeader />
      
      <div className="mt-3 animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex justify-center mb-2">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger 
                value="home"
                className="flex items-center space-x-2 tab-transition"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stats"
                className="flex items-center space-x-2 tab-transition"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent 
            value="home" 
            className="tab-transition mt-4"
          >
            <MatchForm />
          </TabsContent>
          
          <TabsContent 
            value="stats" 
            className="tab-transition mt-4"
          >
            <StatsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PadelJourney;
