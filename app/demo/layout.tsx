import { DemoSidebar } from '@/components/layout/DemoSidebar'

export default function DemoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col pt-4">
      <div className="flex min-h-[calc(60vh+24rem)]"> {/* Added additional height to ensure footer is below viewport */}
        <DemoSidebar />
        <main className="flex-1 pl-[256px]">
          <div className="container py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
