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
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Changelog</h1>
          
          {loading ? (
            <div className="text-center">Loading commits...</div>
          ) : (
            <div className="space-y-4">
              {commits.map((commit) => (
                <motion.div
                  key={commit.sha}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-900 rounded-lg p-4 hover:bg-slate-800 transition-colors"
                >
                  <a 
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3"
                  >
                    <GitCommit className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="text-slate-200 whitespace-pre-line">
                        {commit.commit.message.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i !== commit.commit.message.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                      <div className="flex gap-2 mt-2 text-sm text-slate-400">
                        <span>{commit.commit.author.name}</span>
                        <span>•</span>
                        <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
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