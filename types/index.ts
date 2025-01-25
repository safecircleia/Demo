export interface ProfileFormData {
  name: string;
  email: string;
}

export interface Settings {
  notifications: {
    familyAlerts: boolean;
    memberActivity: boolean;
  };
  security: {
    autoBlock: boolean;
    parentApproval: boolean;
  };
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  familyRole: "ADMIN" | "MEMBER";
  family?: {
    id: string;
    name: string;
    code: string;
    settings?: Settings;
    members: {
      id: string;
      name: string | null;
      email: string | null;
      familyRole: "ADMIN" | "MEMBER";
    }[];
  };
}