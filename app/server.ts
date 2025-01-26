import { createServer } from "http"
import { Server } from "socket.io"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

const PORT = process.env.REALTIME_PORT || 3001

httpServer.listen(PORT, async () => {
  console.log(`Realtime server running on port ${PORT}`)
  await streamApiUsage(io)
})

async function streamApiUsage(io: Server) {
  let previousCounts = new Map<string, number>()

  // Initialize previous counts
  const initial = await prisma.apiUsage.findMany({
    select: {
      apiKeyId: true,
      count: true,
    }
  })
  initial.forEach(usage => {
    previousCounts.set(usage.apiKeyId, usage.count)
  })

  // Poll for changes every 5 seconds
  setInterval(async () => {
    try {
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const current = await prisma.apiUsage.findMany({
        where: {
          month: {
            gte: currentMonth
          }
        },
        include: {
          apiKey: true
        }
      })

      for (const usage of current) {
        const previousCount = previousCounts.get(usage.apiKeyId) || 0
        if (usage.count !== previousCount) {
          io.emit("api_usage_update", {
            apiKeyId: usage.apiKeyId,
            count: usage.count,
            month: usage.month,
            keyName: usage.apiKey.name
          })
          previousCounts.set(usage.apiKeyId, usage.count)
        }
      }
    } catch (error) {
      console.error("Error checking for API usage updates:", error)
    }
  }, 5000)

  // Cleanup on server shutdown
  process.on("SIGTERM", async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}