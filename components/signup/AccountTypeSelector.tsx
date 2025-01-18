import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";

export function AccountTypeSelector({ 
  onSelect 
}: { 
  onSelect: (type: "parent" | "child") => void 
}) {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("parent")}
          className="p-6 rounded-lg border border-white/10 bg-black/30 hover:bg-white/5 transition-colors text-left"
        >
          <Shield className="h-8 w-8 mb-4 text-blue-500" />
          <h3 className="text-lg font-semibold mb-2">Parent Account</h3>
          <p className="text-sm text-gray-400">
            Create a family and manage child accounts
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("child")}
          className="p-6 rounded-lg border border-white/10 bg-black/30 hover:bg-white/5 transition-colors text-left"
        >
          <Users className="h-8 w-8 mb-4 text-green-500" />
          <h3 className="text-lg font-semibold mb-2">Child Account</h3>
          <p className="text-sm text-gray-400">
            Join your family's protection circle
          </p>
        </motion.button>
      </motion.div>
    </div>
  );
}