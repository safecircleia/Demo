"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitCommit } from "lucide-react";

interface Commit {
  sha: string;
  html_url: string; // Add URL field
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    }
  }
}

export default function Changelog() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/repos/tresillo2017/safecircle/commits', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        // Check if data is an array before setting it
        if (Array.isArray(data)) {
          setCommits(data);
        } else {
          console.error('Received non-array data:', data);
          setCommits([]); // Set empty array as fallback
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching commits:', err);
        setCommits([]); // Set empty array on error
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative pt-32 md:pt-48">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
              className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
            >
              Changelog
            </motion.h1>
            <p className="text-lg text-gray-400">Track our latest updates and improvements</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {commits.map((commit, index) => (
                <motion.div
                  key={commit.sha}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <a 
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <GitCommit className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <p className="text-white/90 font-medium whitespace-pre-line mb-2">
                          {commit.commit.message}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-white/50">
                          <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{commit.commit.author.name}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}