import { ExpenseBehavior, ExpenseCategory, ExpenseType } from './common';

export { ExpenseCategory, ExpenseType } from './common';

export type Expense = {
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
