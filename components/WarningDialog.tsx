"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function WarningDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="
        border-0
        bg-black/50 
        backdrop-blur-xl 
        shadow-lg 
        w-full 
        max-w-lg 
        rounded-lg
        p-8
      ">
        <div className="flex flex-col items-center justify-center space-y-6">
          <DialogHeader className="w-full flex flex-col items-center">
            <DialogTitle className="
              text-4xl
              font-bold
              bg-gradient-to-r
              from-red-500/80
              via-red-400/60
              to-red-500/80
              bg-clip-text
              text-transparent
              animate-shimmer
            ">
              Warning
            </DialogTitle>
            <DialogDescription className="space-y-4 mt-4 text-gray-300 text-center px-4">
              <p className="text-lg leading-relaxed">
                This demo uses AI to analyze messages for potential threats. 
                Results are for demonstration purposes only and should not be 
                relied upon for actual security decisions.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full flex justify-center mt-8">
            <Button 
              onClick={() => setOpen(false)}
              className="bg-white text-black hover:bg-gray-200 transition-colors px-12 py-3 text-lg font-semibold"
            >
              Acknowledge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}