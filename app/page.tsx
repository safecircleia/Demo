import ChatInterface from "@/components/ChatInterface";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <ChatInterface />
        </main>
      </div>
    </>
  );
}
