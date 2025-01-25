'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy, Users } from 'lucide-react'

interface FamilyCodeProps {
  familyCode: string
}

export function FamilyCode({ familyCode }: FamilyCodeProps) {
  const [copied, setCopied] = useState(false)

  return (
    <Card className="p-6 border border-accent">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Family Code
          </h2>
          <p className="text-muted-foreground text-sm">Share this code with family members</p>
        </div>
        <div className="flex items-center gap-2 bg-accent/50 p-2 rounded-lg">
          <code className="font-mono text-lg">{familyCode}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(familyCode)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="hover:bg-accent"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}