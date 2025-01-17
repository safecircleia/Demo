"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail, Shield, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <div className="relative pt-32 md:pt-48">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
            >
              About SafeCircle
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-gray-400 mb-8 leading-relaxed"
            >
              SafeCircle is an AI-powered platform dedicated to creating safer online spaces. 
              Our advanced technology helps detect and prevent harmful behavior in digital communities.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6 mb-12"
            >
              <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
                <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-400">
                  We're committed to making the internet a safer place for everyone. 
                  Through innovative AI technology, we help protect users from online predators 
                  and create more secure digital environments.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
                <h2 className="text-xl font-semibold mb-4">Technology</h2>
                <p className="text-gray-400">
                  Our platform uses state-of-the-art machine learning algorithms to analyze 
                  patterns and detect potential threats in real-time, ensuring the safety of 
                  online communities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex justify-center gap-4"
            >
              <Link href="https://github.com/tresillo2017/safecircle" target="_blank">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </motion.button>
              </Link>
              <Link href="mailto:contact@safecircle.ai">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}