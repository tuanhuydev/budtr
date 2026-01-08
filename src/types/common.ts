export enum ExpenseType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORTATION = 'TRANSPORTATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  UTILITIES = 'UTILITIES',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  SALARY = 'SALARY',
  BUSINESS = 'BUSINESS',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export type DropdownOption<T> = {
  label: string;
  value: T;
};
