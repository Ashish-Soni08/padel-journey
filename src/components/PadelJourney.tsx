
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
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Banner image section - only for the header */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/lovable-uploads/ca47d752-436c-4bd3-8b60-ae73b6357294.png')"
        }}
      >
        {/* Semi-transparent overlay for better readability */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]"></div>
        
        {/* Profile header content */}
        <div className="container px-4 py-4 mx-auto max-w-6xl relative h-full">
          <ProfileHeader />
        </div>
      </div>
      
      {/* Tabs and content section */}
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
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
              <div className="glass-panel rounded-lg p-6">
                <MatchForm />
              </div>
            </TabsContent>
            
            <TabsContent 
              value="stats" 
              className="animate-fade-in tab-transition mt-4"
            >
              <div className="glass-panel rounded-lg p-6">
                <StatsView />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PadelJourney;
