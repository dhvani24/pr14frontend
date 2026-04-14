'use client';

import { Expense, getTopCategory, getSpendingTrend, calculateCategoryTotals } from '../lib/utils';
import styles from './InsightsPanel.module.css';

interface InsightsPanelProps {
  expenses: Expense[];
}

export default function InsightsPanel({ expenses }: InsightsPanelProps) {
  const topCategory = getTopCategory(expenses);
  const spendingTrend = getSpendingTrend(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);

  return (
    <div className={styles.insightsContainer}>
      <h2>Smart Insights</h2>
      <p className={styles.subtitle}>Patterns generated from your logged expenses.</p>

      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>TC</div>
          <div className={styles.insightContent}>
            <p className={styles.label}>Top Category</p>
            {topCategory ? (
              <p className={styles.value}>
                You spend most on <strong>{topCategory}</strong>
              </p>
            ) : (
              <p className={styles.value}>No spending data yet</p>
            )}
          </div>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>TR</div>
          <div className={styles.insightContent}>
            <p className={styles.label}>Spending Trend</p>
            <p className={styles.value}>{spendingTrend}</p>
          </div>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className={styles.categoryBreakdown}>
          <h3>Category Breakdown</h3>
          <div className={styles.categoryBars}>
            {Object.entries(categoryTotals).map(([category, amount]) => {
              const maxAmount = Math.max(...Object.values(categoryTotals));
              const percentage = (amount / maxAmount) * 100;

              return (
                <div key={category} className={styles.categoryBar}>
                  <div className={styles.barLabel}>
                    <span>{category}</span>
                    <span className={styles.barAmount}>Rs {amount.toFixed(2)}</span>
                  </div>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.bar}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
