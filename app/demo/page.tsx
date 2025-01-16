import ChatInterface from "@/components/ChatInterface";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function DemoPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Try SafeCircle Demo</h2>
              <p className="text-muted-foreground">
                Experience our AI-powered protection system in action. Send a
                message to test how our system detects potential threats.
              </p>
            </div>
            <ChatInterface />
          </div>
        </main>
      </div>
    </>
  );
}
