import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Key, Plus, Trash2 } from "lucide-react"
import { prisma } from "@/lib/prisma"

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed: Date | null
  usageLimit: number
  usageCount: number
}

export default async function ApiKeysPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage your API keys for integrating with our services."
      />

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your API Keys</h3>
            <Button className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create New Key</span>
            </Button>
          </div>

          <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div className="text-sm">
                <h4 className="font-medium text-yellow-500">Important</h4>
                <p className="text-muted-foreground mt-1">
                  API keys carry many privileges. Keep them secure and never share them in publicly accessible areas.
                </p>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded">
                        {key.key.slice(0, 8)}...{key.key.slice(-8)}
                      </code>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {key.lastUsed 
                      ? new Date(key.lastUsed).toLocaleDateString()
                      : "Never"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm">{key.usageCount} / {key.usageLimit}</div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(key.usageCount / key.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}