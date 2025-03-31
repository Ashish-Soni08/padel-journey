
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flex } from "@/components/ui/flex";

interface ProfileHeaderProps {
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center space-y-8 py-10 px-4 relative", className)}>
      {/* Background padel court image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/50 z-10"></div>
        <img 
          src="/lovable-uploads/5c82fb8a-cdb2-4246-b5a1-a872cdf36dab.png" 
          alt="Padel court" 
          className="w-full h-full object-cover opacity-60 z-0" 
        />
      </div>
      
      <div className="w-full max-w-3xl mx-auto relative z-20">
        <h1 className="text-3xl tracking-tight animate-fade-in font-bold text-center md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 py-2">
          Ashish's Padel Journey 
        </h1>
      </div>
      
      <div 
        className="flex flex-col items-center space-y-6 animate-fade-up relative z-20" 
        style={{ animationDelay: "0.2s" }}
      >
        <div className="overflow-visible h-32 w-32 md:h-48 md:w-48 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full opacity-70 animate-pulse" style={{ animationDuration: "3s" }}></div>
          <img 
            src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" 
            alt="Ashish" 
            className="profile-image h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-white object-[center_25%] relative z-10" 
            loading="lazy" 
          />
        </div>
        <div 
          className="animate-scale-in" 
          style={{ animationDelay: "0.5s" }}
        >
          <Flex align="center" gap="3">
            <Badge size="3" color="indigo" className="px-4 py-1 text-sm">Beginner</Badge>
            <Badge size="3" color="indigo" className="px-4 py-1 text-sm">Right-handed</Badge>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
