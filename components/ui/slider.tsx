"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
    >
      <SliderPrimitive.Range 
        className="absolute h-full bg-gradient-to-r from-primary/50 to-primary" 
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className="block h-4 w-4 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm shadow-lg ring-0 transition-all hover:scale-110 hover:border-primary/50 focus:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50" 
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }