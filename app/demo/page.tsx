import MessageAnalyzer from "@/components/MessageAnalyzer";

export default function DemoPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Try SafeCircle Demo</h2>
              <p className="text-muted-foreground">
                Experience our AI-powered protection system in action. Send a
                message to test how our system detects potential threats.
              </p>
            </div>
            <MessageAnalyzer />
          </div>
        </main>
      </div>
    </>
  );
}
