"use client";

import { motion } from "framer-motion";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import { WarningDialog } from "@/components/WarningDialog";

export default function DemoPage() {
  return (
    <>
      <WarningDialog />
      <div className="relative pt-32 md:pt-48">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h1
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
              >
                Try SafeCircle Demo
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-lg text-gray-400 max-w-2xl mx-auto"
              >
                Experience our AI-powered protection system in action. Test how our system 
                detects potential threats in real-time.
              </motion.p>
            </div>
            <MessageAnalyzer />
          </motion.div>
        </div>
      </div>
    </>
  );
}