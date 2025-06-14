import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addMatchToSupabase } from "@/services/matchSupabase";
const formSchema = z.object({
  date: z.date({
    required_error: "Match date is required"
  }),
  matchType: z.enum(["training", "competitive"], {
    required_error: "Match type is required"
  }),
  matchFormat: z.enum(["1v1", "2v2"], {
    required_error: "Match format is required"
  }),
  player1: z.string().min(2, {
    message: "Please enter the first player's name"
  }),
  player2: z.string().optional(),
  player3: z.string().optional(),
  result: z.enum(["win", "loss", "training"]).optional(),
  duration: z.string().min(1, {
    message: "Please enter the match duration"
  }).refine(val => {
    const numericValue = parseInt(val.replace(/[^0-9]/g, ''));
    return !isNaN(numericValue) && numericValue >= 60;
  }, {
    message: "Duration must be at least 60 minutes"
  }),
  venue: z.string().min(2, {
    message: "Please enter the venue name"
  }),
  notes: z.string().optional()
}).refine(data => {
  if (data.matchType === "training") {
    return true;
  }
  return !!data.result;
}, {
  message: "Result is required for competitive matches",
  path: ["result"]
});
type FormData = z.infer<typeof formSchema>;
interface MatchFormProps {
  className?: string;
  onMatchAdded?: (data: FormData) => void;
}
const MatchForm: React.FC<MatchFormProps> = ({
  className,
  onMatchAdded
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      matchType: "training",
      matchFormat: "2v2",
      player1: "",
      player2: "",
      player3: "",
      result: undefined,
      duration: "",
      venue: "",
      notes: ""
    },
    mode: "onChange" // Enable validations on change for better user feedback
  });
  const watchMatchType = form.watch("matchType");
  const watchMatchFormat = form.watch("matchFormat");
  const formErrors = form.formState.errors;

  // Effect to show toast for validation errors
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      // Find the first error to display
      const firstErrorField = Object.keys(formErrors)[0];
      const errorMessage = formErrors[firstErrorField as keyof typeof formErrors]?.message;
      if (errorMessage) {
        setFormError(`${firstErrorField}: ${errorMessage}`);
      }
    } else {
      setFormError(null);
    }
  }, [formErrors]);
  useEffect(() => {
    if (watchMatchType === "training") {
      form.setValue("result", undefined);
    } else if (!form.getValues("result")) {
      form.setValue("result", "win");
    }
  }, [watchMatchType, form]);

  // Hide success message after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessMessage]);
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      // Save match to Supabase
      const newMatch = await addMatchToSupabase({
        date: data.date,
        matchType: data.matchType,
        matchFormat: data.matchFormat,
        player1: data.player1,
        player2: data.player2,
        player3: data.player3,
        result: data.result,
        duration: data.duration,
        venue: data.venue,
        notes: data.notes
      });
      if (!newMatch) {
        throw new Error("Failed to save match data");
      }

      // Format player names for display
      const players = [data.player1];
      if (watchMatchFormat === "2v2") {
        if (data.player2) players.push(data.player2);
        if (data.player3) players.push(data.player3);
      }
      toast({
        title: "Match recorded!",
        description: `Your ${data.matchType === "training" ? "training session" : data.result} at ${data.venue} has been saved.`
      });
      setShowSuccessMessage(true);
      if (onMatchAdded) {
        // Convert to original format for backward compatibility
        const formattedData = {
          ...data,
          players: players.join(", ")
        };
        onMatchAdded(formattedData as any);
      }
      form.reset({
        date: new Date(),
        matchType: "training",
        matchFormat: "2v2",
        player1: "",
        player2: "",
        player3: "",
        result: undefined,
        duration: "",
        venue: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error saving match:", error);
      setFormError("Failed to save your match data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to save your match data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <Card className={cn("w-full max-w-3xl mx-auto glass-panel animate-fade-up", className)} style={{
    animationDelay: "0.3s"
  }}>
      <CardHeader>
        <CardTitle className="text-2xl">Match Data</CardTitle>
      </CardHeader>
      <CardContent>
        {formError && <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {formError}
            </AlertDescription>
          </Alert>}
        
        {showSuccessMessage && <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Match data has been successfully saved!
            </AlertDescription>
          </Alert>}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="date" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full h-10 pl-3 text-left font-normal justify-start", !field.value && "text-muted-foreground", formErrors.date && "border-red-500")}>
                            {field.value ? format(field.value, "PPP") : <span>Select match date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date > new Date()} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="matchType" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn("h-10", formErrors.matchType && "border-red-500")}>
                          <SelectValue placeholder="Training or Competitive" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="competitive">Competitive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="matchFormat" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn("h-10", formErrors.matchFormat && "border-red-500")}>
                          <SelectValue placeholder="1v1 or 2v2" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1v1">1v1</SelectItem>
                        <SelectItem value="2v2">2v2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              {watchMatchType === "competitive" && <FormField control={form.control} name="result" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Result</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn("h-10", formErrors.result && "border-red-500")}>
                            <SelectValue placeholder="Win, Loss, or Training" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="win">Win</SelectItem>
                          <SelectItem value="loss">Loss</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />}
              
              {/* Player fields */}
              <div className={`col-span-1 md:col-span-2 grid grid-cols-1 ${watchMatchFormat === "1v1" ? "" : "md:grid-cols-3"} gap-4`}>
                <FormField control={form.control} name="player1" render={({
                field
              }) => <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel>Player 1</FormLabel>
                        <FormControl>
                          <Input className={cn("h-10", formErrors.player1 && "border-red-500")} placeholder={watchMatchFormat === "1v1" ? "e.g. John Smith" : "Player name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                
                {watchMatchFormat === "2v2" && <>
                    <FormField control={form.control} name="player2" render={({
                  field
                }) => <FormItem className="flex flex-col space-y-1.5">
                            <FormLabel>Player 2</FormLabel>
                            <FormControl>
                              <Input className={cn("h-10", formErrors.player2 && "border-red-500")} placeholder="Player name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    
                    <FormField control={form.control} name="player3" render={({
                  field
                }) => <FormItem className="flex flex-col space-y-1.5">
                            <FormLabel>Player 3</FormLabel>
                            <FormControl>
                              <Input className={cn("h-10", formErrors.player3 && "border-red-500")} placeholder="Player name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                  </>}
              </div>
              
              <FormField control={form.control} name="duration" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input className={cn("h-10", formErrors.duration && "border-red-500")} placeholder="Duration in minutes (min. 60)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="venue" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5" style={{
              gridColumn: "1 / -1"
            }}>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input className={cn("h-10", formErrors.venue && "border-red-500")} placeholder="Club name and location e.g. PadelCity Leipzig" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>
            
            <FormField control={form.control} name="notes" render={({
            field
          }) => <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Record thoughts on improvements or areas to work on" className={cn("min-h-[100px]", formErrors.notes && "border-red-500")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <Button type="submit" className="w-full sm:w-auto transition-all duration-300 ease-in-out hover:shadow-lg" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Match"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>;
};
export default MatchForm;