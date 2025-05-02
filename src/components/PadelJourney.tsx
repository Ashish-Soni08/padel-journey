import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProfileHeader from "./ProfileHeader";
import MatchForm from "./MatchForm";
import StatsView from "./StatsView";
import { Home, BarChart2 } from "lucide-react";
import { setupDatabase } from "@/services/setup";
import { useMobile } from "@/lib/hooks";

interface PadelJourneyProps {
  className?: string;
  defaultTab?: "home" | "stats";
}

const PadelJourney: React.FC<PadelJourneyProps> = ({ 
  className,
  defaultTab = "home"
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const isMobile = useMobile();
  
  // Run database setup on first load
  useEffect(() => {
    const runSetup = async () => {
      try {
        await setupDatabase();
      } catch (err) {
        console.error("Failed to set up database:", err);
      }
    };
    
    runSetup();
  }, []);

  return (
    <div 
      className={cn(
        "min-h-screen bg-background relative", 
        className
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right corner decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-60"></div>
        
        {/* Bottom left corner decoration */}
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full opacity-50"></div>
        
        {/* Padel racket outlines - subtly placed in background */}
        <div className="absolute top-[15%] left-[5%] w-[300px] h-[300px] opacity-5">
          <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full text-primary">
            <path d="M53.5,10.5c-7-7-17.1-8.2-23.6-2.9c-2,1.6-5.1,5.6-7.4,10.2h-6.1c-0.8,0-1.6,0.2-2.3,0.7l-7.6,5.1
            c-0.6,0.4-1,1-1.1,1.7c-0.1,0.7,0.1,1.4,0.5,2l5,6.9c0.6,0.9,1.7,1.3,2.7,1.1l0.4-0.1c-2.1,14.3,9.8,17.5,15.5,17.3
            c0.6,0,1-0.1,1-0.1c0.6-0.1,1.2-0.2,1.7-0.4c0.5-0.1,0.9-0.3,1.4-0.5c0.5-0.2,0.9-0.4,1.3-0.6c0.4-0.2,0.8-0.5,1.2-0.7
            c0.4-0.3,0.8-0.5,1.1-0.8c0.4-0.3,0.7-0.6,1-0.9c0.3-0.3,0.6-0.6,0.9-1c0.3-0.3,0.6-0.7,0.8-1.1c0.2-0.4,0.5-0.8,0.7-1.2
            c0.2-0.4,0.4-0.9,0.6-1.3c0.2-0.5,0.3-0.9,0.5-1.4c0.1-0.5,0.3-1,0.4-1.5c0.1-0.5,0.2-1.1,0.2-1.6c0-0.1,0-0.2,0-0.3
            c0-0.3,0-0.6,0-0.9c0-0.7-0.1-1.4-0.2-2.1c-0.1-0.7-0.3-1.3-0.5-1.9c-0.2-0.6-0.4-1.2-0.6-1.8c-0.2-0.4-0.4-0.8-0.6-1.2
            c2.4-1.2,5.1-2.9,7.9-5.3C61.7,27.6,60.5,17.5,53.5,10.5z M26.9,11.8c4.3-3.6,11.6-2.7,17,2.7s6.2,12.6,2.7,17
            c-0.9,1.1-2.2,2.3-3.8,3.5c-0.3-0.4-0.6-0.9-0.9-1.3c-1.5-1.7-3.3-3.1-5.4-4C39,26,40.3,22.5,38.9,19c-0.7-1.7-2-3-3.7-3.7
            c-3.4-1.4-7.4,0.2-9.9,4.2c-0.5-0.1-1.1-0.2-1.7-0.2c-0.1,0-0.3,0-0.4,0C24.8,15.6,25.6,12.9,26.9,11.8z"/>
          </svg>
        </div>
        
        {/* Another padel racket outline */}
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] opacity-5 rotate-45">
          <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full text-primary">
            <path d="M53.5,10.5c-7-7-17.1-8.2-23.6-2.9c-2,1.6-5.1,5.6-7.4,10.2h-6.1c-0.8,0-1.6,0.2-2.3,0.7l-7.6,5.1
            c-0.6,0.4-1,1-1.1,1.7c-0.1,0.7,0.1,1.4,0.5,2l5,6.9c0.6,0.9,1.7,1.3,2.7,1.1l0.4-0.1c-2.1,14.3,9.8,17.5,15.5,17.3
            c0.6,0,1-0.1,1-0.1c0.6-0.1,1.2-0.2,1.7-0.4c0.5-0.1,0.9-0.3,1.4-0.5c0.5-0.2,0.9-0.4,1.3-0.6c0.4-0.2,0.8-0.5,1.2-0.7
            c0.4-0.3,0.8-0.5,1.1-0.8c0.4-0.3,0.7-0.6,1-0.9c0.3-0.3,0.6-0.6,0.9-1c0.3-0.3,0.6-0.7,0.8-1.1c0.2-0.4,0.5-0.8,0.7-1.2
            c0.2-0.4,0.4-0.9,0.6-1.3c0.2-0.5,0.3-0.9,0.5-1.4c0.1-0.5,0.3-1,0.4-1.5c0.1-0.5,0.2-1.1,0.2-1.6c0-0.1,0-0.2,0-0.3
            c0-0.3,0-0.6,0-0.9c0-0.7-0.1-1.4-0.2-2.1c-0.1-0.7-0.3-1.3-0.5-1.9c-0.2-0.6-0.4-1.2-0.6-1.8c-0.2-0.4-0.4-0.8-0.6-1.2
            c2.4-1.2,5.1-2.9,7.9-5.3C61.7,27.6,60.5,17.5,53.5,10.5z M26.9,11.8c4.3-3.6,11.6-2.7,17,2.7s6.2,12.6,2.7,17
            c-0.9,1.1-2.2,2.3-3.8,3.5c-0.3-0.4-0.6-0.9-0.9-1.3c-1.5-1.7-3.3-3.1-5.4-4C39,26,40.3,22.5,38.9,19c-0.7-1.7-2-3-3.7-3.7
            c-3.4-1.4-7.4,0.2-9.9,4.2c-0.5-0.1-1.1-0.2-1.7-0.2c-0.1,0-0.3,0-0.4,0C24.8,15.6,25.6,12.9,26.9,11.8z"/>
          </svg>
        </div>
        
        {/* Padel court lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <div className="w-[80%] h-[70%] border-4 border-primary rounded-lg flex">
            <div className="w-1/2 h-full border-r-4 border-primary flex items-center justify-center">
              <div className="w-[80%] h-[60%] border-2 border-primary"></div>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
              <div className="w-[80%] h-[60%] border-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8 mx-auto max-w-6xl relative z-10">
        <ProfileHeader />
        
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <Tabs 
            defaultValue={defaultTab} 
            className="w-full"
            onValueChange={(value) => setActiveTab(value as "home" | "stats")}
          >
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-2 w-full max-w-md shadow-md">
                <TabsTrigger 
                  value="home"
                  className={cn(
                    "flex items-center space-x-2 tab-transition py-3",
                    activeTab === "home" ? "animate-scale-in" : ""
                  )}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className={cn(
                    "flex items-center space-x-2 tab-transition py-3",
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
              className="animate-fade-in tab-transition mt-6"
            >
              <div className="glass-panel rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10">
                <MatchForm />
              </div>
            </TabsContent>
            
            <TabsContent 
              value="stats" 
              className="animate-fade-in tab-transition mt-6"
            >
              <div className="glass-panel rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10">
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
