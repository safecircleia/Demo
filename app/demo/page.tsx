"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, FileText, Sparkles, Shield } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

// Add PrivacyNotice component at the top of the file
function PrivacyNotice() {
  return (
    <Card className="p-4 bg-muted/50">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Privacy Notice</p>
          <p className="text-sm text-muted-foreground">
            This demo uses OpenAI's API to analyze messages. Your data is processed according to their privacy policy. 
            We do not store personal information from demo interactions. Review{" "}
            <Link href="https://openai.com/privacy" className="underline hover:text-primary" target="_blank">
              OpenAI's privacy policy
            </Link>
            {" "}for more details.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function DemoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Center the header section */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Demo Mode</span>
          </motion.div>
          
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer">
            Demo Dashboard
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            Experience SafeCircle's message protection system in action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/demo/analysis">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative space-y-4">
                {/* Left aligned icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Message Analysis
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </h3>
                  <p className="text-gray-400">
                    Test our real-time message scanning and threat detection system.
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/demo/logs">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative space-y-4">
                {/* Left aligned icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Threat Logs
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </h3>
                  <p className="text-gray-400">
                    View detailed logs of detected threats and analysis results.
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Add Privacy Notice at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PrivacyNotice />
        </motion.div>
      </motion.div>
    </div>
  )
}
