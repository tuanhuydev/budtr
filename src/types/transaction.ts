import { ExpenseBehavior, ExpenseCategory, ExpenseType } from './common';

export { ExpenseBehavior, ExpenseCategory, ExpenseType } from './common';

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  source: string;
  description?: string;
  type: ExpenseType;
  behavior: ExpenseBehavior;
  category: ExpenseCategory;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  deletedAt?: string; // ISO 8601 format
};
