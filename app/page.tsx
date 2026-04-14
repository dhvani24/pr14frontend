'use client';

import { useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import InsightsPanel from '../components/InsightsPanel';
import SummarySection from '../components/SummarySection';
import { Expense, calculateTotalSpending } from '../lib/utils';
import { initSocket, getSocket, disconnectSocket } from '../lib/socket';
import styles from './page.module.css';

const API_URL = 'http://localhost:5000/api';
const BUDGET = 5000;

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Socket.IO and fetch expenses
  useEffect(() => {
    const socket = initSocket();

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Connection error. Make sure backend is running.');
    });

    socket.on('expense-added', (newExpense: Expense) => {
      setExpenses((prev) => [newExpense, ...prev]);
    });

    socket.on('expense-deleted', (id: string) => {
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    });

    fetchExpenses();

    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchExpenses = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses. Is the backend running?');
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, '_id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error('Failed to add expense');
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSpending = calculateTotalSpending(expenses);
  const remainingBudget = Math.max(0, BUDGET - totalSpending);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.backgroundLayer} aria-hidden="true"></div>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <p className={styles.kicker}>Finance Studio</p>
          <h1>Smart Expense Tracker</h1>
          <p>Track every spend, read the trend, and stay within your monthly plan.</p>
        </div>
        <div className={styles.statusCard}>
          <p className={styles.statusLabel}>Live API status</p>
          <span className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <section className={styles.statsRow}>
        <article className={styles.statCard}>
          <p>Total spending</p>
          <h3>Rs {totalSpending.toFixed(2)}</h3>
        </article>
        <article className={styles.statCard}>
          <p>Budget remaining</p>
          <h3>Rs {remainingBudget.toFixed(2)}</h3>
        </article>
        <article className={styles.statCard}>
          <p>Total entries</p>
          <h3>{expenses.length}</h3>
        </article>
      </section>

      <div className={styles.container}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.layout}>
          <div className={styles.leftPanel}>
            <h2 className={styles.panelHeading}>Capture</h2>
            <ExpenseForm onAddExpense={handleAddExpense} isLoading={isLoading} />
            <SummarySection expenses={expenses} budget={BUDGET} />
          </div>

          <div className={styles.rightPanel}>
            <h2 className={styles.panelHeading}>Insights</h2>
            <InsightsPanel expenses={expenses} />
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Smart Expense Tracker - College Practical Project</p>
      </footer>
    </main>
  );
}
