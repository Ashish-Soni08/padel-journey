import React, { useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const formSchema = z.object({
  date: z.date({
    required_error: "Match date is required"
  }),
  opponents: z.string().min(2, {
    message: "Please enter your opponents' names"
  }),
  partner: z.string().min(2, {
    message: "Please enter your partner's name"
  }),
  result: z.enum(["win", "loss"]),
  score: z.string().min(1, {
    message: "Please enter the match score"
  }),
  duration: z.string().min(1, {
    message: "Please enter the match duration"
  }),
  notes: z.string().optional()
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
      opponents: "",
      partner: "",
      result: "win",
      score: "",
      duration: "",
      notes: ""
    }
  });
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 800));
      console.log("Match data:", data);

      // Show success toast
      toast({
        title: "Match recorded!",
        description: `Your ${data.result} against ${data.opponents} has been saved.`
      });

      // Call the callback if provided
      if (onMatchAdded) {
        onMatchAdded(data);
      }

      // Reset form
      form.reset({
        date: new Date(),
        opponents: "",
        partner: "",
        result: "win",
        score: "",
        duration: "",
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
              <FormField control={form.control} name="date" render={({
              field
            }) => <FormItem className="flex flex-col">
                    <FormLabel>Match Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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

              <FormField control={form.control} name="result" render={({
              field
            }) => <FormItem>
                    <FormLabel>Result</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="partner" render={({
              field
            }) => <FormItem>
                    <FormLabel>Your Partner</FormLabel>
                    <FormControl>
                      <Input placeholder="Partner's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="opponents" render={({
              field
            }) => <FormItem>
                    <FormLabel>Opponents</FormLabel>
                    <FormControl>
                      <Input placeholder="Opponents' names" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="score" render={({
              field
            }) => <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 6-4, 3-6, 6-2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={form.control} name="duration" render={({
              field
            }) => <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1h 30m" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>
            
            <FormField control={form.control} name="notes" render={({
            field
          }) => <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Any observations or highlights..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Record your thoughts or highlights from the match
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