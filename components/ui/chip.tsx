import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-green-500/10 text-green-500 border border-green-500/20",
        info: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
        purple: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
      },
      size: {
        sm: "text-xs px-1.5 py-0.5",
        default: "px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "success",
      size: "default",
    },
  }
)

interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ className, variant, size, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant, size }), className)} {...props} />
  )
}