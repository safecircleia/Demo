import { useState, useRef } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EmojiPicker } from "./EmojiPicker";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (text: string, files?: File[]) => void;
  isAnalyzing: boolean;
}

export default function ChatInput({
  onSendMessage,
  isAnalyzing,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;

    onSendMessage(input, files);
    setInput("");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="pt-4 border-t">
      {/* File previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group rounded-md bg-muted p-2 flex items-center"
              >
                <span className="text-xs truncate max-w-[150px]">
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isAnalyzing}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Button type="submit" size="icon" disabled={isAnalyzing}>
          <Send className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </form>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
      </AnimatePresence>
    </div>
  );
}
