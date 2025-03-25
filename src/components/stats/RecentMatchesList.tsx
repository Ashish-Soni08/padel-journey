
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
  
  // Function to get result text color
  const getResultColor = (result: string) => {
    switch(result) {
      case 'win': return 'text-emerald-600';
      case 'loss': return 'text-rose-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Card className="glass-panel animate-fade-up shadow-md" style={{ animationDelay: "0.4s" }}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
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
                <div key={match.id} className="flex items-center p-3 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                  <div className="flex items-center flex-1">
                    <Avatar className="h-12 w-12 mr-4 shadow-sm">
                      <AvatarImage src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="User" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-foreground">You with {formatPartners(partners)}</span>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(match.date), 'yyyy-MM-dd')}
                      </div>
                      <div className={`text-sm mt-1 font-medium ${getResultColor(match.result)}`}>
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
