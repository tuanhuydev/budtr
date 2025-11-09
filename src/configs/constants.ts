import { DropdownOption, ExpenseCategory, ExpenseType } from '../types/common';

export const expenseOptions: Array<DropdownOption<ExpenseType>> = [
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

export const AUTH_URL = process.env.APP_AUTH_URL ?? 'http://localhost:8888';
