import { ExpenseBehavior, ExpenseCategory, ExpenseType } from '@/types/common';

export type CreateExpenseDTO = {
  amount: number;
  currency: string;
  source: string;
  type: ExpenseType;
  category: ExpenseCategory;
  behavior: ExpenseBehavior;
  createdAt?: string;
};
