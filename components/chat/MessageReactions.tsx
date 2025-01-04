import { motion } from "framer-motion";
import { Smile } from "lucide-react";
import { Button } from "../ui/button";

interface MessageReactionsProps {
  reactions: string[];
  onReaction: (emoji: string) => void;
}

const QUICK_REACTIONS = ["👍", "❤️", "😊", "😂", "😢", "😠"];

export function MessageReactions({
  reactions,
  onReaction,
}: MessageReactionsProps) {
  return (
    <div className="flex items-center gap-1">
      {reactions.map((emoji, index) => (
        <motion.button
          key={`${emoji}-${index}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="hover:bg-muted rounded-full p-1 text-sm transition-colors"
          onClick={() => onReaction(emoji)}
        >
          {emoji}
        </motion.button>
      ))}
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Smile className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-popover border rounded-lg shadow-lg p-1">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReaction(emoji)}
              className="hover:bg-muted rounded p-1 text-sm transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
