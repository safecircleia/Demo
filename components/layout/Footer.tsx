"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Github, Globe2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SafeCircleLogo } from "@/components/Logo";

const languages = {
  en: "English",
  es: "Español"
};

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const version = "v0.1.0";

  const handleLanguageChange = (locale: string) => {
    router.push(pathname.replace(/^\/[a-z]{2}/, `/${locale}`));
  };

  const links = [
    { href: "/about", label: "About" },
    { href: "/changelog", label: "Changelog" },
    { href: "/demo", label: "Demo" }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 }
            }}
            className="flex flex-col items-center md:items-start gap-1"
          >
            <p className="text-sm text-muted-foreground">
              © {currentYear} SafeCircle
            </p>
            <span className="text-xs text-muted-foreground/60">
              {version} - Technical Demo
            </span>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="flex items-center gap-4"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(languages).map(([code, name]) => (
                  <DropdownMenuItem 
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://github.com/tresillo2017/safecircle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <div className="flex items-center space-x-6">
            {links.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
              >
                <Link 
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
