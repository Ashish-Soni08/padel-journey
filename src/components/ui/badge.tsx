
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      color: {
        orange: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        blue: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        green: "border-transparent bg-green-500 text-white hover:bg-green-600",
        red: "border-transparent bg-red-500 text-white hover:bg-red-600",
        purple: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        gray: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
        indigo: "border-transparent bg-indigo-500 text-white hover:bg-indigo-600",
      },
      size: {
        "1": "text-xs",
        "2": "text-sm",
        "3": "text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "1",
    },
  }
)

// Fixed type issue by removing the HTML color attribute from HTMLAttributes
export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, color, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, color, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
