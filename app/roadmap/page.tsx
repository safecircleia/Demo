// app/roadmap/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, GitPullRequest, CheckCircle2, Circle, ExternalLink, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RoadmapItem {
  title: string;
  state: "completed" | "in-progress" | "planned";
  description: string;
  issue_number: number;
  labels: string[];
  html_url: string;
  assignees: {
    login: string;
    avatar_url: string;
  }[];
  created_at: string;
  updated_at: string;
  comments: number;
  milestone?: {
    title: string;
    due_on: string;
  };
}

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [showClosed, setShowClosed] = useState(false);
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [filterMilestone, setFilterMilestone] = useState<string>("all");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/tresillo2017/safecircle/issues?state=all');
        const data = await response.json();
        
        const items: RoadmapItem[] = data.map((issue: any) => ({
          title: issue.title,
          state: issue.state === "closed" ? "completed" : 
                 issue.labels.some((l: any) => l.name === "in-progress") ? "in-progress" : "planned",
          description: issue.body || "",
          issue_number: issue.number,
          labels: issue.labels.map((l: any) => l.name),
          html_url: issue.html_url,
          assignees: issue.assignees,
          created_at: new Date(issue.created_at).toLocaleDateString(),
          updated_at: new Date(issue.updated_at).toLocaleDateString(),
          comments: issue.comments,
          milestone: issue.milestone
        }));
        
        setRoadmapItems(items);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const filteredRoadmapItems = roadmapItems.filter(item => {
    if (!showClosed && item.state === "completed") return false;
    if (filterLabel !== "all" && !item.labels.includes(filterLabel)) return false;
    if (filterMilestone !== "all" && (!item.milestone || item.milestone.title !== filterMilestone)) return false;
    return true;
  });

  const uniqueLabels = Array.from(new Set(roadmapItems.flatMap(item => item.labels)));
  const uniqueMilestones = Array.from(new Set(roadmapItems
    .map(item => item.milestone?.title)
    .filter(Boolean) as string[]));

  const StatusIcon = ({ state }: { state: string }) => {
    switch (state) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <GitPullRequest className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative pt-32 md:pt-48">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
            >
              Development Roadmap
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Track our progress and upcoming features
            </motion.p>
          </div>

          <div className="mb-8 flex flex-wrap gap-6 items-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-closed"
                checked={showClosed}
                onCheckedChange={setShowClosed}
              />
              <Label htmlFor="show-closed">Show Closed Issues</Label>
            </div>

            <Select value={filterLabel} onValueChange={setFilterLabel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Labels</SelectItem>
                {uniqueLabels.map(label => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterMilestone} onValueChange={setFilterMilestone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Milestone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Milestones</SelectItem>
                {uniqueMilestones.map(milestone => (
                  <SelectItem key={milestone} value={milestone}>
                    {milestone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRoadmapItems.map((item, index) => (
                <motion.div
                  key={item.issue_number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-black/20 border-white/10 hover:border-white/20 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-4">
                        <StatusIcon state={item.state} />
                        <div className="flex flex-col">
                          <CardTitle className="text-xl">
                            {item.title}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => window.open(item.html_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {item.labels.map(label => (
                              <Badge
                                key={label}
                                variant="outline"
                                className="text-xs"
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.assignees.map((assignee) => (
                          <div key={assignee.login} className="flex items-center" title={assignee.login}>
                            <img
                              src={assignee.avatar_url}
                              alt={assignee.login}
                              className="w-8 h-8 rounded-full"
                            />
                          </div>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{item.description}</ReactMarkdown>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-gray-400">
                      <div className="flex gap-4">
                        <span>Created: {item.created_at}</span>
                        <span>Updated: {item.updated_at}</span>
                        <span>Comments: {item.comments}</span>
                      </div>
                      {item.milestone && (
                        <Badge variant="secondary">
                          Milestone: {item.milestone.title}
                          {item.milestone.due_on && ` (Due: ${new Date(item.milestone.due_on).toLocaleDateString()})`}
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}