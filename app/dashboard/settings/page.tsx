"use client"

import { useState, useEffect } from "react"
import { Users, Shield, Bell, XCircle, LoaderIcon, Settings, UserPlus } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FamilySettings } from "@/types/family"
import { Skeleton } from "@/components/ui/skeleton"
import { Session, User as NextAuthUser } from "next-auth"
import type { FamilyRole } from "@/types/next-auth"

interface Family {
  name: string;
  id: string;
}

// Extend NextAuthUser with optional family property
interface ExtendedUser extends NextAuthUser {
  family?: Family;
}

// Declare user property as ExtendedUser
interface CustomSession extends Session {
  user: ExtendedUser;
}

interface NotificationsSection {
  familyAlerts: boolean;
  memberActivity: boolean;
}

interface SecuritySection {
  autoBlock: boolean;
  parentApproval: boolean;
}

interface FamilySettingsData {
  familyName: string;
  familyIcon: string | null;
  familyCode: string | null;
  notifications: NotificationsSection;
  security: SecuritySection;
}

type ObjectSection = 'notifications' | 'security';
type SettingsSection = keyof FamilySettingsData;
type SectionValue<T extends SettingsSection> = FamilySettingsData[T];

const isNotificationsSection = (section: SettingsSection): section is 'notifications' => 
  section === 'notifications';

const isSecuritySection = (section: SettingsSection): section is 'security' => 
  section === 'security';

const isObjectSection = (section: SettingsSection): section is ObjectSection => 
  isNotificationsSection(section) || isSecuritySection(section);

const defaultFamilySettings: FamilySettingsData = {
  familyName: '',
  familyIcon: null,
  familyCode: null,
  notifications: {
    familyAlerts: false,
    memberActivity: false
  },
  security: {
    autoBlock: false,
    parentApproval: false
  }
};

type SessionContextValue = {
  data: CustomSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
};

export default function FamilySettingsPage() {
  const { data: session, status } = useSession() as SessionContextValue;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState<FamilySettingsData>(defaultFamilySettings);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<FamilySettingsData | null>(null);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await fetch('/api/family/members');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setMembers(data.members || []);
      setSettings(prevSettings => ({
        ...prevSettings,
        ...data.settings
      }));
    } catch (error) {
      setIsError(true);
      toast.error("Failed to load family members");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove or modify fetchSettings since we're getting settings from members API
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      await fetchMembers(); // Just call fetchMembers instead
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login")
    } else if (status === "authenticated") {
      Promise.all([fetchMembers(), fetchSettings()])
        .finally(() => setIsLoading(false))
    }
  }, [status, router])

  const handleSettingChange = <T extends SettingsSection>(
    section: T,
    value: Partial<SectionValue<T>> | SectionValue<T>
  ) => {
    setPendingSettings(prev => {
      const newSettings = { ...(prev || settings) };

      if (isNotificationsSection(section)) {
        newSettings.notifications = {
          ...settings.notifications,
          ...(value as NotificationsSection)
        };
      } else if (isSecuritySection(section)) {
        newSettings.security = {
          ...settings.security,
          ...(value as SecuritySection)
        };
      } else {
        newSettings[section] = value as SectionValue<T>;
      }

      return newSettings;
    });
    setUnsavedChanges(true);
  };

  const saveSettings = async () => {
    if (!pendingSettings || !unsavedChanges) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/family/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: pendingSettings })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const result = await response.json();
      
      // Update local state with the saved settings
      setSettings(pendingSettings);
      setPendingSettings(null);
      setUnsavedChanges(false);
      
      // Refresh the data
      await fetchMembers();
      
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  const handleInviteMember = async () => {
    try {
      const response = await fetch('/api/family/invite', {
        method: 'POST'
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      toast.success("Invitation sent successfully")
    } catch (error) {
      toast.error("Failed to send invitation")
    }
  }

  const retryLoad = () => {
    fetchMembers()
  }

  const SaveButton = () => (
    <div className="pt-6 border-t">
      <Button 
        className="w-full" 
        disabled={!unsavedChanges || isSaving}
        onClick={saveSettings}
      >
        {isSaving && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )

  const SettingsSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Family Settings"
        description="Configure family settings and preferences."
      />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-transparent">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {isLoading ? (
            <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
              <SettingsSkeleton />
            </Card>
          ) : (
            <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6 md:col-span-2">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold">Family Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Customize your family's basic information
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="familyName" className="text-sm font-medium">
                          Family Name
                        </Label>
                        <Input 
                          id="familyName"
                          value={pendingSettings?.familyName ?? 
                                 settings.familyName ?? 
                                 (session?.user?.family?.name || '')}
                          onChange={(e) => handleSettingChange('familyName', e.target.value)}
                          placeholder="Enter family name"
                          className="max-w-md"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24 border-4 border-primary/10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary/5">
                            <Users className="h-12 w-12 text-primary/80" />
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Family Icon
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Family Code</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share this code with family members to join
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Code</p>
                          <p className="text-2xl font-mono tracking-wider">
                            {settings.familyCode || 'No code available'}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(settings.familyCode || '')
                            toast.success('Code copied to clipboard')
                          }}
                        >
                          Copy Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Control how you receive updates
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="familyAlerts">Family Alerts</Label>
                        <Switch
                          id="familyAlerts"
                          checked={
                            (pendingSettings?.notifications?.familyAlerts ?? 
                            settings?.notifications?.familyAlerts) || 
                            defaultFamilySettings.notifications.familyAlerts
                          }
                          onCheckedChange={(checked) => handleSettingChange('notifications', {
                            ...settings.notifications,
                            familyAlerts: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="memberActivity">Member Activity</Label>
                        <Switch
                          id="memberActivity"
                          checked={pendingSettings?.notifications?.memberActivity ?? settings.notifications.memberActivity}
                          onCheckedChange={(checked) => handleSettingChange('notifications', {
                            ...settings.notifications,
                            memberActivity: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          {isLoading ? (
            <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-[200px]" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-semibold">Family Members</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your family circle members
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto" size="lg">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Family Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          placeholder="Enter email address"
                          type="email"
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleInviteMember}
                      >
                        Send Invitation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                    currentUserRole={session?.user?.familyRole ?? 'MEMBER'} 
                    />
                )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {isLoading ? (
            <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
              <SettingsSkeleton />
            </Card>
          ) : (
            <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
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
                      <Switch
                        id="autoBlock"
                        checked={pendingSettings?.security?.autoBlock ?? settings.security.autoBlock}
                        onCheckedChange={(checked) => handleSettingChange('security', {
                          ...settings.security,
                          autoBlock: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="parentApproval">Parent Approval</Label>
                        <p className="text-sm text-muted-foreground">
                          Require approval for new contacts
                        </p>
                      </div>
                      <Switch
                        id="parentApproval"
                        checked={pendingSettings?.security?.parentApproval ?? settings.security.parentApproval}
                        onCheckedChange={(checked) => handleSettingChange('security', {
                          ...settings.security,
                          parentApproval: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <SaveButton />
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Save Button */}
      {unsavedChanges && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto z-50">
          <div className="max-w-sm mx-auto md:mx-0 flex gap-2">
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                setUnsavedChanges(false);
                setPendingSettings(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="w-full md:w-auto"
              onClick={saveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}