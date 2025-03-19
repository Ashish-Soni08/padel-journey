
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Dark mode"
      disabled
    >
      <Moon className="h-5 w-5 transition-all" />
    </Button>
  );
}
