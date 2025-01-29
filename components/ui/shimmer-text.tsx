import { cn } from '@/lib/utils'

interface ShimmerTextProps {
  children: React.ReactNode
  shimmerWidth?: number
  className?: string
}

export function ShimmerText({ children, shimmerWidth = 200, className }: ShimmerTextProps) {
  return (
    <p
      className={cn(
        'mx-auto max-w-md text-white',
        'bg-gradient-to-r from-green-900/20 via-green-800/20 to-green-900/20',
        'backdrop-blur-md',
        'shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.1)]',
        'border border-white/10 rounded-full px-4 py-1.5',
        'hover:bg-green-800/30 hover:border-white/20',
        'transition-all duration-300',
        'flex items-center gap-1.5 text-sm',
        className
      )}
    >
      {children}
    </p>
  )
}
