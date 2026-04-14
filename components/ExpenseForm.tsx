'use client';

import { useState } from 'react';
import { Expense } from '../lib/utils';
import styles from './ExpenseForm.module.css';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, '_id' | 'createdAt'>) => Promise<void>;
  isLoading: boolean;
}

export default function ExpenseForm({ onAddExpense, isLoading }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.amount) {
      alert('Please fill all fields');
      return;
    }

    await onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount),
    } as Omit<Expense, '_id' | 'createdAt'>);

    setFormData({ title: '', amount: '', category: 'Food' });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitleRow}>
        <h2>Add Expense</h2>
        <p>Record a new spend in seconds</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Lunch at restaurant"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amount">Amount (Rs)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.submitWrap}>
          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
