"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const links = [
    { href: "/about", label: "About" },
    { href: "/changelog", label: "Changelog" }, 
    { href: "/demo", label: "Demo" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path
                    d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <motion.h1 
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                whileHover={{ y: -2 }}
              >
                SafeCircle
              </motion.h1>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-6">
            {links.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link 
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
