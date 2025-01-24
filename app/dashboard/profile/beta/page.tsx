"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { StarIcon, RocketIcon, BeakerIcon, Loader2, CheckCircle, SparklesIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import confetti from 'canvas-confetti'

const betaFeatures = [
  {
    id: "ai-advanced",
    title: "Advanced AI Detection",
    description: "Early access to improved predator detection algorithms",
    icon: StarIcon,
    color: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: "real-time",
    title: "Real-time Monitoring",
    description: "Test upcoming real-time threat detection features",
    icon: RocketIcon,
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: "custom-rules",
    title: "Custom Safety Rules",
    description: "Create and test custom safety rules for your family",
    icon: BeakerIcon,
    color: "from-green-500/20 to-emerald-500/20"
  }
]

export default function BetaAccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const handleBetaSignup = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSignedUp(true)
    setIsLoading(false)
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#6366F1']
    })
  }

  return (
    <AnimatePresence mode="wait">
      <div className="space-y-8">
        {!isSignedUp ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl" />
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <SparklesIcon className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold">Beta Access</h1>
                </motion.div>
                <p className="text-muted-foreground">Get early access to upcoming features</p>
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {betaFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <Card className="p-6 h-full backdrop-blur-sm bg-white/5 border-white/10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-lg`} />
                    <div className="relative">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="h-8 w-8 mb-4 text-primary" />
                      </motion.div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleBetaSignup}
                disabled={isLoading}
                className="relative overflow-hidden px-8"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Joining Beta...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <SparklesIcon className="h-4 w-4" />
                      <span>Join Beta Program</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-4">Welcome to the Beta Program!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for joining us in shaping the future of online safety. 
                You'll receive updates about new features soon.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}