
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Since we're only using light theme, this is a decorative button now
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Light theme"
    >
      <Sun className="h-5 w-5 transition-all" />
    </Button>
  );
}
