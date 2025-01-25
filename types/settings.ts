export interface SecuritySettings {
  autoBlock: boolean;
  parentApproval: boolean;
}

export interface FamilySettings {
  security: SecuritySettings;
}

export function isFamilySettings(value: unknown): value is FamilySettings {
  if (!value || typeof value !== 'object') return false;
  const obj = value as any;
  return (
    'security' in obj &&
    typeof obj.security === 'object' &&
    'autoBlock' in obj.security &&
    'parentApproval' in obj.security
  );
}