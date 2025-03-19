
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
  players: z.string().min(2, {
    message: "Please enter players' names"
  }),
  result: z.enum(["win", "loss", "training"]).optional(),
  duration: z.string()
    .min(1, { message: "Please enter the match duration" })
    .refine((val) => {
      // Extract numeric value (assuming format like "60 min", "90 minutes", etc.)
      const numericValue = parseInt(val.replace(/[^0-9]/g, ''));
      return !isNaN(numericValue) && numericValue >= 60;
    }, { message: "Duration must be at least 60 minutes" }),
  venue: z.string().min(2, {
    message: "Please enter the venue name"
  }),
  notes: z.string().optional()
}).refine(data => {
  // If matchType is training, result field should not be required
  if (data.matchType === "training") {
    return true;
  }
  // If matchType is competitive, result field is required
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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      matchType: "training",
      matchFormat: "2v2",
      players: "",
      result: undefined,
      duration: "",
      venue: "",
      notes: ""
    }
  });

  // Get the current value of matchType
  const watchMatchType = form.watch("matchType");

  // Reset result field when matchType changes to training
  useEffect(() => {
    if (watchMatchType === "training") {
      form.setValue("result", undefined);
    } else if (!form.getValues("result")) {
      // Set default result for competitive if not set
      form.setValue("result", "win");
    }
  }, [watchMatchType, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 800));
      console.log("Match data:", data);

      // Show success toast
      toast({
        title: "Match recorded!",
        description: `Your ${data.matchType === "training" ? "training session" : data.result} at ${data.venue} has been saved.`
      });

      // Call the callback if provided
      if (onMatchAdded) {
        onMatchAdded(data);
      }

      // Reset form
      form.reset({
        date: new Date(),
        matchType: "training",
        matchFormat: "2v2",
        players: "",
        result: undefined,
        duration: "",
        venue: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error saving match:", error);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field - with updated placeholder */}
              <FormField control={form.control} name="date" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full h-10 pl-3 text-left font-normal justify-start", !field.value && "text-muted-foreground")}>
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

              {/* Match Type Field - with updated placeholder */}
              <FormField control={form.control} name="matchType" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
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
              
              {/* Match Format Field - with updated placeholder */}
              <FormField control={form.control} name="matchFormat" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
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

              {/* Result Field - only shown for competitive matches with updated placeholder */}
              {watchMatchType === "competitive" && <FormField control={form.control} name="result" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Result</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10">
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
              
              {/* Players Field - with updated placeholder */}
              <FormField control={form.control} name="players" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Players</FormLabel>
                    <FormControl>
                      <Input className="h-10" placeholder="Names of players I played with" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              {/* Duration Field - with updated placeholder */}
              <FormField control={form.control} name="duration" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input 
                        className="h-10" 
                        placeholder="How long the match lasted" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Matches must be at least 60 minutes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>} />
              
              {/* Venue Field - with updated placeholder */}
              <FormField control={form.control} name="venue" render={({
              field
            }) => <FormItem className="flex flex-col space-y-1.5" style={{
              gridColumn: "1 / -1"
            }}>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input className="h-10" placeholder="Club name and location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>
            
            {/* Notes Field - with updated placeholder */}
            <FormField control={form.control} name="notes" render={({
            field
          }) => <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Record thoughts on improvements or areas to work on" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>
                    Record your thoughts, improvements or areas to work on
                  </FormDescription>
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
