import { useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

type UsageUpdate = {
  apiKeyId: string
  total: number
}

export function useApiUsageStream(callback: (data: UsageUpdate) => void) {
  const socket = useRef<Socket | null>(null)

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_REALTIME_URL || 'http://localhost:3001')

    socket.current.on('connect', () => {
      console.log('Connected to usage stream')
    })

    socket.current.on('api_usage_update', (data: UsageUpdate) => {
      console.log('Received update:', data)
      callback(data)
    })

    return () => {
      if (socket.current) {
        socket.current.disconnect()
      }
    }
  }, [callback])

  return socket.current
}