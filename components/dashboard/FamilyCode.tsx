'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface FamilyCodeProps {
  familyCode: string
}

export function FamilyCode({ familyCode }: FamilyCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(familyCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Family Code</h2>
          <p className="text-gray-400 text-sm">Share this code with family members to let them join</p>
        </div>
        <div className="flex items-center gap-4">
          <code className="bg-black/20 px-4 py-2 rounded-md font-mono">
            {familyCode}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="hover:bg-white/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}