import { FamilySettings } from "@/types/settings"

interface SettingsPageProps {
  initialSettings: FamilySettings;
}

export function SettingsPage({ initialSettings }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Family Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Auto Block</h3>
            <p className="text-sm text-gray-500">Automatically block suspicious accounts</p>
          </div>
          <input 
            type="checkbox" 
            defaultChecked={initialSettings.security.autoBlock}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Parent Approval</h3>
            <p className="text-sm text-gray-500">Require parent approval for new connections</p>
          </div>
          <input 
            type="checkbox"
            defaultChecked={initialSettings.security.parentApproval} 
          />
        </div>
      </div>
    </div>
  )
}