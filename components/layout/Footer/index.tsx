'use client';

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { motion } from 'framer-motion';
import styles from './styles.module.scss';

const footerLinks = [
  {
    title: "Product",
    links: [
      { href: "/about", label: "About" },
      { href: "/demo", label: "Demo" },
      { href: "/changelog", label: "Changelog" }
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
      { href: "/terms", label: "Terms" },
      { href: "/cookies", label: "Cookies" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-slate-800 bg-slate-950/50 backdrop-blur-xl">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
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

          <div>
            <h3 className="mb-4 text-sm font-semibold text-slate-200">
              Stay Connected
            </h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/tresillo2017/safecircle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Github size={20} />
              </a>
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
        </div>
      </div>
    </footer>
  );
}