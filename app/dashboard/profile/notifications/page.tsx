import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Mail, Shield, Smartphone, AlertTriangle } from "lucide-react"

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Manage your notification preferences and settings."
      />

      <div className="space-y-6">
        {/* Email Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 rounded-lg bg-white/5">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive email notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="suspicious-activity">Suspicious Activity</Label>
              <Switch id="suspicious-activity" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-summary">Weekly Summary</Label>
              <Switch id="weekly-summary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Frequency</Label>
                <p className="text-sm text-muted-foreground">
                  How often you want to receive email updates
                </p>
              </div>
              <Select defaultValue="realtime">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Push Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 rounded-lg bg-white/5">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage your mobile and desktop notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <Switch id="desktop-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
              <Switch id="mobile-notifications" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Security Alerts */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 rounded-lg bg-white/5">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Security Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Important security-related notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <Switch id="security-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="unusual-activity">Unusual Activity</Label>
              <Switch id="unusual-activity" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="critical-updates">Critical Updates</Label>
              <Switch id="critical-updates" defaultChecked />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}