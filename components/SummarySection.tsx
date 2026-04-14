'use client';

import { Expense, calculateTotalSpending, getBudgetStatus } from '../lib/utils';
import styles from './SummarySection.module.css';

interface SummarySectionProps {
  expenses: Expense[];
  budget: number;
}

export default function SummarySection({ expenses, budget }: SummarySectionProps) {
  const totalSpending = calculateTotalSpending(expenses);
  const { status, isWarning, percentage } = getBudgetStatus(expenses, budget);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.totalCard}>
        <h3>Total Spending</h3>
        <div className={styles.totalAmount}>Rs {totalSpending.toFixed(2)}</div>
        <p className={styles.count}>{expenses.length} recorded expenses</p>
      </div>

      <div className={styles.budgetCard}>
        <h3>Budget Status</h3>
        <div className={styles.budgetInfo}>
          <div className={styles.budgetBar}>
            <div
              className={`${styles.budgetFill} ${isWarning ? styles.warning : styles.normal}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className={`${styles.budgetStatus} ${isWarning ? styles.warning : ''}`}>
            {status}
          </p>
          <div className={styles.budgetDetails}>
            <span>
              <strong>Budget</strong>
              Rs {budget}
            </span>
            <span>
              <strong>Spent</strong>
              Rs {totalSpending.toFixed(2)}
            </span>
            <span>
              <strong>Remaining</strong>
              Rs {Math.max(0, budget - totalSpending).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
