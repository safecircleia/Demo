'use client'

import { motion } from "framer-motion"

export default function DocsOverviewPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold mb-6">API Documentation</h1>
      <p className="text-gray-400 mb-8">
        Welcome to the SafeCircle API documentation. Here you'll find comprehensive
        guides and documentation to help you start working with the SafeCircle API.
      </p>
      {/* ... rest of overview content */}
    </motion.div>
  )
}