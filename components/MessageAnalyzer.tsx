"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, Loader2, AlertTriangle, ShieldCheck, Shield, 
  Smile, Clock, FileJson, Copy, BrainCircuit, 
  Info as InfoIcon, ShieldAlert, ShieldQuestion, 
  BarChart3, AlertCircle, Bot 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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
    modelUsed?: string;
    settings?: {
      temperature: number;
      maxTokens: number;
    };
  };
  error?: string;
}

interface LimitInfo {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
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
  const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");
  const [limitInfo, setLimitInfo] = useState({
    messages: { used: 0, limit: 10, remaining: 10 },
    tokens: { used: 0, limit: 10, remaining: 10 },
    resetsAt: new Date().toISOString()
  });
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length === 0) return;
    // Only scroll on new messages, not on input focus
    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  useEffect(() => {
    const loadAISettings = async () => {
      try {
        const response = await fetch("/api/settings/ai");
        if (response.ok) {
          const data = await response.json();
          // Convert modelVersion to actual model name
          const modelName = data.modelVersion === 'gpt4o-mini' ? 'gpt-4o-mini' : 
                          data.modelVersion === 'deepseek' ? 'deepseek-chat' : 
                          'gpt-3.5-turbo';
          setCurrentModel(modelName);
        }
      } catch (error) {
        console.error("Failed to load AI settings:", error);
      }
    };
    loadAISettings();
  }, []);

  const fetchLimits = async () => {
    try {
      const response = await fetch('/api/limits');
      if (response.ok) {
        const data = await response.json();
        setLimitInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch limits:', error);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, [messages]);

  const fetchTokenInfo = async () => {
    try {
      const response = await fetch('/api/settings/ai');
      if (response.ok) {
        const data = await response.json();
        setTokenInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch token info:', error);
    }
  };

  useEffect(() => {
    fetchTokenInfo();
  }, [messages]);

  const clearMessages = () => setMessages([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeMessage(input);
  };

  const analyzeMessage = async (messageText: string) => {
    if (limitInfo.tokens.remaining <= 0) {
      const resetTime = new Date(limitInfo.resetsAt);
      toast.error(`Token limit reached. Resets at ${resetTime.toLocaleTimeString()}`);
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: messageText.trim(),
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
        body: JSON.stringify({ message: messageText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const prediction = await response.json();
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, prediction } : msg
        )
      );
      
      // Fetch updated limits after successful analysis
      fetchLimits();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, error: errorMessage } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (message: Message) => {
    const messageIndex = messages.findIndex(m => m.id === message.id);
    if (messageIndex === -1 || limitInfo.messages.remaining <= 0) return;
    
    // Remove error and prediction from message
    setMessages(prev => 
      prev.map(msg => 
        msg.id === message.id ? { ...msg, error: undefined, prediction: undefined } : msg
      )
    );
    
    await analyzeMessage(message.content);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (classification?: string) => {
    switch (classification) {
      case "SAFE":
        return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      case "DANGEROUS":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case "SUSPICIOUS":
        return <ShieldQuestion className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColors = (classification?: string) => {
    switch (classification) {
      case "SAFE":
        return "border-emerald-500/20 bg-emerald-500/5";
      case "DANGEROUS":
        return "border-red-500/20 bg-red-500/5";
      case "SUSPICIOUS":
        return "border-yellow-500/20 bg-yellow-500/5";
      default:
        return "border-white/10 bg-white/5";
    }
  };

  const handleRawView = (rawResponse: string | undefined) => {
    if (!rawResponse) return;
    
    try {
      // Try to parse if it's already a string
      const parsed = typeof rawResponse === 'string' ? 
        JSON.parse(rawResponse) : rawResponse;
      
      setSelectedJson(JSON.stringify(parsed, null, 2));
      setShowJsonDialog(true);
    } catch (error) {
      console.error('Failed to parse raw response:', error);
      // If parsing fails, display the raw string
      setSelectedJson(rawResponse);
      setShowJsonDialog(true);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'SAFE':
        return {
          badge: 'bg-green-500/10 text-green-500',
          gradient: 'bg-gradient-to-r from-green-950/50 via-transparent to-transparent'
        }
      case 'DANGEROUS':
        return {
          badge: 'bg-red-500/10 text-red-500',
          gradient: 'bg-gradient-to-r from-red-950/50 via-transparent to-transparent'
        }
      case 'SUSPICIOUS':
        return {
          badge: 'bg-yellow-500/10 text-yellow-500',
          gradient: 'bg-gradient-to-r from-yellow-950/50 via-transparent to-transparent'
        }
      default:
        return {
          badge: 'bg-gray-500/10 text-gray-500',
          gradient: 'bg-gradient-to-r from-gray-950/50 via-transparent to-transparent'
        }
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="container mx-auto"
      >
        <Card className="border border-white/10 bg-black/50 backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{currentModel}</span>
              </div>
              <div className="flex items-center gap-4">
                {limitInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-muted">
                          <AlertCircle className={cn(
                            "h-4 w-4",
                            limitInfo.tokens.remaining === 0 ? "text-destructive" :
                            limitInfo.tokens.remaining <= 3 ? "text-yellow-500" :
                            "text-muted-foreground"
                          )} />
                          <span className="text-sm font-medium">
                            {limitInfo.tokens.remaining}/{limitInfo.tokens.limit} messages remaining
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Resets at {new Date(limitInfo.resetsAt).toLocaleTimeString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
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
            </div>

            {limitInfo.tokens.remaining <= 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <ShieldAlert className="h-12 w-12 text-red-500" />
                <p className="text-lg font-medium text-center text-gray-200">
                  Thanks for testing out the beta but you have reached your daily message limit.
                  Reach out to us on Twitter at <a href="https://twitter.com/safecircleai" className="text-blue-500 hover:underline">@safecircleai</a> if you have any feedback about the project. Thanks.
                </p>
              </div>
            ) : (
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
                  disabled={isLoading || !input.trim() || limitInfo.tokens.remaining <= 0}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? "Analyzing..." : "Analyze Message"}
                </Button>
              </form>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => {
                const styles = getStatusStyles(message.prediction?.classification || 'default')
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="relative overflow-hidden border border-white/10 bg-black/30">
                      <div className={`absolute inset-0 ${styles.gradient} opacity-50`} />
                      <div className="relative p-4 z-10">
                        <div className="space-y-3">
                          <p className="text-gray-200">{message.content}</p>
                          
                          {message.error ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <span className="text-sm font-medium text-red-500">
                                  ERROR: {message.error}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRetry(message)}
                                disabled={limitInfo.messages.remaining <= 0}
                                className="border-red-500/20 hover:bg-red-500/10"
                              >
                                Retry
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <Badge className={styles.badge}>
                                {message.prediction?.classification || "Analyzing..."}
                              </Badge>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                {message.prediction?.probability && (
                                  <span className="flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4" />
                                    {Math.round(message.prediction.probability)}%
                                  </span>
                                )}
                                {message.prediction?.responseTime !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {`${Math.round(message.prediction.responseTime)}ms`}
                                  </span>
                                )}
                                {message.prediction?.modelUsed && (
                                  <span className="flex items-center gap-1">
                                    <BrainCircuit className="h-4 w-4" />
                                    {message.prediction.modelUsed}
                                  </span>
                                )}
                                {message.prediction?.rawResponse && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRawView(message.prediction?.rawResponse)}
                                    className="flex items-center gap-1 text-gray-400 hover:text-gray-300"
                                  >
                                    <FileJson className="h-4 w-4" />
                                    Raw
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                          {message.prediction?.details?.explanation && (
                            <p className="text-sm text-gray-400">
                              {message.prediction.details.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Raw Analysis Data
            </DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute right-2 top-2 z-10">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(selectedJson)}
                className="hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-8rem)]">
              <pre className="bg-black/20 p-4 rounded-lg text-sm font-mono">
                {selectedJson}
              </pre>
            </div>
          </div>        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}