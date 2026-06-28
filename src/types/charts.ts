export type BudgetVsActualItem = {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
};

export type BudgetVsActualChart = {
  month: string;
  items: BudgetVsActualItem[];
};

export type SpendingTrendPoint = {
  month: string;
  category: string;
  amount: number;
};

export type SpendingTrendsChart = {
  months: string[];
  categories: string[];
  data: SpendingTrendPoint[];
};

export type CategoryBreakdownItem = {
  category: string;
  amount: number;
  percentage: number;
};

export type CategoryBreakdownChart = {
  month: string;
  total: number;
  items: CategoryBreakdownItem[];
};

export type MonthlyComparisonPoint = {
  month: string;
  category: string;
  amount: number;
};

export type MonthlyComparisonChart = {
  months: string[];
  categories: string[];
  data: MonthlyComparisonPoint[];
};

export type SavingsProgressPoint = {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
};

export type SavingsProgressChart = {
  data: SavingsProgressPoint[];
  projectedSavingsRate: number;
};

export type ChartName =
  | 'budget_vs_actual'
  | 'spending_trends'
  | 'category_breakdown'
  | 'monthly_comparison'
  | 'savings_progress';
