export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  category: string;
  progress: number;
  daysLeft: number;
  color: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface Budget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  color: string;
}

export interface Prediction {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  trend: string;
  color: string[];
  type: 'spending' | 'savings' | 'budget';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isEarned: boolean;
  earnedDate?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
}