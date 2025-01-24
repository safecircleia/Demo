'use client';

import Link from "next/link";
import { Github, Twitter, Linkedin, GitBranch } from "lucide-react";
import { motion } from 'framer-motion';
import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const socialLinks = [
  { href: "https://github.com/tresillo2017", icon: Github },
  { href: "https://twitter.com/tresillo2017", icon: Twitter },
  { href: "https://linkedin.com/in/tresillo2017", icon: Linkedin }
];

export function Footer() {
  const [gitInfo, setGitInfo] = useState({ branch: '', commit: '', version: '' });

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
    <footer className="">
      <div className="bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12 space-y-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SafeCircle
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Protecting families online with advanced AI-powered monitoring and threat detection.
              </p>
            </div>

            {/* Footer Links Grid */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 text-sm font-semibold text-slate-200">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Version Info */}
              <Link 
                href={`https://github.com/tresillo2017/safecircle/tree/${gitInfo.branch}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
              >
                <GitBranch className="h-4 w-4" />
                <span>v{process.env.NEXT_PUBLIC_VERSION}</span>
                <span className="text-slate-500">•</span>
                <span>{gitInfo.branch}</span>
                <span className="text-slate-500">@</span>
                <span>{gitInfo.commit}</span>
              </Link>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  >
                    <link.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>

              {/* Copyright */}
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} SafeCircle. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}