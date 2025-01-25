"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { StarIcon, RocketIcon, BeakerIcon, Loader2, CheckCircle, SparklesIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import confetti from 'canvas-confetti'
import { cn } from "@/lib/utils"

const betaFeatures = [
  {
    id: "ai-advanced",
    title: "Advanced AI Detection",
    description: "Early access to improved predator detection algorithms",
    icon: StarIcon,
    color: "border-yellow-500/20 bg-gradient-to-b from-yellow-500/10 to-transparent"
  },
  {
    id: "real-time",
    title: "Real-time Monitoring",
    description: "Test upcoming real-time threat detection features",
    icon: RocketIcon,
    color: "border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-transparent"
  },
  {
    id: "custom-rules",
    title: "Custom Safety Rules",
    description: "Create and test custom safety rules for your family",
    icon: BeakerIcon,
    color: "border-green-500/20 bg-gradient-to-b from-green-500/10 to-transparent"
  }
]

export default function BetaAccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedUp, setIsSignedUp] = useState(false)

  useEffect(() => {
    const checkBetaStatus = async () => {
      try {
        const response = await fetch('/api/beta')
        const data = await response.json()
        setIsSignedUp(data.isBetaUser)
      } catch (error) {
        console.error('Failed to check beta status:', error)
      }
    }

    if (session?.user) {
      checkBetaStatus()
    }
  }, [session])

  const handleBetaSignup = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to join beta program')

      await new Promise(resolve => setTimeout(resolve, 800))
      setIsSignedUp(true)
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#6366F1']
      })

      toast.success('Welcome to the Beta Program!', {
        description: "You now have access to exclusive features."
      })

    } catch (error) {
      toast.error('Failed to join beta program')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveBeta = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/beta', {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to leave beta program')

      await new Promise(resolve => setTimeout(resolve, 800))
      setIsSignedUp(false)
      
      toast.success('Left Beta Program', {
        description: "You've been removed from the beta program."
      })

    } catch (error) {
      toast.error('Failed to leave beta program')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <div className="space-y-8">
        {!isSignedUp ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative space-y-4"
            >
              <Card className="p-6 border-primary/20 bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Beta Access</h1>
                    <p className="text-sm text-muted-foreground">
                      Get early access to upcoming features and help shape the future of online safety
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                {betaFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "p-6 h-full transition-colors duration-300",
                      "border border-white/10 bg-black/20 backdrop-blur-sm",
                      feature.color
                    )}>
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-white/5">
                            <feature.icon className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-medium">{feature.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="p-6 border-primary/20 bg-black/20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-sm text-muted-foreground max-w-md">
                    Join our beta program to get early access to these features 
                    and help us improve the safety of families online.
                  </p>
                  <Button
                    onClick={handleBetaSignup}
                    disabled={isLoading}
                    className="min-w-[200px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Joining Beta...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="h-4 w-4" />
                        <span>Join Beta Program</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className={cn(
              "p-8 border-primary/20 backdrop-blur-sm",
              "bg-gradient-to-br from-emerald-500/5 via-black/20 to-emerald-500/5"
            )}>
              <div className="text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Welcome to the Beta Program!</h2>
                <p className="text-sm text-muted-foreground">
                  Thank you for joining us in shaping the future of online safety. 
                  You'll receive updates about new features soon.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="min-w-[200px]"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLeaveBeta}
                    disabled={isLoading}
                    className="min-w-[200px] text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Leaving Beta...</span>
                      </div>
                    ) : (
                      "Leave Beta Program"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}