'use client';

import Link from "next/link";
import { Github, Twitter, Linkedin, GitBranch } from "lucide-react";
import { motion } from 'framer-motion';
import styles from './styles.module.scss';
import { useState, useEffect } from 'react';

const footerLinks = [
  {
    title: "Product",
    links: [
      { href: "/about", label: "About" },
      { href: "/demo", label: "Demo" },
      { href: "/changelog", label: "Changelog" },
      { href: "/roadmap ", label: "Roadmap" }
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/blog", label: "Blog" },
      { href: "https://github.com/tresillo2017/safecircle", label: "GitHub" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" }
    ]
  }
];

export default function Footer() {
  const [gitInfo, setGitInfo] = useState<{
    branch: string;
    version: string;
    commit: string;
  }>({ 
    branch: '', 
    version: process.env.NEXT_PUBLIC_APP_VERSION || '',
    commit: ''
  });

  useEffect(() => {
    async function fetchVersionInfo() {
      try {
        const response = await fetch('/api/version');
        const data = await response.json();
        setGitInfo({
          branch: data.branch,
          version: process.env.NEXT_PUBLIC_APP_VERSION || data.version,
          commit: data.commit
        });
      } catch (error) {
        console.error('Failed to fetch version info:', error);
      }
    }
    fetchVersionInfo();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className="container mx-auto px-4 py-12">
        {/* Footer links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-slate-200">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Version info - Now above social icons */}
        <div className="flex justify-center mb-6">
          <Link 
            href={`https://github.com/tresillo2017/safecircle/tree/${gitInfo.branch}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <GitBranch className="h-4 w-4" />
            <span>v{gitInfo.version} ({gitInfo.branch} @ {gitInfo.commit})</span>
          </Link>
        </div>

        {/* Social icons */}
        <div className="flex justify-center space-x-6">
          <Link
            href="https://github.com/tresillo2017/safecircle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="h-6 w-6" />
          </Link>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}