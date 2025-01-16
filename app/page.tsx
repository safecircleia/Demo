"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Zap } from "lucide-react";
import { Shield, Brain, MessageCircle, Lock, AlertTriangle, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SafeCircleLogo } from "@/components/Logo";
import { TypeAnimation } from 'react-type-animation';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="container px-4 text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <Link href="/changelog">
                <span className="inline-block px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full text-slate-200 font-mono hover:from-blue-500/30 hover:to-violet-500/30 transition-colors cursor-pointer border border-blue-500/30">
                  Technical Demo v0.1.0
                </span>
              </Link>
            </div>
            
            <SafeCircleLogo className="w-24 h-24 mx-auto" />
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
              SafeCircle
            </h1>

            <div className="h-16">
              <TypeAnimation
                sequence={[
                  'Protecting Online Conversations',
                  2000,
                  'Detecting Potential Threats',
                  2000,
                  'Ensuring Digital Safety',
                  2000
                ]}
                wrapper="h2"
                cursor={true}
                repeat={Infinity}
                className="text-xl md:text-2xl text-slate-200"
              />
            </div>

            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              Advanced AI-powered system that analyzes conversations in real-time to detect and prevent potential threats.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Link href="/demo">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90">
                  Try Demo
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-8 w-full text-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-8 h-8 mx-auto text-slate-400" />
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-slate-900/50">
          <motion.div 
            className="container px-4"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="relative"
                >
                  <div className="bg-slate-800/50 rounded-lg p-6 h-full">
                    <div className="text-3xl font-bold text-blue-500 mb-4">0{index + 1}</div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <motion.div 
            className="container px-4"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              variants={fadeIn}
            >
              Key Features
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-900/50">
          <div className="container px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div variants={fadeIn}>
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 space-y-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const features = [
  {
    icon: Shield,
    title: "Real-time Protection",
    description: "Continuous monitoring of conversations to identify potential threats."
  },
  {
    icon: Brain,
    title: "Advanced AI Analysis",
    description: "State-of-the-art machine learning models for accurate threat detection."
  },
  {
    icon: MessageCircle,
    title: "Message Screening",
    description: "Intelligent filtering of potentially harmful content in real-time."
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "End-to-end encryption and secure data handling. With Zero-Log policy to protect your privacy."
  },
  {
    icon: AlertTriangle,
    title: "Threat Alerts",
    description: "Instant notifications for detected risks and suspicious behavior."
  },
  {
    icon: BarChart2,
    title: "Risk Analytics",
    description: "Detailed insights and statistics on conversation safety."
  }
];

const faqItems = [
  {
    question: "How does SafeCircle work?",
    answer: "SafeCircle uses advanced AI models to analyze messages in real-time..."
  },
  // Add more FAQ items...
];

const steps = [
  {
    title: "Message Input",
    description: "Enter any message or conversation snippet you want to analyze"
  },
  {
    title: "AI Analysis",
    description: "Our advanced AI models process and analyze the content in real-time"
  },
  {
    title: "Threat Detection",
    description: "Receive immediate feedback on potential risks and safety concerns"
  }
];

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}
