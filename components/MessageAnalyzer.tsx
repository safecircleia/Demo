"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertTriangle, ShieldCheck, Shield, Smile, Clock, FileJson, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
    responseTime?: number;
    rawResponse?: string;
  };
}

const formatConfidence = (confidence: number) => {
  // Ensure the confidence is already in percentage (0-100)
  const normalizedConfidence = Math.min(Math.round(confidence), 100);
  return `${normalizedConfidence}%`;
};

export default function MessageAnalyzer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [selectedJson, setSelectedJson] = useState<string>("");
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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="container mx-auto"
      >
        <Card className="border border-white/10 bg-black/50 backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearMessages}
                disabled={messages.length === 0}
                className="border-white/10 hover:bg-white/5"
              >
                Clear Log
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message to analyze..."
                className="bg-black/50 border-white/10 focus:border-white/20 placeholder:text-white/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-white/90 transition-colors"
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
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-lg p-4 space-y-2 border backdrop-blur-sm ${
                    message.prediction?.classification === "SAFE"
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : message.prediction?.classification === "DANGEROUS"
                      ? "border-red-500/20 bg-red-500/5"
                      : message.prediction?.classification === "SUSPICIOUS"
                      ? "border-yellow-500/20 bg-yellow-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex flex-col space-y-3">
                    {/* Message content */}
                    <p className="text-gray-200">{message.content}</p>
                    
                    {/* Status and actions row */}
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        message.prediction?.classification === "SAFE" ? "secondary" : 
                        message.prediction?.classification === "DANGEROUS" ? "destructive" :
                        message.prediction?.classification === "SUSPICIOUS" ? "outline" : 
                        "default"
                      }
                      className={cn(
                        "font-medium",
                        message.prediction?.classification === "SAFE" ? "bg-green-500/10 text-green-500" :
                        message.prediction?.classification === "DANGEROUS" ? "bg-red-500/10 text-red-500" :
                        message.prediction?.classification === "SUSPICIOUS" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-gray-500/10 text-gray-500"
                      )}
                      >
                        {message.prediction?.classification 
                          ? message.prediction.classification.charAt(0).toUpperCase() + message.prediction.classification.slice(1)
                          : "Analyzing..."}
                      </Badge>
                      
                      <div className="flex items-center gap-3">
                        {/* Response Time */}
                        {message.prediction?.responseTime && (
                          <span className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock className="h-4 w-4" />
                            {message.prediction.responseTime}ms
                          </span>
                        )}
                        
                        {/* Raw Response Button */}
                        {message.prediction?.rawResponse && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (message.prediction?.rawResponse) {
                                try {
                                  const parsedJson = JSON.parse(message.prediction.rawResponse);
                                  setSelectedJson(JSON.stringify(parsedJson, null, 2));
                                  setShowJsonDialog(true);
                                } catch (error) {
                                  console.error('Failed to parse raw response:', error);
                                  // Handle the error appropriately
                                }
                              }
                            }}
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
                          >
                            <FileJson className="h-4 w-4" />
                            Raw
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Description/Reason */}
                    {message.prediction?.details?.explanation && (
                      <p className="text-sm text-gray-400 mt-2">
                        {message.prediction.details.explanation}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Raw Response</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-2"
              onClick={() => copyToClipboard(selectedJson)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <pre className="bg-black/20 p-4 rounded-lg overflow-auto max-h-[60vh] text-sm">
              {selectedJson}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}