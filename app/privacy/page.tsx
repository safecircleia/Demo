// app/privacy/page.tsx
'use client'

import { motion } from "framer-motion"

export default function PrivacyPolicy() {
  return (
    <div className="relative pt-32 md:pt-48">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
            >
              Privacy Policy
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 mt-12"
          >
            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">Data Collection</h2>
              <p className="text-gray-400">
                We collect minimal personal information required for the operation of SafeCircle. 
                This includes email addresses, profile information, and message content for analysis.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">Data Usage</h2>
              <p className="text-gray-400">
                Message content is analyzed in real-time to detect potential threats. 
                We do not store message content after analysis. User data is never sold to third parties.
              </p>
            </div>

            {/* Add more sections as needed */}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}