'use client';

import { Expense } from '../lib/utils';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => Promise<void>;
  isLoading: boolean;
}

const categoryEmojis: Record<string, string> = {
  Food: 'FD',
  Travel: 'TR',
  Shopping: 'SP',
  Other: 'OT',
};

export default function ExpenseList({
  expenses,
  onDeleteExpense,
  isLoading,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Nothing logged yet</h3>
        <p>Add your first expense to start tracking patterns.</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <h2>Recent Expenses</h2>
      <div className={styles.expenseList}>
        {expenses.map((expense) => (
          <div key={expense._id} className={styles.expenseCard}>
            <div className={styles.expenseContent}>
              <div className={styles.expenseHeader}>
                <span className={styles.categoryEmoji}>
                  {categoryEmojis[expense.category]}
                </span>
                <div className={styles.expenseInfo}>
                  <h3>{expense.title}</h3>
                  <p className={styles.category}>{expense.category}</p>
                </div>
              </div>
              <div className={styles.expenseAmount}>
                <span className={styles.amount}>Rs {expense.amount.toFixed(2)}</span>
                <span className={styles.date}>
                  {new Date(expense.createdAt).toLocaleDateString('en-IN', {
                    year: '2-digit',
                    month: 'short',
                    day: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDeleteExpense(expense._id)}
              disabled={isLoading}
              className={styles.deleteBtn}
              title="Delete expense"
            >
              DEL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
