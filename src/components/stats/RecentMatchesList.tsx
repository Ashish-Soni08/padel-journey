
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Trash2, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { MatchData } from "@/services/matchDatabase";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteMatchFromSupabase } from "@/services/matchSupabase";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Function to format duration
  const formatDuration = (duration: string) => {
    // Try to parse the duration as a number of minutes
    const minutes = parseInt(duration.replace(/\D/g, ''), 10);
    if (isNaN(minutes)) return duration;
    
    // Format as hours and minutes if > 60 minutes
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}${remainingMinutes > 0 ? `h ${remainingMinutes}min` : 'h'}`;
    }
    
    return `${minutes}min`;
  };

  // Function to check if a match can be deleted (is most recent and within 3 days)
  const canDeleteMatch = (match: MatchData, index: number) => {
    // Only the most recent match can be deleted (first in the array)
    if (index !== 0) return false;
    
    // Check if the match date is within the last 3 days
    const matchDate = new Date(match.date);
    const today = new Date();
    const daysSinceMatch = differenceInDays(today, matchDate);
    
    return daysSinceMatch <= 3;
  };

  // Function to handle match deletion
  const handleDeleteMatch = async (id: string) => {
    const success = await deleteMatchFromSupabase(id);
    
    if (success) {
      toast({
        title: "Match deleted",
        description: "The match has been successfully deleted",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the match. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass-panel animate-fade-up shadow-md" style={{ animationDelay: "0.4s" }}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Match History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-4">All Matches</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {matches.length > 0 ? (
              matches.map((match, index) => {
                const partners = [];
                if (match.player1) partners.push(match.player1);
                if (match.player2) partners.push(match.player2);
                if (match.player3) partners.push(match.player3);
                
                const isDeletable = canDeleteMatch(match, index);
                
                return (
                  <div key={match.id} className="flex items-center p-3 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center flex-1">
                      <Avatar className="h-12 w-12 mr-4 shadow-sm">
                        <AvatarImage src="/lovable-uploads/f91d264e-3813-4ab3-9c96-15b774480dbf.png" alt="User" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="font-medium text-foreground">You with {formatPartners(partners)}</span>
                        <div className="text-sm text-muted-foreground flex items-center space-x-4">
                          <span>{format(new Date(match.date), 'yyyy-MM-dd')}</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{formatDuration(match.duration)}</span>
                          </div>
                        </div>
                        <div className={`text-sm mt-1 font-medium ${getResultColor(match.result)}`}>
                          {match.result === 'win' ? 'Win' : match.result === 'loss' ? 'Loss' : 'Training'}
                        </div>
                      </div>
                    </div>
                    {isDeletable ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete match"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete match</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this match? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteMatch(match.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No matches found. Add your first match to see stats!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentMatchesList;
