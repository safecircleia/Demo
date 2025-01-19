'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { AccountTypeSelector, ParentSignup, ChildSignup } from '@/components/auth'
import { RegisterError } from '@/app/api/auth/register/route'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<'parent' | 'child' | null>(null)
  const [errors, setErrors] = useState<RegisterError>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="container max-w-md mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-black/20 border-white/10">
            {errors.general && (
              <div className="p-4 mb-4 text-sm text-red-500 bg-red-100/10 rounded">
                {errors.general.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}

            {step === 1 && (
              <AccountTypeSelector
                onSelect={(type) => {
                  setAccountType(type)
                  setStep(2)
                  setErrors({})
                }}
              />
            )}

            {step === 2 && accountType === "parent" && (
              <ParentSignup
                onSubmit={async (data) => {
                  setIsLoading(true)
                  setErrors({})
                  
                  try {
                    const response = await fetch('/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...data, accountType }),
                    })

                    const result = await response.json()

                    if (!response.ok) {
                      setErrors(result.errors)
                      return
                    }

                    if (result.success) {
                      router.push('/auth/login?registered=true')
                    }
                  } catch (error) {
                    setErrors({
                      general: ['An unexpected error occurred. Please try again later.']
                    })
                  } finally {
                    setIsLoading(false)
                  }
                }}
                errors={errors}
                isLoading={isLoading}
              />
            )}

            {step === 2 && accountType === "child" && (
              <ChildSignup
                onSubmit={async (data) => {
                  setIsLoading(true)
                  setErrors({})
                  
                  try {
                    const response = await fetch('/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...data, accountType }),
                    })

                    const result = await response.json()

                    if (!response.ok) {
                      setErrors(result.errors)
                      return
                    }

                    if (result.success) {
                      router.push('/auth/login?registered=true')
                    }
                  } catch (error) {
                    setErrors({
                      general: ['An unexpected error occurred. Please try again later.']
                    })
                  } finally {
                    setIsLoading(false)
                  }
                }}
                errors={errors}
                isLoading={isLoading}
              />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}