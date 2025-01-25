export interface FamilyDetails {
  name: string;
  description?: string;
}

export interface SafetySettings {
  locationSharing: boolean;
  notificationsEnabled: boolean;
  geofencingEnabled: boolean;
  alertRadius: number;
}