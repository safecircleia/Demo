import Link from "next/link";
import { ArrowRight, Shield, MessageCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center space-y-8 py-20">
            <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              SafeCircle
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Protecting online conversations with advanced AI technology to
              detect and prevent harmful interactions.
            </p>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button size="lg" className="gap-2">
                  Try Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="https://github.com/yourusername/safecircle">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 py-20">
            <FeatureCard
              icon={Shield}
              title="Real-time Protection"
              description="Continuous monitoring of conversations to identify potential threats and harmful content."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Safe Communication"
              description="Create a secure environment for online interactions with advanced threat detection."
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Analysis"
              description="Utilizing cutting-edge AI models to analyze conversation patterns and detect risks."
            />
          </div>
        </main>
      </div>
    </>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground transition-all hover:scale-105">
      <Icon className="w-12 h-12 mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
