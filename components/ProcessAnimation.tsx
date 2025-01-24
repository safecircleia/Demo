import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Shield, AlertTriangle } from "lucide-react"; // Changed Brain to Sparkles
import { useState, useEffect } from "react";

export function ProcessAnimation() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Message Detection",
      description: "Real-time monitoring",
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500"
    },
    {
      icon: Sparkles, // Changed from Brain to Sparkles
      title: "AI Analysis", 
      description: "NLP processing & threat detection",
      color: "purple",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500"
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "Content classification",
      color: "amber",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500"
    },
    {
      icon: Shield,
      title: "Protection",
      description: "Alert & safeguard activation",
      color: "green",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500"
    },
  ];

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  // Step animation with staggered durations
  const getStepVariants = (index: number) => ({
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1],
      },
    },
  });

  // Line animation with custom delay per segment
  const getLineVariants = (index: number) => ({
    hidden: { scaleX: 0, opacity: 0 },
    show: {
      scaleX: 1,
      opacity: [0, 0.8, 0.8],
      transition: { 
        duration: 0.8,
        delay: index * 0.8,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: 10, // Increased from 3 to 10 seconds
      }
    }
  });

  // Animation orchestration
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 13000); // Total animation cycle: 3s draw + 10s hold + 0.5s fade + 0.5s pause

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center w-full space-y-12">
      {/* Example message in a rectangle */}
      <div className="bg-slate-900/50 p-6 border border-slate-800 backdrop-blur rounded-xl text-center w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <p className="text-white font-semibold text-lg">"This message flows through each step"</p>
      </div>

      {/* Steps container */}
      <motion.div
        className="flex items-center justify-center gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center">
              {/* Step rectangle */}
              <motion.div
                variants={getStepVariants(index)}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="relative z-10 p-6 w-[180px] bg-slate-900/50 border border-slate-800 backdrop-blur rounded-xl text-center hover:bg-slate-800/50 transition-all duration-300 shadow-lg"
              >
                <motion.div 
                  className={`mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${step.bgColor}`}
                  animate={{ 
                    boxShadow: [
                      `0 0 0 rgba(${step.color}, 0.4)`,
                      `0 0 20px rgba(${step.color}, 0.2)`,
                      `0 0 0 rgba(${step.color}, 0.4)`
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className={`${step.textColor} h-7 w-7`} />
                </motion.div>
                <h3 className={`text-lg font-bold mb-2 ${step.textColor}`}>{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </motion.div>

              {/* Animated line between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  className="h-[2px] mx-4"
                  style={{ 
                    width: 80,
                    originX: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                  }}
                  variants={getLineVariants(index)}
                  initial="hidden"
                  animate={isAnimating ? "show" : "exit"}
                />
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}