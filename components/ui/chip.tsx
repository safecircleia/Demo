import { motion } from "framer-motion";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer transition-colors"
    >
      <span className="text-sm font-medium text-white/80">{children}</span>
    </motion.div>
  );
}