import { motion } from "framer-motion";
import { MessageReactions } from "./MessageReactions";
import Image from "next/image";

interface ChatBubbleProps {
  message: {
    text: string;
    sender: "user" | "ai";
    probability?: number;
    risk?: "low" | "medium" | "high" | "error";
    reactions?: string[];
    files?: File[];
  };
  onReaction: (emoji: string) => void;
}

export default function ChatBubble({ message, onReaction }: ChatBubbleProps) {
  const isUser = message.sender === "user";

  let bubbleClass = "bg-muted text-muted-foreground";
  if (!isUser) {
    switch (message.risk) {
      case "high":
        bubbleClass =
          "bg-destructive/20 border border-destructive/50 text-destructive";
        break;
      case "medium":
        bubbleClass =
          "bg-yellow-500/20 border border-yellow-500/50 text-yellow-600 dark:text-yellow-400";
        break;
      case "low":
        bubbleClass =
          "bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400";
        break;
      case "error":
        bubbleClass =
          "bg-destructive/10 border border-destructive/50 text-destructive";
        break;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[80%] space-y-2">
        <div className={`rounded-lg px-4 py-2 ${bubbleClass}`}>
          <p className="text-sm">{message.text}</p>

          {message.files?.map((file, index) => (
            <div key={index} className="mt-2">
              {file.type.startsWith("image/") && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Uploaded image"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              )}
            </div>
          ))}

          {message.probability !== undefined && (
            <p className="text-xs mt-1 opacity-75">
              Risk Level: {(message.probability * 100).toFixed(1)}%
            </p>
          )}
        </div>

        <MessageReactions
          reactions={message.reactions || []}
          onReaction={onReaction}
        />
      </div>
    </motion.div>
  );
}
