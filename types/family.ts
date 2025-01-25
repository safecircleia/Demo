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

export interface FamilySettings {
  familyName: string;
  familyCode: string;
  familyIcon?: string | null;
  notifications: {
    familyAlerts: boolean;
    memberActivity: boolean;
  };
  security: {
    autoBlock: boolean;
    parentApproval: boolean;
  };
}

export const defaultFamilySettings: FamilySettings = {
  familyName: '',
  familyCode: '',
  familyIcon: null,
  notifications: {
    familyAlerts: true,
    memberActivity: true
  },
  security: {
    autoBlock: true,
    parentApproval: true
  }
};