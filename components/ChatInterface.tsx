'use client'

import { useState } from 'react'
import { Send, Moon, Sun } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to chat
    setMessages(prev => [...prev, { text: input, sender: 'user' }])

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) throw new Error('Failed to get prediction')

      const data = await response.json()
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        text: `Prediction: ${data.prediction} (Harmful probability: ${(data.probability * 100).toFixed(2)}%)`, 
        sender: 'ai' 
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { text: 'Error: Failed to get prediction', sender: 'ai' }])
    }

    setInput('')
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`w-full max-w-md ${darkMode ? 'dark' : ''}`}>
      <Card className="bg-background text-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Predator Detection</CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {msg.text}
              </span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}