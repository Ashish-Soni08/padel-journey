
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { MatchData } from "@/services/matchDatabase";

interface RecentMatchesListProps {
  matches: MatchData[];
}

const RecentMatchesList: React.FC<RecentMatchesListProps> = ({ matches }) => {
  // Helper function to format partners list
  const formatPartners = (partners: string[]) => {
    if (partners.length === 0) return "";
    if (partners.length === 1) return partners[0];
    return partners.join(", ");
  };

  return (
    <Card className="glass-panel animate-fade-up" style={{ animationDelay: "0.4s" }}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Partners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-4">Last 5 Matches</h3>
        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => {
              const partners = [];
              if (match.player1) partners.push(match.player1);
              if (match.player2) partners.push(match.player2);
              if (match.player3) partners.push(match.player3);
              
              return (
                <div key={match.id} className="flex items-center p-3 border rounded-lg">
                  <div className="flex items-center flex-1">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="User" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">You with {formatPartners(partners)}</span>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(match.date), 'yyyy-MM-dd')}
                      </div>
                      <div className={`text-sm mt-1 font-medium ${
                        match.result === 'win' 
                          ? 'text-green-500' 
                          : match.result === 'loss' 
                            ? 'text-red-500' 
                            : 'text-blue-500'
                      }`}>
                        {match.result === 'win' ? 'Win' : match.result === 'loss' ? 'Loss' : 'Training'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No matches found. Add your first match to see stats!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMatchesList;
