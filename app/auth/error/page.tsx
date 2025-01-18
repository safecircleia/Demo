'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
          className="mb-8 flex justify-center"
        >
          <AlertCircle className="h-16 w-16 text-red-500" />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
          className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-300 to-red-500 animate-shimmer"
        >
          Authentication Error
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-gray-400 mb-8"
        >
          {error || 'An error occurred during authentication'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center"
        >
          <Link href="/sign-in">
            <Button
              className="flex items-center gap-2 bg-white text-black hover:bg-white/90 transition-colors px-8 py-6 text-lg"
            >
              Try Again
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function AuthError() {
  return (
    <div className="relative pt-32 md:pt-48">
      <div className="container px-4 mx-auto">
        <Suspense fallback={
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <AlertCircle className="h-16 w-16 text-gray-300 animate-pulse" />
            </div>
          </div>
        }>
          <AuthErrorContent />
        </Suspense>
      </div>
    </div>
  )
}