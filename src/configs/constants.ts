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
  FOOD: '#0088FE',
  TRANSPORTATION: '#00C49F',
  ENTERTAINMENT: '#FFBB28',
  UTILITIES: '#FF8042',
  HEALTHCARE: '#8884D8',
  EDUCATION: '#82CA9D',
  SHOPPING: '#FFC658',
  TRAVEL: '#FF6B9D',
  SALARY: '#8DD1E1',
  BUSINESS: '#D0ED57',
  INVESTMENT: '#A4DE6C',
  OTHER: '#9E9E9E',
};

export const HIDDEN_BALANCE_PATTERN = '******** ***';

export const AUTH_URL = process.env.APP_AUTH_URL ?? 'http://localhost:8888';
