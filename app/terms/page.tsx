'use client'

import { motion } from "framer-motion"

export default function TermsOfService() {
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
              Terms of Service
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 mt-12"
          >
            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-400">
                By accessing and using SafeCircle, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
              <p className="text-gray-400">
                SafeCircle provides AI-powered message analysis to detect potential threats and harmful content. 
                We reserve the right to modify or discontinue the service at any time.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="text-gray-400">
                Users must be at least 13 years old to use SafeCircle. You are responsible for maintaining 
                the confidentiality of your account and for all activities under your account.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">4. Content Policy</h2>
              <p className="text-gray-400">
                Users agree not to upload, share, or transmit any content that is illegal, harmful, 
                threatening, abusive, harassing, defamatory, or otherwise objectionable.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
              <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-400">
                SafeCircle and its affiliates shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}