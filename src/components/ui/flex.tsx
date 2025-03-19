
import * as React from "react";
import { cn } from "@/lib/utils";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, inline, direction, align, justify, wrap, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          direction === "row" && "flex-row",
          direction === "column" && "flex-col",
          direction === "row-reverse" && "flex-row-reverse",
          direction === "column-reverse" && "flex-col-reverse",
          align === "start" && "items-start",
          align === "center" && "items-center",
          align === "end" && "items-end",
          align === "stretch" && "items-stretch",
          align === "baseline" && "items-baseline",
          justify === "start" && "justify-start",
          justify === "center" && "justify-center",
          justify === "end" && "justify-end",
          justify === "between" && "justify-between",
          justify === "around" && "justify-around",
          justify === "evenly" && "justify-evenly",
          wrap === "nowrap" && "flex-nowrap",
          wrap === "wrap" && "flex-wrap",
          wrap === "wrap-reverse" && "flex-wrap-reverse",
          gap === "0" && "gap-0",
          gap === "1" && "gap-1",
          gap === "2" && "gap-2",
          gap === "3" && "gap-3",
          gap === "4" && "gap-4",
          gap === "5" && "gap-5",
          gap === "6" && "gap-6",
          gap === "7" && "gap-7",
          gap === "8" && "gap-8",
          gap === "9" && "gap-9",
          gap === "10" && "gap-10",
          className
        )}
        {...props}
      />
    );
  }
);

Flex.displayName = "Flex";

export { Flex };
