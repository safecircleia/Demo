import { motion } from "framer-motion";

export function ProgressBar() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{
          duration: 10,
          ease: "linear",
        }}
        className="h-full bg-yellow-500/20"
      />
    </div>
  );
}
