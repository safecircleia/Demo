'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { AccountTypeSelector } from '@/components/auth/AccountTypeSelector'
import ParentSignup from '@/components/auth/ParentSignup'
import type { RegisterError, RegisterFormData } from '@/components/auth/ParentSignup'
import { AccountType } from '@/types/auth'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [errors, setErrors] = useState<RegisterError>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setErrors({})
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, accountType })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setErrors(errorData.errors)
        return
      }

      // Handle successful registration
    } catch (error) {
      setErrors({ general: ['An unexpected error occurred'] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container max-w-md mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-black/20 border-white/10">
            {step === 1 && (
              <AccountTypeSelector
                onSelect={(type: AccountType) => {
                  setAccountType(type)
                  setStep(2)
                  setErrors({})
                }}
              />
            )}

            {step === 2 && accountType === "parent" && (
              <ParentSignup
                onSubmit={handleSubmit}
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