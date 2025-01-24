"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitCommit, Calendar, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Commit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    }
  }
  verification: {
    verified: boolean;
    reason: string;
  }
}

interface CommitResponse {
  commits: Commit[];
  hasMore: boolean;
  nextPage: number;
}

export default function Changelog() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchCommits = async (pageNum: number) => {
    try {
      const res = await fetch(`/api/changelog?page=${pageNum}`);
      const data: CommitResponse = await res.json();
      
      if (pageNum === 1) {
        setCommits(data.commits);
      } else {
        setCommits(prev => [...prev, ...data.commits]);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCommits(1).finally(() => setLoading(false));
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchCommits(page + 1);
    setPage(prev => prev + 1);
    setLoadingMore(false);
  };

  return (
    <div className="container py-8 mt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-3xl font-bold">Changelog</h1>
        <p className="text-muted-foreground">Track development progress and updates</p>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : (
          commits.map((commit, index) => (
            <motion.div
              key={commit.sha}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-4 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => window.open(commit.html_url, '_blank')}
              >
                <div className="flex items-start gap-4">
                  <GitCommit className="w-5 h-5 text-primary mt-1 group-hover:scale-110 transition-transform" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {commit.commit.message.split('\n')[0]}
                      </span>
                      {commit.verification && (
                        <span 
                          className={`text-xs px-2 py-1 rounded-full border
                            ${commit.verification.verified 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}
                        >
                          {commit.verification.verified ? 'Verified' : 'Unverified'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {commit.commit.author.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(commit.commit.author.date), 'MMM dd, yyyy')}
                      </div>
                      <code className="text-xs text-muted-foreground">
                        {commit.sha.substring(0, 7)}
                      </code>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}

        {hasMore && !loading && (
          <div className="flex justify-center pt-4">
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
    </div>
  );
}