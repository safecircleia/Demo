"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-6 text-blue-500" />
          <h1 className="text-4xl font-bold mb-4">About SafeCircle</h1>
          
          <div className="prose prose-invert mx-auto">
            <p className="text-lg text-slate-300 mb-8">
              SafeCircle is an AI-powered system designed to protect online conversations 
              by detecting potential threats and harmful content in real-time.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-slate-300 mb-8">
              We aim to create safer digital spaces by leveraging advanced AI technology 
              to identify and prevent online threats, making the internet a more secure 
              place for everyone.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p className="text-slate-300 mb-8">
              Built using state-of-the-art machine learning models like llama3.2 and natural language 
              processing, SafeCircle analyzes conversations with high accuracy while 
              maintaining user privacy.
            </p>

            <div className="flex justify-center gap-4 mt-12">
              <Link href="https://github.com/tresillo2017/safecircle">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
              </Link>
              <Link href="mailto:contact@safecircle.ai">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                  <Mail className="w-5 h-5" />
                  Contact
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}