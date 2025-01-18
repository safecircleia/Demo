import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const RainbowButton = forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="wrap">
        <button
          ref={ref}
          className={cn(
            "rainbow-explode-button relative",
            className
          )}
          {...props}
        >
          <span></span>
          <span></span>
          <span></span>
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        </button>
      </div>
    );
  }
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton };