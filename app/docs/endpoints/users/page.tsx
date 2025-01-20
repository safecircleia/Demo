// app/docs/endpoints/users/page.tsx
'use client'

import { motion } from "framer-motion"

export default function UsersApiPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl font-bold mb-6">Users API</h1>
      
      <div className="space-y-8">
        {/* Create User */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Create User</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/users</h3>
              <p className="mt-2 text-gray-400">Creates a new user account</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "email": string,
  "password": string,
  "name": string,
  "accountType": "parent" | "child"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* User Authentication */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">User Authentication</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/auth/login</h3>
              <p className="mt-2 text-gray-400">Authenticates a user and returns a session token</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}