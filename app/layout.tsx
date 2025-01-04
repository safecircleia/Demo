import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AnimatedBackground from "@/components/AnimatedBackground";
import { GeistSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Predator Detector",
  description: "A technical demo for educational purposes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
