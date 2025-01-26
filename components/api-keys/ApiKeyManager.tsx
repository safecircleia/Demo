"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Key, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

const SUBSCRIPTION_LIMITS = {
  free: {
    apiKeys: 1,
    rateLimit: 100,
    monthlyQuota: 1000
  },
  pro: {
    apiKeys: 5,
    rateLimit: 500,
    monthlyQuota: 50000
  },
  premium: {
    apiKeys: 10,
    rateLimit: 2000,
    monthlyQuota: 200000
  }
} as const

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  createdAt: Date
  lastUsed?: Date | null
  usageCount: number
  usage?: {
    count: number
    month: Date
  }[]
}

interface ApiKeyManagerProps {
  isFreeTier: boolean
  subscriptionPlan: keyof typeof SUBSCRIPTION_LIMITS
}

export function ApiKeyManager({ isFreeTier, subscriptionPlan = 'free' }: ApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)

  const limits = SUBSCRIPTION_LIMITS[subscriptionPlan]

  const loadApiKeys = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/keys')
      const data = await response.json()
      setApiKeys(data)
    } catch (error) {
      toast.error('Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createApiKey = async (name: string) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      
      if (!response.ok) throw new Error()
      
      const data = await response.json()
      setNewKey(data.key) // Store the new API key
      await loadApiKeys()
      toast.success('API key created successfully')
    } catch (error) {
      toast.error('Failed to create API key')
    }
  }

  const deleteApiKey = async (id: string) => {
    try {
      setIsDeletingId(id)
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error()
      
      await loadApiKeys() // Reload after deletion
      toast.success('API key deleted successfully')
    } catch (error) {
      toast.error('Failed to delete API key')
    } finally {
      setIsDeletingId(null)
    }
  }

  useEffect(() => {
    loadApiKeys()
  }, [loadApiKeys])

  // Calculate total usage for current month
  const totalUsage = useMemo(() => {
    const currentMonth = new Date().getMonth()
    return apiKeys.reduce((total, key) => {
      const monthlyUsage = key.usage?.find(u => 
        new Date(u.month).getMonth() === currentMonth
      )?.count || 0
      return total + monthlyUsage
    }, 0)
  }, [apiKeys])

  const usagePercentage = (totalUsage / limits.monthlyQuota) * 100

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Your API Keys</h3>
          <p className="text-sm text-muted-foreground">
            {apiKeys.length} of {limits.apiKeys} keys used
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="space-x-2"
              disabled={apiKeys.length >= limits.apiKeys}
            >
              <Plus className="h-4 w-4" />
              <span>Create New Key</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newKey ? 'Your New API Key' : 'Create API Key'}
              </DialogTitle>
            </DialogHeader>
            {newKey ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please copy your API key now. You won't be able to see it again!
                </p>
                <div className="rounded-md bg-muted p-4">
                  <code className="text-sm">{newKey}</code>
                </div>
                <Button 
                  onClick={() => handleCopy(newKey)}
                  className="w-full"
                >
                  Copy API Key
                </Button>
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault()
                createApiKey(name)
              }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My API Key"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create API Key
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Rate Limit</p>
              <Badge variant="outline">
                {limits.rateLimit}/min
              </Badge>
            </div>
            <Progress 
              value={0}
              className="h-2"
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Monthly Usage</p>
              <Badge variant="outline">
                {totalUsage.toLocaleString()} / {limits.monthlyQuota.toLocaleString()}
              </Badge>
            </div>
            <Progress 
              value={usagePercentage}
              className="h-2"
            />
          </div>
        </Card>
      </div>

      {isFreeTier && apiKeys.length >= 1 && (
        <Alert>
          <Key className="h-4 w-4" />
          <AlertTitle>Free Tier Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached the limit of 1 API key. Upgrade to create more keys and increase your rate limits.
          </AlertDescription>
        </Alert>
      )}

      {apiKeys.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key Prefix</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>{key.keyPrefix}...</TableCell>
                  <TableCell>{format(key.createdAt, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {key.lastUsed ? format(key.lastUsed, 'MMM d, yyyy') : 'Never'}
                  </TableCell>
                  <TableCell>
                    {key.usageCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeletingId === key.id}
                      onClick={() => deleteApiKey(key.id)}
                    >
                      {isDeletingId === key.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No API keys</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an API key to get started
          </p>
        </div>
      )}
    </div>
  )
}