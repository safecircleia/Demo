export type AccountType = 'parent' | 'child';

export interface AccountTypeSelectorProps {
  onSelect: (type: AccountType) => void;
}