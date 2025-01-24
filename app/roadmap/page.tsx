'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Clock, CheckCircle, CircleDot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoadmapItem {
  id: number;
  title: string;
  state: 'planned' | 'in-progress' | 'completed';
  description: string;
  labels: string[];
  html_url: string;
  created_at: string;
}

interface RoadmapResponse {
  items: RoadmapItem[];
  hasMore: boolean;
  nextPage: number;
}

const columns = {
  planned: {
    title: "📋 Planned",
    description: "Features and improvements we're planning",
    icon: Clock,
    items: [] as RoadmapItem[]
  },
  inProgress: {
    title: "🚧 In Progress",
    description: "Currently being worked on",
    icon: CircleDot,
    items: [] as RoadmapItem[]
  },
  completed: {
    title: "✨ Completed",
    description: "Recently shipped features",
    icon: CheckCircle,
    items: [] as RoadmapItem[]
  }
};

const labelColors = {
  enhancement: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  bug: "bg-red-500/10 text-red-500 border-red-500/20",
  documentation: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  feature: "bg-green-500/10 text-green-500 border-green-500/20"
};

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchRoadmap = async (pageNum: number) => {
    try {
      const res = await fetch(`/api/roadmap?page=${pageNum}`);
      const data: RoadmapResponse = await res.json();
      if (pageNum === 1) {
        setItems(data.items);
      } else {
        setItems(prev => [...prev, ...data.items]);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchRoadmap(1).finally(() => setIsLoading(false));
  }, []);

  const handleIssueClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchRoadmap(page + 1);
    setPage(prev => prev + 1);
    setLoadingMore(false);
  };

  const columnItems = {
    planned: items.filter((i) => i.state === 'planned'),
    inProgress: items.filter((i) => i.state === 'in-progress'),
    completed: items.filter((i) => i.state === 'completed'),
  };

  return (
    <div className="container py-8 mt-16"> {/* Added mt-16 for navbar height */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Roadmap</h1>
        <p className="text-muted-foreground">Track the development progress of SafeCircle</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-[200px]" />
            </div>
          ))
        ) : (
          Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="space-y-4">
              <div className="flex items-center gap-2">
                <column.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{column.title}</h3>
                  <p className="text-sm text-muted-foreground">{column.description}</p>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4 min-h-[500px] space-y-3">
                {columnItems[columnId as keyof typeof columnItems].map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleIssueClick(item.html_url)}
                  >
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all border border-border/40 group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.labels.map(label => (
                          <span
                            key={label}
                            className={`text-xs px-2 py-1 rounded-full border ${labelColors[label as keyof typeof labelColors] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}