"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/webauthn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Upload, User, KeyRound, Shield, UserCircle, Info, Smartphone, Trash2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProfileFormProps {
  user: {
    name: string | null
    email: string | null
    image: string | null
    createdAt: Date
    authenticators?: Array<{
      id: string
      credentialID: string // Add this line
      credentialDeviceType: string
      credentialBackedUp: boolean
    }>
  }
}

interface PasskeyData {
  id: string
  credentialID: string
  credentialDeviceType: string
  credentialBackedUp: boolean
  lastUsed?: Date
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { status } = useSession()

  const hasPasskey = user.authenticators && user.authenticators.length > 0

  const handlePasskeyEnroll = async () => {
    if (hasPasskey) {
      setError("You have already registered a passkey")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const result = await signIn("passkey", { 
        action: "register",
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    } catch (error) {
      setError("Failed to enroll passkey")
      console.error("Failed to enroll passkey:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasskeyRemoval = async (credentialId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/passkeys/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentialId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove passkey')
      }

      router.refresh()
    } catch (error) {
      setError('Failed to remove passkey')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

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
    <form onSubmit={onSubmit}>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm p-1 text-muted-foreground">
          <TabsTrigger 
            value="profile" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white/10 data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-white/5 hover:text-primary/80"
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white/10 data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-white/5 hover:text-primary/80"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="about"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white/10 data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-white/5 hover:text-primary/80"
          >
            <Info className="h-4 w-4 mr-2" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="profile"
          className="mt-0"
        >
          <Card className="border border-white/5 p-6 mb-6">
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
                />
              </div>
            </div>
          </Card>

          <Card className="border border-white/5 p-6">
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
            </div>
          </Card>

          <Card className="border border-white/5 p-4 mt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent 
          value="security"
          className="mt-0"
        >
          <Card className="border border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Passkey Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    {hasPasskey 
                      ? "Manage your registered passkeys for passwordless sign-in"
                      : "Add a passkey to enable passwordless sign-in across your devices"}
                  </p>
                </div>
                {!hasPasskey && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handlePasskeyEnroll}
                    disabled={isLoading || status !== "authenticated"}
                  >
                    <KeyRound className="h-4 w-4" />
                    Add Passkey
                  </Button>
                )}
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {hasPasskey && (
                <div className="border rounded-lg divide-y">
                  {user.authenticators?.map((auth) => (
                    <div 
                      key={auth.id} 
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10">
                          <Smartphone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Security Key</p>
                          <div className="text-sm text-muted-foreground">
                            {auth.credentialDeviceType === 'platform' 
                              ? 'Built-in authenticator'
                              : 'External security key'}
                            {auth.credentialBackedUp && ' • Synced'}
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove passkey</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Passkey</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this passkey? This action cannot be undone 
                              and you will need to register a new passkey to use passwordless sign-in.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handlePasskeyRemoval(auth.credentialID)}
                              disabled={isLoading}
                            >
                              {isLoading ? "Removing..." : "Remove Passkey"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent 
          value="about"
          className="mt-0"
        >
          <Card className="border border-white/10 bg-black/20 backdrop-blur-sm p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about yourself..."
                  disabled={isLoading}
                />
              </div>

              <Separator />

              <div className="space-y-1">
                <h4 className="text-sm font-medium">Account Details</h4>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}