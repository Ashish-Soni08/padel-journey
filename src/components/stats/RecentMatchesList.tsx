
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

  // Helper to get badge color based on result
  const getResultStyles = (result: string) => {
    switch (result) {
      case 'win':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'loss':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getResultText = (result: string) => {
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <Card className="glass-panel card-hover animate-fade-up" style={{ animationDelay: "0.4s" }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Recent Partners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-4 text-muted-foreground">Last 5 Matches</h3>
        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map((match) => {
              const partners = [];
              if (match.player1) partners.push(match.player1);
              if (match.player2) partners.push(match.player2);
              if (match.player3) partners.push(match.player3);
              
              return (
                <div key={match.id} className="flex items-center p-3 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center flex-1">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-primary/20">
                      <AvatarImage src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary">AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">You with {formatPartners(partners)}</span>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(match.date), 'MMMM d, yyyy')}
                      </div>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getResultStyles(match.result)}`}>
                          {getResultText(match.result)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No matches found. Add your first match to see stats!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMatchesList;
