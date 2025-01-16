"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertTriangle, ShieldCheck, Shield, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser?: boolean;
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

export default function MessageAnalyzer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length === 0) return;
    // Only scroll on new messages, not on input focus
    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  const clearMessages = () => setMessages([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission from scrolling
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [newMessage, ...prev].slice(0, 10));
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const prediction = await response.json();
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, prediction } : msg
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto p-4"
    >
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This is a prototype demonstration. Results are for testing purposes only and should not be considered definitive.
        </AlertDescription>
      </Alert>

      <Card className="bg-slate-950 border-slate-800">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Message Safety Analysis</h2>
          <p className="text-muted-foreground text-center">
            Enter a message to analyze for potential threats
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              Clear Log
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message to analyze..."
              className="w-full"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Analyzing..." : "Analyze Message"}
            </Button>
          </form>

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-lg p-4 space-y-2 ${
                  message.prediction?.classification === "safe"
                    ? "bg-emerald-950/50 border border-emerald-900"
                    : message.prediction?.classification === "malicious"
                    ? "bg-red-950/50 border border-red-900"
                    : message.prediction?.classification === "suspicious"
                    ? "bg-yellow-950/50 border border-yellow-900"
                    : "bg-slate-900 border border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant={
                    message.prediction?.classification === "safe" ? "success" : 
                    message.prediction?.classification === "malicious" ? "destructive" :
                    message.prediction?.classification === "suspicious" ? "warning" : 
                    "secondary"
                  }>
                    {message.prediction?.classification 
                      ? message.prediction.classification.charAt(0).toUpperCase() + message.prediction.classification.slice(1)
                      : "Analyzing..."}
                  </Badge>
                  {message.prediction?.probability && (
                    <span className="text-sm text-muted-foreground">
                      Confidence: {(message.prediction.probability * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm">{message.content}</p>
                {message.prediction?.details && (
                  <div className="text-sm text-muted-foreground border-t border-slate-800 pt-2 mt-2">
                    <p>{message.prediction.details.explanation}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
