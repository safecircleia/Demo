import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AnimatedBackground from "@/components/AnimatedBackground";
import { GeistSans } from "./fonts";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SafeCircle",
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
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
