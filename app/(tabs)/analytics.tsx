import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  AlertCircle,
  Zap 
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useFinancialData } from '@/hooks/useFinancialData';

const PredictionCard = ({ prediction, onPress }) => (
  <View style={styles.predictionCard}>
    <LinearGradient
      colors={prediction.color}
      style={styles.gradientCard}
    >
      <Pressable onPress={() => onPress(prediction)}>
      <View style={styles.cardHeader}>
        <Zap size={20} color="#ffffff" />
        <Text style={styles.cardTitle}>{prediction.title}</Text>
      </View>
      <Text style={styles.predictionValue}>{prediction.prediction}</Text>
      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceText}>Confidence: {prediction.confidence}%</Text>
        <View style={styles.trendContainer}>
          <TrendingUp size={16} color="#ffffff" />
          <Text style={styles.trendText}>{prediction.trend}</Text>
        </View>
      </View>
      </Pressable>
    </LinearGradient>
  </View>
);

const SpendingTrendChart = ({ data }) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Spending Trends (Last 6 Months)</Text>
    <View style={styles.trendChart}>
      {data.map((item, index) => (
        <View key={index} style={styles.trendBar}>
          <View style={[styles.bar, { 
            height: Math.max(20, (item.spending / Math.max(...data.map(d => d.spending))) * 100), 
            backgroundColor: index === data.length - 1 ? '#e17055' : '#74b9ff' 
          }]} />
          <Text style={styles.monthLabel}>
            {item.month}
          </Text>
        </View>
      ))}
    </View>
    <Text style={styles.trendInsight}>
      Spending increased 15% this month compared to average
    </Text>
  </View>
);

const CategoryBreakdown = ({ categories }) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Category Breakdown</Text>
    <View style={styles.categoryList}>
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryItem}>
          <View style={styles.categoryInfo}>
            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryAmount}>${category.spent.toLocaleString()}</Text>
            <Text style={styles.categoryPercentage}>
              {Math.round((category.spent / categories.reduce((sum, c) => sum + c.spent, 0)) * 100)}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const InsightCard = ({ insight, onPress }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'warning': return <AlertCircle size={20} color="#e17055" />;
      case 'success': return <TrendingUp size={20} color="#00b894" />;
      default: return <DollarSign size={20} color="#74b9ff" />;
    }
  };

  return (
    <Pressable 
      style={[styles.insightCard, insight.type === 'warning' && styles.warningCard]}
      onPress={() => onPress(insight)}
    >
      <View style={styles.insightHeader}>
        {getIcon()}
        <Text style={styles.insightTitle}>{insight.title}</Text>
      </View>
      <Text style={styles.insightDescription}>{insight.description}</Text>
    </Pressable>
  );
};

export default function Analytics() {
  const { predictions, budgets, getMonthlyTrend } = useFinancialData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const monthlyTrend = getMonthlyTrend();

  const insights = [
    {
      title: "Subscription Alert",
      description: "You have 3 unused subscriptions costing $45/month",
      type: "warning"
    },
    {
      title: "Great Progress!",
      description: "You're 15% ahead of your savings goal this month",
      type: "success"
    },
    {
      title: "Spending Pattern",
      description: "Your dining expenses peak on weekends - consider meal prep",
      type: "info"
    }
  ];

  const handlePredictionPress = (prediction: any) => {
    let message = '';
    switch (prediction.type) {
      case 'spending':
        message = 'Based on your current spending patterns, you\'re likely to spend $2,450 next month. This is 8% higher than this month due to increased dining and entertainment expenses.';
        break;
      case 'budget':
        message = 'Your food budget will be depleted in 12 days if you continue at the current spending rate. Consider meal planning or reducing dining out to extend your budget.';
        break;
      case 'savings':
        message = 'You\'re on track to reach your emergency fund goal by March 15th. Keep up the great work with your consistent savings!';
        break;
      default:
        message = 'AI prediction details and recommendations.';
    }
    
    Alert.alert(prediction.title, message, [{ text: 'Got it', style: 'default' }]);
  };

  const handleInsightPress = (insight: any) => {
    Alert.alert(insight.title, insight.description, [{ text: 'Got it', style: 'default' }]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.periodSelector}>
            {['week', 'month', 'year'].map((period) => (
              <Pressable 
                key={period}
                style={[styles.periodButton, selectedPeriod === period && styles.activePeriod]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText, 
                  selectedPeriod === period && styles.activePeriodText
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Predictions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {predictions.map((prediction) => (
              <PredictionCard 
                key={prediction.id} 
                prediction={prediction}
                onPress={handlePredictionPress}
              />
            ))}
          </ScrollView>
        </View>

        <SpendingTrendChart data={monthlyTrend} />

        <CategoryBreakdown categories={budgets} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Insights</Text>
          {insights.map((insight, index) => (
            <InsightCard 
              key={index} 
              insight={insight}
              onPress={handleInsightPress}
            />
          ))}
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriod: {
    backgroundColor: '#6c5ce7',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#74b9ff',
  },
  activePeriodText: {
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  predictionCard: {
    marginRight: 16,
    borderRadius: 16,
    width: 200,
  },
  gradientCard: {
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 4,
    opacity: 0.8,
  },
  chartCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 12,
  },
  trendBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 12,
    color: '#74b9ff',
  },
  trendInsight: {
    fontSize: 14,
    color: '#74b9ff',
    fontStyle: 'italic',
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  categoryDetails: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#74b9ff',
  },
  insightCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  warningCard: {
    borderColor: '#e17055',
    borderWidth: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#74b9ff',
    lineHeight: 18,
  },
});