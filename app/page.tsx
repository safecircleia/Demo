"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Brain, Lock, Users, MessageSquare, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { features } from "@/lib/data";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ProcessAnimation } from "@/components/ProcessAnimation";
import { ShimmerText } from "@/components/ui/shimmer-text";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section - removed margin */}
      <section className="h-[calc(100vh-4rem)] flex flex-col justify-center relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="mb-5">
              <Link 
                href="https://dexscreener.com/solana/4upkjadbyrmvp2nn7dwrsawndkpriruprs1gm38hhzg8"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full border border-white/5 bg-neutral-900/50 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-800/50 inline-block"
              >
                <ShimmerText
                  shimmerWidth={200}
                  className="inline-flex items-center justify-center px-4 py-1 transition ease-out"
                >
                  💎 Invest in this project
                  <ExternalLink className="w-3 h-3 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </ShimmerText>
              </Link>
            </div>
            
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
              className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer">
                Protecting Online
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white-300 to-white animate-shimmer">
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
              <Link href="/demo" className="w-[145px]">
                <RainbowButton className="w-full h-[52px] px-4 text-lg font-bold">
                  Try Demo <ArrowRight className="ml-2 h-5 w-5" />
                </RainbowButton>
              </Link>
              <Link href="https://safecircle.tech" className="w-[160px]">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-[52px] px-4 text-lg border-white/20 hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <footer>
      </footer>
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