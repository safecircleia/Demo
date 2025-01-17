interface AnalysisResult {
  status: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  confidence: number;
  reason: string;
  responseTime?: number;
  rawResponse?: string;
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, FileJson } from "lucide-react";

export function MessageAnalysis({ result }: { result: AnalysisResult }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'SAFE':
        return {
          text: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20'
        };
      case 'SUSPICIOUS':
        return {
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20'
        };
      case 'DANGEROUS':
        return {
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20'
        };
      default:
        return {
          text: 'text-gray-400',
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/20'
        };
    }
  };

  const styles = getStatusStyles(result.status);
  // Format confidence to be between 0-100 and round to 2 decimal places
  const formattedConfidence = Math.min(Math.round(result.confidence * 100) / 100, 100);

  return (
    <div className={`mt-6 p-6 rounded-lg ${styles.bg} border ${styles.border}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-2xl font-bold ${styles.text}`}>
            {result.status}
          </h3>
          <div className="flex items-center gap-4">
            {result.responseTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {result.responseTime}ms
                </span>
              </div>
            )}
            {result.rawResponse && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
                  >
                    <FileJson className="h-4 w-4" />
                    <span>Raw</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/10 max-w-2xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Raw Response</DialogTitle>
                  </DialogHeader>
                  <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-auto">
                    {JSON.stringify(JSON.parse(result.rawResponse), null, 2)}
                  </pre>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <p className="text-gray-300 text-lg">{result.reason}</p>
      </div>
    </div>
  );
}