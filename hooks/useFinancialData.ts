import { useState, useEffect } from 'react';
import { Transaction, Goal, Budget, Prediction, Achievement, UserProfile } from '@/types';

// Mock data - in a real app, this would come from an API
const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Starbucks',
    category: 'Food & Drink',
    amount: -4.50,
    date: '2024-01-15',
    type: 'expense',
    color: '#fd79a8'
  },
  {
    id: '2',
    name: 'Uber',
    category: 'Transportation',
    amount: -12.30,
    date: '2024-01-15',
    type: 'expense',
    color: '#fdcb6e'
  },
  {
    id: '3',
    name: 'Salary',
    category: 'Income',
    amount: 3500.00,
    date: '2024-01-01',
    type: 'income',
    color: '#00b894'
  },
  {
    id: '4',
    name: 'Netflix',
    category: 'Subscription',
    amount: -15.99,
    date: '2024-01-14',
    type: 'expense',
    color: '#e17055'
  },
  {
    id: '5',
    name: 'Grocery Store',
    category: 'Food & Drink',
    amount: -85.20,
    date: '2024-01-13',
    type: 'expense',
    color: '#fd79a8'
  }
];

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    current: 8500,
    target: 15000,
    category: 'Safety Net',
    progress: 57,
    daysLeft: 120,
    color: '#00b894',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'New Car',
    current: 12000,
    target: 25000,
    category: 'Purchase',
    progress: 48,
    daysLeft: 365,
    color: '#6c5ce7',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    title: 'Vacation Fund',
    current: 2800,
    target: 5000,
    category: 'Lifestyle',
    progress: 56,
    daysLeft: 90,
    color: '#fd79a8',
    createdAt: '2024-01-01'
  }
];

const mockBudgets: Budget[] = [
  { category: 'Food', allocated: 600, spent: 450, remaining: 150, color: '#fd79a8' },
  { category: 'Transport', allocated: 300, spent: 180, remaining: 120, color: '#fdcb6e' },
  { category: 'Bills', allocated: 800, spent: 750, remaining: 50, color: '#6c5ce7' },
  { category: 'Shopping', allocated: 200, spent: 120, remaining: 80, color: '#00b894' },
  { category: 'Other', allocated: 300, spent: 180, remaining: 120, color: '#74b9ff' }
];

const mockPredictions: Prediction[] = [
  {
    id: '1',
    title: 'Next Month Spending',
    prediction: '$2,450',
    confidence: 87,
    trend: '+8% vs this month',
    color: ['#fd79a8', '#e84393'],
    type: 'spending'
  },
  {
    id: '2',
    title: 'Budget Depletion',
    prediction: '12 days',
    confidence: 92,
    trend: 'Food category',
    color: ['#e17055', '#d63031'],
    type: 'budget'
  },
  {
    id: '3',
    title: 'Savings Goal',
    prediction: 'March 15th',
    confidence: 78,
    trend: 'Emergency fund',
    color: ['#00b894', '#00a085'],
    type: 'savings'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Goal',
    description: 'Complete your first savings goal',
    isEarned: true,
    earnedDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Streak Master',
    description: 'Save for 30 consecutive days',
    isEarned: true,
    earnedDate: '2024-01-12'
  },
  {
    id: '3',
    title: 'Big Saver',
    description: 'Save $10,000 in total',
    isEarned: false
  }
];

const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'AJ',
  totalBalance: 4328.50,
  monthlyIncome: 3500,
  monthlyExpenses: 1247.80,
  savingsGoal: 12450
};

export const useFinancialData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [loading, setLoading] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update user balance
    setUserProfile(prev => ({
      ...prev,
      totalBalance: prev.totalBalance + transaction.amount
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'progress' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      progress: Math.round((goal.current / goal.target) * 100),
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...updates, progress: Math.round(((updates.current || goal.current) / (updates.target || goal.target)) * 100) }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const updateBudget = (category: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(budget =>
      budget.category === category
        ? { ...budget, ...updates, remaining: (updates.allocated || budget.allocated) - (updates.spent || budget.spent) }
        : budget
    ));
  };

  const getSpendingByCategory = () => {
    const categorySpending: { [key: string]: number } = {};
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        categorySpending[transaction.category] = (categorySpending[transaction.category] || 0) + Math.abs(transaction.amount);
      }
    });
    return categorySpending;
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return Math.abs(transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));
  };

  const getMonthlyTrend = () => {
    // Mock monthly trend data
    return [
      { month: 'Jul', spending: 1200 },
      { month: 'Aug', spending: 1350 },
      { month: 'Sep', spending: 1180 },
      { month: 'Oct', spending: 1420 },
      { month: 'Nov', spending: 1380 },
      { month: 'Dec', spending: 1580 }
    ];
  };

  return {
    transactions,
    goals,
    budgets,
    predictions,
    achievements,
    userProfile,
    loading,
    addTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    updateBudget,
    getSpendingByCategory,
    getTotalIncome,
    getTotalExpenses,
    getMonthlyTrend,
    setUserProfile
  };
};