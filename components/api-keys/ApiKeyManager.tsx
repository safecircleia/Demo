"use client"

import { useState } from "react"
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

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  createdAt: Date
  lastUsed?: Date | null
}

interface ApiKeyManagerProps {
  apiKeys: ApiKey[]
  isFreeTier: boolean
}

export function ApiKeyManager({ apiKeys, isFreeTier }: ApiKeyManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      })

      if (!response.ok) throw new Error("Failed to create API key")

      const data = await response.json()
      setNewKey(data.key)
      toast.success("API key created successfully")
    } catch (error) {
      toast.error("Failed to create API key")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })

      if (!response.ok) throw new Error("Failed to delete API key")

      window.location.reload()
      toast.success("API key deleted successfully")
    } catch (error) {
      toast.error("Failed to delete API key")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your API Keys</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="space-x-2"
              disabled={isFreeTier && apiKeys.length >= 1}
            >
              <Plus className="h-4 w-4" />
              <span>Create New Key</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Give your API key a name to help you identify its use.
              </DialogDescription>
            </DialogHeader>
            {newKey ? (
              <div className="space-y-4">
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    This key will only be shown once. Please copy it now and store it securely.
                  </AlertDescription>
                </Alert>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {newKey}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleCopy(newKey)}
                >
                  Copy Key
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API Key"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreate}
                    disabled={!name || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Key"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isFreeTier && apiKeys.length >= 1 && (
        <Alert>
          <Key className="h-4 w-4" />
          <AlertTitle>Free Tier Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached the limit of 1 API key. Upgrade to create more keys.
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
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell className="font-mono">
                    {key.keyPrefix}...
                  </TableCell>
                  <TableCell>{format(new Date(key.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {key.lastUsed 
                      ? format(new Date(key.lastUsed), 'MMM d, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(key.id)}
                      disabled={isLoading}
                      className="hover:text-destructive"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete key</span>
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
          <h3 className="mt-4 text-lg font-semibold">No API keys</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't created any API keys yet.
          </p>
        </div>
      )}
    </div>
  )
}