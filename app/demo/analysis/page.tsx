"use client"

import { motion } from "framer-motion"
import MessageAnalyzer from "@/components/MessageAnalyzer"

export default function AnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">Message Analysis</h1>
          <p className="text-lg text-gray-400">
            Test our AI-powered message analysis system in real-time.
          </p>
        </div>

        <MessageAnalyzer />
      </motion.div>
    </div>
  )
}
