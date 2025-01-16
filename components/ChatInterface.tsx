"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { EmojiPicker } from "@/components/chat/EmojiPicker";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  prediction?: {
    prediction: string;
    probability: number;
    classification: string;
    details: {
      explanation: string;
      risk_level: number;
      classification: string;
    };
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
      return "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30";
    } else if (probability > 0.5) {
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
    } else {
      return "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30";
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  className="bg-primary/20 p-4 rounded-lg max-w-[80%] border border-primary/30"
                  whileHover={{ scale: 1.02 }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <p className="text-foreground/90">{message.content}</p>
                </motion.div>
              </div>

              {/* AI Response */}
              {message.prediction && (
                <div className="flex justify-start">
                  <motion.div
                    className={cn(
                      "p-4 rounded-lg max-w-[80%] border",
                      getResponseStyles(message.prediction.probability),
                    )}
                    {...getMessageAnimation(message.prediction.probability)}
                  >
                    <p className="font-medium">{message.prediction.result}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-2",
                        message.prediction.probability > 0.8
                          ? "border-red-500 bg-red-500/20"
                          : message.prediction.probability > 0.5
                            ? "border-yellow-500 bg-yellow-500/20"
                            : "border-green-500 bg-green-500/20",
                      )}
                    >
                      Confidence:{" "}
                      {(message.prediction.probability * 100).toFixed(1)}%
                    </Badge>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t">
        <div className="relative flex items-center w-full space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </Button>

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

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
