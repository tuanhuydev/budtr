import { DropdownOption, ExpenseCategory, ExpenseType } from '../types/common';

export const transactionOptions: Array<DropdownOption<ExpenseType>> = [
  { label: 'Income', value: ExpenseType.INCOME },
  { label: 'Expense', value: ExpenseType.EXPENSE },
];

export const categoryOptions: Array<DropdownOption<ExpenseCategory>> = [
  { label: 'Food', value: ExpenseCategory.FOOD },
  { label: 'Transportation', value: ExpenseCategory.TRANSPORTATION },
  { label: 'Entertainment', value: ExpenseCategory.ENTERTAINMENT },
  { label: 'Utilities', value: ExpenseCategory.UTILITIES },
  { label: 'Healthcare', value: ExpenseCategory.HEALTHCARE },
  { label: 'Education', value: ExpenseCategory.EDUCATION },
  { label: 'Shopping', value: ExpenseCategory.SHOPPING },
  { label: 'Travel', value: ExpenseCategory.TRAVEL },
  { label: 'Salary', value: ExpenseCategory.SALARY },
  { label: 'Business', value: ExpenseCategory.BUSINESS },
  { label: 'Investment', value: ExpenseCategory.INVESTMENT },
  { label: 'Other', value: ExpenseCategory.OTHER },
];
export const CATEGORY_COLORS: Record<string, string> = {
  NONE: '#D5DBE0',
  FOOD: '#3B82A0',
  TRANSPORTATION: '#6AA89A',
  UTILITIES: '#D9A441',
  SHOPPING: '#C8776B',
  HEALTHCARE: '#8C7BB5',
  OTHER: '#C5CCD2',
  // proposals beyond the approved design
  ENTERTAINMENT: '#E0865A',
  TRAVEL: '#B8719F',
  EDUCATION: '#5B7DB1',
  SALARY: '#7FA66B',
  BUSINESS: '#8B7E74',
  INVESTMENT: '#9DB85B',
};

export const HIDDEN_BALANCE_PATTERN = '******** ***';

export const AUTH_URL = process.env.APP_AUTH_URL ?? 'http://localhost:8888';
