'use client'

import { motion } from "framer-motion"

export default function VerificationApiPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl font-bold mb-6">Verification API</h1>
      <p className="text-gray-400 mb-8">
        Endpoints for email and phone verification processes.
      </p>

      <div className="space-y-8">
        {/* Email Verification */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/verify/email</h3>
              <p className="mt-2 text-gray-400">Verify user's email address using the verification token</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "token": string,    // Verification token from email
  "userId": string    // User ID to verify
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Response</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-emerald-400">
{`{
  "verified": boolean,
  "message": string,
  "timestamp": string
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Resend Verification */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Resend Verification</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/verify/resend</h3>
              <p className="mt-2 text-gray-400">Resend verification email to user</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "email": string,
  "type": "email" | "phone"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Check Verification Status */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Check Verification Status</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">GET /api/verify/status/:userId</h3>
              <p className="mt-2 text-gray-400">Check the verification status of a user</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Response</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-emerald-400">
{`{
  "email": {
    "verified": boolean,
    "verifiedAt": string | null
  },
  "phone": {
    "verified": boolean,
    "verifiedAt": string | null
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
              <h4 className="font-medium text-red-400">400 Invalid Token</h4>
              <pre className="mt-2 text-sm text-gray-400">
{`{
  "error": "Invalid verification token",
  "message": "The verification token is invalid or has expired"
}`}
              </pre>
            </div>

            <div className="bg-black/30 p-4 rounded-md">
              <h4 className="font-medium text-red-400">429 Too Many Attempts</h4>
              <pre className="mt-2 text-sm text-gray-400">
{`{
  "error": "Too many verification attempts",
  "message": "Please wait 5 minutes before trying again",
  "retryAfter": 300
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}