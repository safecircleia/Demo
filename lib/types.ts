// lib/types.ts
export interface RoadmapItem {
  title: string;
  state: "completed" | "in-progress" | "planned";
  description: string;
  issue_number?: number;
  labels?: string[];
}