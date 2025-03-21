
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProfileHeader from "./ProfileHeader";
import MatchForm from "./MatchForm";
import StatsView from "./StatsView";
import { Home, BarChart2 } from "lucide-react";

interface PadelJourneyProps {
  className?: string;
  defaultTab?: "home" | "stats";
}

const PadelJourney: React.FC<PadelJourneyProps> = ({ 
  className,
  defaultTab = "home"
}) => {
  return (
    <div className={cn("container px-4 py-6 pb-12 mx-auto max-w-6xl relative", className)}>
      <ProfileHeader />
      
      <div className="mt-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex justify-center mb-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-background/50 backdrop-blur-sm shadow-md">
              <TabsTrigger 
                value="home"
                className="flex items-center space-x-2 tab-transition data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stats"
                className="flex items-center space-x-2 tab-transition data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent 
            value="home" 
            className="tab-transition mt-6"
          >
            <MatchForm />
          </TabsContent>
          
          <TabsContent 
            value="stats" 
            className="tab-transition mt-6"
          >
            <StatsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PadelJourney;
