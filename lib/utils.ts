export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Other';
  createdAt: string;
}

export interface CategorySum {
  [key: string]: number;
}

export const calculateCategoryTotals = (expenses: Expense[]): CategorySum => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as CategorySum);
};

export const calculateTotalSpending = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getTopCategory = (expenses: Expense[]): string | null => {
  const totals = calculateCategoryTotals(expenses);
  return Object.keys(totals).length > 0
    ? Object.entries(totals).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    : null;
};

export const getSpendingTrend = (expenses: Expense[]): string => {
  if (expenses.length < 2) return 'Not enough data';

  const recent = expenses.slice(0, Math.ceil(expenses.length / 2));
  const older = expenses.slice(Math.ceil(expenses.length / 2));

  const recentSum = calculateTotalSpending(recent);
  const olderSum = calculateTotalSpending(older);

  if (recentSum > olderSum) {
    const increase = (((recentSum - olderSum) / olderSum) * 100).toFixed(1);
    return `Increased by ${increase}%`;
  } else if (recentSum < olderSum) {
    const decrease = (((olderSum - recentSum) / olderSum) * 100).toFixed(1);
    return `Decreased by ${decrease}%`;
  }
  return 'Stable spending';
};

export const getBudgetStatus = (
  expenses: Expense[],
  budget: number
): { status: string; isWarning: boolean; percentage: number } => {
  const total = calculateTotalSpending(expenses);
  const percentage = (total / budget) * 100;

  if (total > budget) {
    return {
      status: `WARNING: Budget exceeded. Spent Rs ${total.toFixed(2)} of Rs ${budget}`,
      isWarning: true,
      percentage: Math.min(percentage, 100),
    };
  } else if (percentage >= 80) {
    return {
      status: `WARNING: Near budget. ${(100 - percentage).toFixed(0)}% remaining`,
      isWarning: true,
      percentage,
    };
  }
  return {
    status: `Within budget - Rs ${(budget - total).toFixed(2)} remaining`,
    isWarning: false,
    percentage,
  };
};
