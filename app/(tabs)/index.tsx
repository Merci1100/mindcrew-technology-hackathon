import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertTriangle,
  Target,
  Zap,
  PiggyBank,
  Plus
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useFinancialData } from '@/hooks/useFinancialData';
import { AddTransactionModal } from '@/components/AddTransactionModal';

const DashboardCard = ({ children, style = {} }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const MetricCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <DashboardCard style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Icon size={20} color="#74b9ff" />
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <View style={styles.changeContainer}>
      {isPositive ? (
        <TrendingUp size={16} color="#00b894" />
      ) : (
        <TrendingDown size={16} color="#e17055" />
      )}
      <Text style={[styles.changeText, { color: isPositive ? '#00b894' : '#e17055' }]}>
        {change}
      </Text>
    </View>
  </DashboardCard>
);

const PredictionCard = ({ onViewSuggestions }) => (
  <DashboardCard style={styles.predictionCard}>
    <LinearGradient
      colors={['#6c5ce7', '#a29bfe']}
      style={styles.gradientCard}
    >
      <View style={styles.predictionHeader}>
        <Zap size={24} color="#fff" />
        <Text style={styles.predictionTitle}>AI Prediction</Text>
      </View>
      <Text style={styles.predictionText}>
        Your food budget will run out in 8 days based on current spending
      </Text>
      <Pressable style={styles.actionButton} onPress={onViewSuggestions}>
        <Text style={styles.actionButtonText}>View Suggestions</Text>
      </Pressable>
    </LinearGradient>
  </DashboardCard>
);

const SpendingChart = ({ data }) => (
  <DashboardCard style={styles.chartCard}>
    <Text style={styles.cardTitle}>Spending Breakdown</Text>
    <View style={styles.chartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.chartBar}>
          <View style={[styles.bar, { 
            height: Math.max(20, (item.spent / Math.max(...data.map(d => d.spent))) * 80), 
            backgroundColor: item.color 
          }]} />
          <Text style={styles.barLabel}>{item.category}</Text>
        </View>
      ))}
    </View>
  </DashboardCard>
);

const RecentTransactions = ({ transactions, onAddTransaction }) => (
  <DashboardCard style={styles.transactionsCard}>
    <View style={styles.transactionHeader}>
      <Text style={styles.cardTitle}>Recent Transactions</Text>
      <Pressable style={styles.addTransactionButton} onPress={onAddTransaction}>
        <Plus size={16} color="#ffffff" />
      </Pressable>
    </View>
    <View style={styles.transactionList}>
      {transactions.slice(0, 4).map((transaction, index) => (
        <View key={index} style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <View style={[styles.categoryDot, { backgroundColor: transaction.color }]} />
            <View>
              <Text style={styles.transactionName}>{transaction.name}</Text>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
            </View>
          </View>
          <Text style={[
            styles.transactionAmount,
            { color: transaction.amount > 0 ? '#00b894' : '#e17055' }
          ]}>
            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  </DashboardCard>
);

export default function Dashboard() {
  const { 
    transactions, 
    budgets, 
    userProfile, 
    getTotalIncome, 
    getTotalExpenses,
    addTransaction 
  } = useFinancialData();
  
  const [showAddTransaction, setShowAddTransaction] = React.useState(false);

  const handleViewSuggestions = () => {
    Alert.alert(
      'AI Suggestions',
      'Based on your spending patterns:\n\n• Reduce dining out by 20% to save $200/month\n• Switch to generic brands for groceries\n• Cancel unused Netflix subscription\n• Set up automatic savings transfers',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Evening</Text>
          <Text style={styles.userName}>{userProfile.name}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Balance"
            value={`$${userProfile.totalBalance.toLocaleString()}`}
            change="+$250 this week"
            isPositive={true}
            icon={DollarSign}
          />
          <MetricCard
            title="Expenses"
            value={`$${getTotalExpenses().toLocaleString()}`}
            change="+15% vs last month"
            isPositive={false}
            icon={CreditCard}
          />
          <MetricCard
            title="Savings"
            value={`$${userProfile.savingsGoal.toLocaleString()}`}
            change="+$500 this month"
            isPositive={true}
            icon={PiggyBank}
          />
          <MetricCard
            title="Goals"
            value="3 Active"
            change="2 on track"
            isPositive={true}
            icon={Target}
          />
        </View>

        <PredictionCard onViewSuggestions={handleViewSuggestions} />

        <SpendingChart data={budgets} />

        <RecentTransactions 
          transactions={transactions} 
          onAddTransaction={() => setShowAddTransaction(true)} 
        />
      </ScrollView>
      
      <AddTransactionModal
        visible={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={handleAddTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1421',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#74b9ff',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  metricCard: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    color: '#74b9ff',
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  predictionCard: {
    marginHorizontal: 20,
    padding: 0,
  },
  gradientCard: {
    padding: 20,
    borderRadius: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  predictionText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    marginHorizontal: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#74b9ff',
    textAlign: 'center',
  },
  transactionsCard: {
    marginHorizontal: 20,
  },
  transactionList: {
    gap: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#74b9ff',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTransactionButton: {
    backgroundColor: '#6c5ce7',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});