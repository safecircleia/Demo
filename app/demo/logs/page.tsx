"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, BrainCircuit, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils" // Add this import

interface MessageLog {
  id: string
  message: string
  status: string
  confidence: number
  reason: string
  responseTime?: number
  modelUsed?: string
  createdAt: string
}

interface PageData {
  logs: MessageLog[];
  totalPages: number;
}

function LogSkeleton() {
  return (
    <Card className="relative overflow-hidden border border-white/10 bg-black/30">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </Card>
  )
}

export default function LogsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [pageData, setPageData] = useState<Record<number, PageData>>({})
  const [totalPages, setTotalPages] = useState(1)

  // Function to fetch a specific page
  const fetchPage = async (page: number) => {
    try {
      const response = await fetch(`/api/logs?page=${page}&limit=5`)
      if (!response.ok) throw new Error('Failed to fetch logs')
      
      const data = await response.json()
      return {
        logs: data.logs,
        totalPages: data.totalPages
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error)
      return null
    }
  }

  // Preload next page
  const preloadNextPage = async (page: number) => {
    if (page > totalPages || pageData[page]) return
    
    const data = await fetchPage(page)
    if (data) {
      setPageData(prev => ({
        ...prev,
        [page]: data
      }))
    }
  }

  // Initial load and preload
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true)
      const data = await fetchPage(1)
      if (data) {
        setPageData({ 1: data })
        setTotalPages(data.totalPages)
        // Preload page 2
        preloadNextPage(2)
      }
      setIsLoading(false)
    }
    
    initialLoad()
  }, [])

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    // If we already have the page data, use it immediately
    if (pageData[newPage]) {
      setCurrentPage(newPage)
      // Preload next page
      preloadNextPage(newPage + 1)
      return
    }

    // Otherwise, load it
    setIsLoading(true)
    const data = await fetchPage(newPage)
    if (data) {
      setPageData(prev => ({
        ...prev,
        [newPage]: data
      }))
      setCurrentPage(newPage)
      // Preload next page
      preloadNextPage(newPage + 1)
    }
    setIsLoading(false)
  }

  // Get current logs
  const currentLogs = pageData[currentPage]?.logs || []

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'SAFE':
        return {
          badge: 'bg-green-500/10 text-green-500',
          gradient: 'bg-gradient-to-r from-green-950/50 via-transparent to-transparent'
        }
      case 'DANGEROUS':
        return {
          badge: 'bg-red-500/10 text-red-500',
          gradient: 'bg-gradient-to-r from-red-950/50 via-transparent to-transparent'
        }
      case 'SUSPICIOUS':
        return {
          badge: 'bg-yellow-500/10 text-yellow-500',
          gradient: 'bg-gradient-to-r from-yellow-950/50 via-transparent to-transparent'
        }
      default:
        return {
          badge: 'bg-gray-500/10 text-gray-500',
          gradient: 'bg-gradient-to-r from-gray-950/50 via-transparent to-transparent'
        }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-4">Threat Logs</h1>
          <p className="text-lg text-gray-400">
            Review past message analysis results and detected threats.
          </p>
        </div>

        <div className="space-y-4">
          {isLoading && !currentLogs.length ? (
            // Show skeleton only on initial load
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <LogSkeleton />
                </motion.div>
              ))}
            </div>
          ) : currentLogs.length === 0 ? (
            <p className="text-center text-gray-400">No logs found.</p>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {currentLogs.map((log) => {
                  const styles = getStatusStyles(log.status)
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="relative overflow-hidden border border-white/10 bg-black/30">
                        <div className={`absolute inset-0 ${styles.gradient} opacity-50`} />
                        <div className="relative p-4 z-10">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={styles.badge}>
                                {log.status}
                              </Badge>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                {log.responseTime && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {log.responseTime}ms
                                  </span>
                                )}
                                {log.modelUsed && (
                                  <span className="flex items-center gap-1">
                                    <BrainCircuit className="h-4 w-4" />
                                    {log.modelUsed}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-200">{log.message}</p>
                            <p className="text-sm text-gray-400">{log.reason}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="border-white/10 hover:bg-white/5"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2 px-4">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                      disabled={isLoading}
                      className={cn(
                        "w-8 h-8",
                        currentPage === i + 1 
                          ? "bg-primary text-primary-foreground" 
                          : "border-white/10 hover:bg-white/5"
                      )}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="border-white/10 hover:bg-white/5"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
