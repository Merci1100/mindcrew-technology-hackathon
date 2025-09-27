import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native';
import { X, Target } from 'lucide-react-native';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (goal: {
    title: string;
    target: number;
    current: number;
    category: string;
    daysLeft: number;
    color: string;
  }) => void;
}

const categories = [
  { name: 'Safety Net', color: '#00b894' },
  { name: 'Purchase', color: '#6c5ce7' },
  { name: 'Lifestyle', color: '#fd79a8' },
  { name: 'Investment', color: '#74b9ff' },
  { name: 'Education', color: '#fdcb6e' }
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [timeframe, setTimeframe] = useState('');

  const handleAdd = () => {
    if (title && target && timeframe) {
      onAdd({
        title,
        target: parseFloat(target),
        current: parseFloat(current) || 0,
        category: selectedCategory.name,
        daysLeft: parseInt(timeframe) * 30, // Convert months to days
        color: selectedCategory.color
      });
      
      // Reset form
      setTitle('');
      setTarget('');
      setCurrent('');
      setTimeframe('');
      setSelectedCategory(categories[0]);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Goal</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#74b9ff" />
            </Pressable>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Goal Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Emergency Fund"
                placeholderTextColor="#74b9ff"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={target}
                onChangeText={setTarget}
                placeholder="10000"
                placeholderTextColor="#74b9ff"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={current}
                onChangeText={setCurrent}
                placeholder="0"
                placeholderTextColor="#74b9ff"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Timeframe (months)</Text>
              <TextInput
                style={styles.input}
                value={timeframe}
                onChangeText={setTimeframe}
                placeholder="12"
                placeholderTextColor="#74b9ff"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <Pressable
                    key={category.name}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: category.color },
                      selectedCategory.name === category.name && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={handleAdd}>
              <Target size={20} color="#ffffff" />
              <Text style={styles.addText}>Add Goal</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0d1421',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#16213e',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.7,
  },
  selectedCategory: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#74b9ff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});