import { createServer } from "http"
import { Server } from "socket.io"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: "*", // More permissive for testing
    methods: ["GET", "POST"],
  },
})

const PORT = process.env.REALTIME_PORT || 3001

httpServer.listen(PORT, async () => {
  console.log(`Realtime server running on port ${PORT}`)
  await streamApiUsage(io)
})

async function streamApiUsage(io: Server) {
  setInterval(async () => {
    try {
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const usage = await prisma.apiUsage.groupBy({
        by: ['apiKeyId'],
        _sum: {
          count: true
        },
        where: {
          month: {
            gte: currentMonth
          }
        }
      })

      usage.forEach((data) => {
        io.emit("api_usage_update", {
          apiKeyId: data.apiKeyId,
          total: data._sum.count || 0,
        })
      })

    } catch (error) {
      console.error("Error streaming usage:", error)
    }
  }, 2000)
}