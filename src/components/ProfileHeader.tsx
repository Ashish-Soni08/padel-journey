
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
      
      <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <img 
          src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" 
          alt="Ashish" 
          className="profile-image h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-white"
          loading="lazy"
        />
        <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 animate-scale-in" style={{ animationDelay: "0.5s" }}>
          <Badge className="bg-primary text-white text-md px-3 py-1 rounded-full shadow-lg">
            Beginner
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
