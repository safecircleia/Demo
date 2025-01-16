export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export interface AnalysisResult {
  prediction: string;
  probability: number;
}
