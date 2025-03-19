
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col items-center space-y-6 py-8", className)}>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
        Ashish's Padel Journey
      </h1>
      
      <div className="flex flex-col items-center space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="overflow-visible h-32 w-32 md:h-48 md:w-48">
          <img 
            src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" 
            alt="Ashish" 
            className="profile-image h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-white object-[center_80%]"
            loading="lazy"
          />
        </div>
        <Badge className="bg-primary text-white text-md px-3 py-1 rounded-full shadow-lg animate-scale-in" style={{ animationDelay: "0.5s" }}>
          Beginner
        </Badge>
      </div>
    </div>
  );
};

export default ProfileHeader;
