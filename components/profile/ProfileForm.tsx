"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" className="space-x-2" type="button">
              <Upload className="h-4 w-4" />
              <span>Change Avatar</span>
            </Button>
            <input 
              type="file" 
              name="avatar" 
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  // Handle file upload
                }
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={user.name || ""}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email"
              defaultValue={user.email || ""}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </form>
  )
}