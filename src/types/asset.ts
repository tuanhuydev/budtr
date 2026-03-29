export enum AssetType {
  CASH = 'CASH',
  BANK = 'BANK',
  INVESTMENT = 'INVESTMENT',
  PHYSICAL = 'PHYSICAL',
}

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  currentBalance: number;
  currency?: string;
  userId?: string;
  createdAt?: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
  deletedAt?: string; // ISO 8601 format
};
