
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <div className={cn("container px-4 py-8 mx-auto max-w-6xl relative", className)}>
      <ProfileHeader />
      
      <div className="mt-3 animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <Tabs 
          defaultValue={defaultTab} 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "home" | "stats")}
        >
          <div className="flex justify-center mb-2">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger 
                value="home"
                className={cn(
                  "flex items-center space-x-2 tab-transition",
                  activeTab === "home" ? "animate-scale-in" : ""
                )}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stats"
                className={cn(
                  "flex items-center space-x-2 tab-transition",
                  activeTab === "stats" ? "animate-scale-in" : ""
                )}
              >
                <BarChart2 className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent 
            value="home" 
            className="animate-fade-in tab-transition mt-4"
          >
            <MatchForm />
          </TabsContent>
          
          <TabsContent 
            value="stats" 
            className="animate-fade-in tab-transition mt-4"
          >
            <StatsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PadelJourney;
