
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
  return <div className={cn("flex flex-col items-center space-y-6 py-8", className)}>
      <h1 className="text-4xl tracking-tight animate-fade-in font-bold text-center md:text-7xl">Ashish's Padel Journey </h1>
      
      <div className="flex flex-col items-center space-y-4 animate-fade-up" style={{
      animationDelay: "0.2s"
    }}>
        <div className="overflow-visible h-32 w-32 md:h-48 md:w-48">
          <img src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="Ashish" className="profile-image h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-white object-[center_25%]" loading="lazy" />
        </div>
        <div className="animate-scale-in" style={{
        animationDelay: "0.5s"
      }}>
          <Flex gap="3">
            <Badge color="blue">Beginner</Badge>
            <Badge color="blue">Right-handed</Badge>
          </Flex>
        </div>
      </div>
    </div>;
};

export default ProfileHeader;
