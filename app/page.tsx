"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { features } from "@/lib/data";

export default function Home() {
  return (
    <div className="relative pt-16">
      <section className="relative py-32 md:py-48">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="mb-8">
              <Link href="/changelog">
                <Chip>
                  <span className="flex items-center gap-2">
                    ✨ See what's new <ArrowRight className="w-3 h-3" />
                  </span>
                </Chip>
              </Link>
            </div>
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: [0.165, 0.84, 0.44, 1],
              }}
              className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer">
                Protecting Online
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer">
                Conversations with AI
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Advanced threat detection and real-time protection for safer digital communication
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex gap-4 justify-center"
            >
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 transition-colors px-8 py-6 text-lg"
                >
                  Try Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-xl bg-slate-900/50 backdrop-blur border border-slate-800 hover:border-slate-700 transition-colors"
    >
      <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}