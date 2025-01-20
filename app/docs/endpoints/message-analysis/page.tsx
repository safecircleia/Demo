// app/docs/endpoints/message-analysis/page.tsx
'use client'

import { motion } from "framer-motion"

export default function MessageAnalysisPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl font-bold mb-6">Message Analysis API</h1>
      
      <div className="space-y-8">
        {/* POST /api/predict */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Analyze Message</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/predict</h3>
              <p className="mt-2 text-gray-400">Analyzes text content for potential threats</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "message": string,  // Text content to analyze
  "userId": string,   // Optional: User ID for analytics
  "context"?: {       // Optional: Additional context
    "source": string,
    "type": string
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Response</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-emerald-400">
{`{
  "status": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "confidence": number,  // 0-100
  "reason": string,     // Explanation of the analysis
  "metadata": {
    "processingTime": number,
    "modelVersion": string
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Error Responses */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Error Responses</h2>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h4 className="font-medium text-red-400">400 Bad Request</h4>
              <pre className="mt-2 text-sm text-gray-400">
{`{
  "error": "Invalid request body",
  "message": "Message field is required"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}