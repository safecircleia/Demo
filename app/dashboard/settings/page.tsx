"use client"

import { useState, useEffect } from "react"
import { Users, Shield, Bell, XCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FamilyMembers } from "@/components/dashboard/FamilyMembers"
import { FamilyCode } from "@/components/dashboard/FamilyCode"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function FamilySettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [members, setMembers] = useState([])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const response = await fetch('/api/family/members')
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setMembers(data)
    } catch (error) {
      setIsError(true)
      toast.error("Failed to load family members")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login")
    } else if (status === "authenticated") {
      fetchMembers()
    }
  }, [status, router])

  const retryLoad = () => {
    fetchMembers()
  }

  // if (status === "loading" || isLoading) {
  //   return <LoadingSpinner />
  // }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Settings"
        description="Manage your family settings and preferences."
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Family Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Family Name</Label>
                    <Input id="familyName" placeholder="Enter family name" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <Users className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Family Icon</Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Family Code</h3>
                <FamilyCode 
                  familyCode={
                    session?.user?.familyCode ?? 
                    'No family code available'
                  } 
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="familyAlerts">Family Alerts</Label>
                    <Switch id="familyAlerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="memberActivity">Member Activity</Label>
                    <Switch id="memberActivity" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="p-6">
            <div className="space-y-6">
              {isError ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <XCircle className="h-12 w-12 text-destructive/50" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Failed to load members</h3>
                    <p className="text-sm text-muted-foreground">
                      There was an error loading the family members. Please try again.
                    </p>
                  </div>
                  <Button onClick={retryLoad} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No members yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start by adding family members to your account.
                    </p>
                  </div>
                </div>
              ) : (
                <FamilyMembers 
                  members={members} 
                  currentUserRole={session?.user?.familyRole || 'MEMBER'} 
                />
              )}
              <div className="flex justify-end">
                <Button className="w-full">Invite New Member</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="autoBlock">Automatic Blocking</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically block suspicious contacts
                      </p>
                    </div>
                    <Switch id="autoBlock" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="parentApproval">Parent Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        Require approval for new contacts
                      </p>
                    </div>
                    <Switch id="parentApproval" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}