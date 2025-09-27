import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Plus, TrendingUp, Calendar, Award, Trash2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useFinancialData } from '@/hooks/useFinancialData';
import { AddGoalModal } from '@/components/AddGoalModal';

const GoalCard = ({ goal, onDelete, onUpdate }) => (
  <View style={styles.goalCard}>
    <View style={styles.goalHeader}>
      <View style={[styles.categoryDot, { backgroundColor: goal.color }]} />
      <View style={styles.goalInfo}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.goalCategory}>{goal.category}</Text>
      </View>
      <View style={styles.daysContainer}>
        <Calendar size={16} color="#74b9ff" />
        <Text style={styles.daysText}>{goal.daysLeft} days</Text>
      </View>
      <Pressable style={styles.deleteButton} onPress={() => onDelete(goal.id)}>
        <Trash2 size={16} color="#e17055" />
      </Pressable>
    </View>
    
    <Pressable 
      style={styles.progressContainer}
      onPress={() => onUpdate(goal)}
    >
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${goal.progress}%`, backgroundColor: goal.color }]} />
      </View>
      <Text style={styles.progressText}>{goal.progress}%</Text>
    </Pressable>
    
    <View style={styles.amountContainer}>
      <Text style={styles.currentAmount}>${goal.current.toLocaleString()}</Text>
      <Text style={styles.targetAmount}>of ${goal.target.toLocaleString()}</Text>
    </View>
  </View>
);

const AchievementBadge = ({ title, description, isEarned }) => (
  <View style={[styles.badge, isEarned ? styles.earnedBadge : styles.lockedBadge]}>
    <Award size={24} color={isEarned ? "#00b894" : "#74b9ff"} />
    <Text style={[styles.badgeTitle, { color: isEarned ? "#ffffff" : "#74b9ff" }]}>
      {title}
    </Text>
    <Text style={[styles.badgeDescription, { color: isEarned ? "#ffffff" : "#74b9ff" }]}>
      {description}
    </Text>
  </View>
);

export default function Goals() {
  const { goals, achievements, addGoal, deleteGoal, updateGoal } = useFinancialData();
  const [showAddGoal, setShowAddGoal] = React.useState(false);

  const handleAddGoal = (goalData: any) => {
    addGoal(goalData);
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteGoal(goalId)
        }
      ]
    );
  };

  const handleUpdateGoal = (goal: any) => {
    Alert.prompt(
      'Update Goal Progress',
      `Current amount for ${goal.title}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (value) => {
            if (value && !isNaN(parseFloat(value))) {
              updateGoal(goal.id, { current: parseFloat(value) });
            }
          }
        }
      ],
      'plain-text',
      goal.current.toString()
    );
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Goals</Text>
          <Pressable style={styles.addButton} onPress={() => setShowAddGoal(true)}>
            <Plus size={20} color="#ffffff" />
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#6c5ce7', '#a29bfe']}
            style={styles.statsCard}
          >
            <View style={styles.statItem}>
              <Target size={24} color="#ffffff" />
              <Text style={styles.statValue}>{goals.length}</Text>
              <Text style={styles.statLabel}>Active Goals</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={24} color="#ffffff" />
              <Text style={styles.statValue}>${totalSaved.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Saved</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal}
              onDelete={handleDeleteGoal}
              onUpdate={handleUpdateGoal}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      
      <AddGoalModal
        visible={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        onAdd={handleAddGoal}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#6c5ce7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
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
  goalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalCategory: {
    fontSize: 14,
    color: '#74b9ff',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysText: {
    fontSize: 12,
    color: '#74b9ff',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#16213e',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 40,
    textAlign: 'right',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  targetAmount: {
    fontSize: 14,
    color: '#74b9ff',
  },
  achievementsScroll: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16213e',
  },
  earnedBadge: {
    backgroundColor: '#00b894',
    borderColor: '#00a085',
  },
  lockedBadge: {
    backgroundColor: '#1a1a2e',
    borderColor: '#16213e',
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
});