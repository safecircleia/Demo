import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import BackgroundGradient from "@/components/BackgroundGradient";
import { GeistSans } from "./fonts";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer/index";
import { AuthProvider } from "@/components/providers/auth-provider";
import VercelAnalytics from '@/components/VercelAnalytics';
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata: Metadata = {
  title: "SafeCircle",
  description: "A technical demo for educational purposes",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <head>
        <VercelAnalytics />
        <SpeedInsights />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <BackgroundGradient />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
