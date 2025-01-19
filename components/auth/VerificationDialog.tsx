import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
}

export function VerificationDialog({ isOpen, onClose, onVerify }: VerificationDialogProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      await onVerify(code);
      onClose();
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-none">
        <DialogHeader>
          <DialogTitle className="gradient-text">Email Verification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-400">
            Please enter the 6-digit verification code sent to your email.
          </p>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="glass-input text-center text-2xl tracking-widest"
          />
          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.length !== 6}
            className="w-full glass-button"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}