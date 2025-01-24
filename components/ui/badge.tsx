import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/20 text-primary shadow-sm hover:bg-primary/30",
        secondary:
          "border-white/10 bg-black/20 text-white hover:bg-white/10",
        destructive:
          "border-destructive/20 bg-destructive/20 text-destructive shadow-sm hover:bg-destructive/30",
        outline: 
          "border-white/10 bg-black/20 text-white hover:bg-white/10",
        success: 
          "border-green-500/20 bg-green-500/20 text-green-500 shadow-sm hover:bg-green-500/30",
        warning: 
          "border-yellow-500/20 bg-yellow-500/20 text-yellow-500 shadow-sm hover:bg-yellow-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "destructive" | "secondary" | "success" | "warning"
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
