import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, Users, Star, Building2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out SafeCircle",
    price: "Free",
    features: [
      "Up to 3 family members",
      "Basic predator detection",
      "7-day message history",
      "Email support"
    ],
    icon: Users,
    popular: false
  },
  {
    name: "Pro",
    description: "Ideal for growing families",
    price: "$9.99",
    features: [
      "Up to 10 family members",
      "Advanced AI detection",
      "30-day message history",
      "Priority email support",
      "Custom safety rules",
      "Real-time alerts"
    ],
    icon: Shield,
    popular: true
  },
  {
    name: "Premium",
    description: "Enhanced protection & features",
    price: "$19.99",
    features: [
      "Unlimited family members",
      "Enterprise-grade AI",
      "90-day message history",
      "24/7 priority support",
      "Custom AI model training",
      "Advanced analytics",
      "API access"
    ],
    icon: Star,
    popular: false
  }
]

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")
  
  const email = session.user.email
  if (!email) redirect("/auth/login")

  // Fetch user's subscription status
  const user = await prisma.user.findUnique({
    where: { email },
    select: { 
      subscriptionPlan: true,
      subscriptionStatus: true 
    }
  })

  const currentPlan = user?.subscriptionPlan || 'free'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        description="Manage your subscription and billing settings."
      />

      <Card className="p-6 border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-transparent animate-gradient">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/20 animate-pulse">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h3>
            <p className="text-sm text-muted-foreground">
              {currentPlan === 'free' 
                ? "Upgrade now to protect more family members" 
                : "Thank you for being a valued subscriber"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={cn(
              "relative p-6 flex flex-col min-h-[400px] transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10",
              "data-[active=true]:border-primary data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20",
              "animate-fade-in motion-safe:animate-fadeIn"
            )}
            data-active={plan.name.toLowerCase() === currentPlan}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <span className="absolute inset-0 animate-ping bg-primary/75 rounded-full" />
                  <span className="bg-primary px-4 py-1 text-xs font-medium rounded-full text-black backdrop-blur-sm border border-primary/50 animate-pulse">
                    Most Popular
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex-1"> {/* Content wrapper */}
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5">
                  <plan.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "Free" && <span className="text-muted-foreground">/month</span>}
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              className={cn(
                "w-full transition-all duration-300",
                plan.name.toLowerCase() === currentPlan && "bg-primary/50 cursor-default",
                "group hover:shadow-lg hover:shadow-primary/20"
              )}
              variant={plan.popular ? "default" : "outline"}
              disabled={plan.name.toLowerCase() === currentPlan}
            >
              {plan.name.toLowerCase() === currentPlan ? (
                <span className="flex items-center gap-2">
                  Current Plan
                  <Check className="h-4 w-4 animate-bounce" />
                </span>
              ) : (
                <span className="group-hover:scale-105 transition-transform duration-200">
                  Upgrade to {plan.name}
                </span>
              )}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Enterprise</h3>
              <p className="text-sm text-muted-foreground">
                Custom solutions for organizations
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Need a custom solution? Contact us for enterprise pricing and features.
          </p>
          <Button 
            className="mt-6 group-hover:scale-105 transition-transform duration-200" 
            variant="outline"
            size="lg"
          >
            Contact Sales
          </Button>
        </Card>
      </div>
    </div>
  )
}