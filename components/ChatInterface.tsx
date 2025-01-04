"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { EmojiPicker } from "@/components/chat/EmojiPicker";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  prediction?: {
    result: string;
    probability: number;
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const prediction = await response.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, prediction } : msg,
        ),
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageAnimation = (probability?: number) => {
    if (probability === undefined) return {};

    if (probability > 0.8) {
      return {
        initial: { x: 0, y: 20, opacity: 0 },
        animate: { x: [-20, 20, -10, 10, -5, 5, 0], y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      };
    } else if (probability > 0.5) {
      return {
        initial: { x: 0, opacity: 0 },
        animate: { x: [10, -10, 5, -5, 0], opacity: 1 },
        transition: { duration: 0.4 },
      };
    } else {
      return {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.3 },
      };
    }
  };

  const getResponseStyles = (probability: number) => {
    if (probability > 0.8) {
      return "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
    } else if (probability > 0.5) {
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
    } else {
      return "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
    }
  };

  return (
    <div className="glass rounded-2xl shadow-2xl flex flex-col h-[600px] transition-all duration-300 ease-in-out">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* User message */}
              <div className="flex justify-end">
                <motion.div
                  className="glass p-4 rounded-2xl max-w-[80%] bg-blue-500/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <p className="text-white/90">{message.content}</p>
                </motion.div>
              </div>

              {/* AI Response */}
              {message.prediction && (
                <div className="flex justify-start">
                  <motion.div
                    className={cn(
                      "glass p-4 rounded-2xl max-w-[80%]",
                      getResponseStyles(message.prediction.probability),
                    )}
                    {...getMessageAnimation(message.prediction.probability)}
                  >
                    <p className="font-medium">{message.prediction.result}</p>
                    <div
                      className={cn(
                        "mt-2 p-1 px-2 rounded-full text-xs inline-block",
                        message.prediction.probability > 0.8
                          ? "bg-red-500/30"
                          : message.prediction.probability > 0.5
                            ? "bg-yellow-500/30"
                            : "bg-green-500/30",
                      )}
                    >
                      Confidence:{" "}
                      {(message.prediction.probability * 100).toFixed(1)}%
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="relative flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-slate-700/30 rounded-xl transition-colors"
          >
            <Smile className="w-6 h-6" />
          </motion.button>

          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 left-0 z-50">
              <EmojiPicker
                onEmojiSelect={(emoji: any) => {
                  setInput((prev) => prev + emoji.native);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50 transition-all duration-200"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 hover:bg-blue-500/20 rounded-xl transition-colors disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
