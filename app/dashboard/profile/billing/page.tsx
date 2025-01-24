import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/button"
import { Check, Zap, Shield, Users, Star, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Manage your subscription and billing settings."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "relative p-6 flex flex-col min-h-[400px] transition-all duration-200 hover:scale-[1.02]",
            plan.popular && "border-primary shadow-lg shadow-primary/20"
          )}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <span className="absolute inset-0 animate-ping bg-primary/75 rounded-full" />
                  <span className="bg-primary px-4 py-1 text-xs font-medium rounded-full text-black backdrop-blur-sm border border-primary/50">
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

            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
              {plan.name === "Free" ? "Current Plan" : `Upgrade to ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5">
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
            className="mt-6" 
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