
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { enableRealtime } from "./services/realtimeSetup";

const queryClient = new QueryClient();

const App = () => {
  // Enable realtime updates when the app loads
  useEffect(() => {
    enableRealtime().then(success => {
      if (success) {
        console.log('Realtime functionality enabled successfully');
      } else {
        console.warn('Failed to enable realtime functionality');
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/stats" element={<Stats />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
