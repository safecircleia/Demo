"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Brain, Lock, Users, MessageSquare, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { features } from "@/lib/data";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ProcessAnimation } from "@/components/ProcessAnimation";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="mb-8">
              <Link 
                href="https://dexscreener.com/solana/4upkjadbyrmvp2nn7dwrsawndkpriruprs1gm38hhzg8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Chip className="bg-green-500/20 hover:bg-green-500/30 transition-colors">
                  <span className="flex items-center gap-2">
                    💎 Invest in this project <ExternalLink className="w-3 h-3" />
                  </span>
                </Chip>
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
              <Link href="/about" className="w-[160px]">
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

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })}
        >
          <ChevronDown className="h-8 w-8 text-white/50" />
        </motion.div>
      </section>

      {/* Wrapper for all sections with shared blur */}
      <div className="bg-slate-900/30 backdrop-blur-lg border-t border-white/10">
        {/* Process Section */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Our advanced AI-powered system protects users in real-time through a sophisticated multi-step process
              </p>
            </motion.div>

            <ProcessAnimation />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "99.9%", label: "Detection Accuracy" },
                { value: "<50ms", label: "Response Time" },
                { value: "24/7", label: "Active Protection" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-xl bg-white/5 backdrop-blur"
                >
                  <h3 className="text-4xl font-bold text-blue-500 mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Advanced Features</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Comprehensive protection powered by cutting-edge technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Protect Your Users?</h2>
              <p className="text-xl text-gray-400 mb-8">
                Join us in creating a safer digital environment for everyone
              </p>
              <Link href="/auth/onboarding">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer>
        {/* ...existing footer code... */}
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