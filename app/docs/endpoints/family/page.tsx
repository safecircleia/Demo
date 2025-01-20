'use client'

import { motion } from "framer-motion"

export default function FamilyApiPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl font-bold mb-6">Family Circle API</h1>
      <p className="text-gray-400 mb-8">
        Manage family circles, members, and permissions through these endpoints.
      </p>

      <div className="space-y-8">
        {/* Create Family Circle */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Create Family Circle</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/family</h3>
              <p className="mt-2 text-gray-400">Creates a new family circle</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "name": string,
  "ownerEmail": string,
  "settings": {
    "notificationPreferences": {
      "email": boolean,
      "push": boolean
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Add Family Member */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Add Family Member</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">POST /api/family/members</h3>
              <p className="mt-2 text-gray-400">Adds a new member to the family circle</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "familyId": string,
  "email": string,
  "role": "parent" | "child",
  "permissions": string[],
  "deviceLimit": number
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Update Member Permissions */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Update Member Permissions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">PATCH /api/family/members/:memberId</h3>
              <p className="mt-2 text-gray-400">Updates permissions for a family member</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-blue-400">
{`{
  "permissions": {
    "canInviteMembers": boolean,
    "canRemoveMembers": boolean,
    "canModifySettings": boolean,
    "monitoringEnabled": boolean
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Remove Member */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Remove Family Member</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl text-blue-400 font-medium">DELETE /api/family/members/:memberId</h3>
              <p className="mt-2 text-gray-400">Removes a member from the family circle</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Response</h4>
              <div className="bg-black/30 p-4 rounded-md">
                <pre className="text-sm text-emerald-400">
{`{
  "success": true,
  "message": "Member removed successfully"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Error Responses</h2>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h4 className="font-medium text-red-400">403 Forbidden</h4>
              <pre className="mt-2 text-sm text-gray-400">
{`{
  "error": "Insufficient permissions",
  "message": "Only family admins can perform this action"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}