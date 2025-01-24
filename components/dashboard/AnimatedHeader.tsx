"use client";

import { motion } from "framer-motion";

interface AnimatedHeaderProps {
  title: string;
  description: string;
}

export function AnimatedHeader({ title, description }: AnimatedHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </motion.div>
  );
}