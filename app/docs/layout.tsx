// app/docs/layout.tsx
'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { DocsSidebarItem } from "./DocsSidebarItem"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      {/* Container with top padding for header */}
      <div className="pt-16">
        {/* Sidebar - fixed position with correct height calculation */}
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r border-white/10 bg-black/50 backdrop-blur-xl overflow-hidden">
          <ScrollArea className="h-full py-6">
            <nav className="px-4 space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Getting Started
                </h3>
                <ul className="space-y-1">
                  <DocsSidebarItem href="/docs" exact>
                    Overview
                  </DocsSidebarItem>
                  <DocsSidebarItem href="/docs/authentication">
                    Authentication
                  </DocsSidebarItem>
                  <DocsSidebarItem href="/docs/rate-limits">
                    Rate Limits
                  </DocsSidebarItem>
                </ul>
              </div>

              {/* API Endpoints */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  API Reference
                </h3>
                <ul className="space-y-1">
                  <DocsSidebarItem href="/docs/endpoints/message-analysis">
                    Message Analysis
                  </DocsSidebarItem>
                  <DocsSidebarItem href="/docs/endpoints/users">
                    Users
                  </DocsSidebarItem>
                  <DocsSidebarItem href="/docs/endpoints/family">
                    Family Circle
                  </DocsSidebarItem>
                  <DocsSidebarItem href="/docs/endpoints/verification">
                    Verification
                  </DocsSidebarItem>
                </ul>
              </div>
            </nav>
          </ScrollArea>
        </aside>

        {/* Main content - with proper margin and padding */}
        <main className="ml-64 px-8 py-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
