
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flex } from "@/components/ui/flex";
import { ThemeToggle } from './ThemeToggle';

interface ProfileHeaderProps {
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center space-y-6 py-8 relative", className)}>
      <div className="absolute top-0 right-0 md:right-4">
        <ThemeToggle />
      </div>
      
      <h1 className="text-4xl tracking-tight animate-fade-in font-bold text-center md:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
        Ashish's Padel Journey
      </h1>
      
      <div className="flex flex-col items-center space-y-5 animate-fade-up" style={{
        animationDelay: "0.2s"
      }}>
        <div className="overflow-visible h-32 w-32 md:h-40 md:w-40 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent -z-10 blur-lg opacity-70"></div>
          <img 
            src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" 
            alt="Ashish" 
            className="profile-image h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-background shadow-xl object-[center_25%]" 
            loading="lazy" 
          />
        </div>
        <div className="animate-scale-in" style={{
          animationDelay: "0.5s"
        }}>
          <Flex align="center" gap="3">
            <Badge size="2" color="indigo" className="text-xs md:text-sm px-3 py-1 font-medium">
              Beginner
            </Badge>
            <Badge size="2" color="indigo" className="text-xs md:text-sm px-3 py-1 font-medium">
              Right-handed
            </Badge>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
