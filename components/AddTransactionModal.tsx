import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (transaction: {
    name: string;
    category: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    color: string;
  }) => void;
}

const expenseCategories = [
  { name: 'Food & Drink', color: '#fd79a8' },
  { name: 'Transportation', color: '#fdcb6e' },
  { name: 'Shopping', color: '#00b894' },
  { name: 'Bills', color: '#6c5ce7' },
  { name: 'Entertainment', color: '#74b9ff' },
  { name: 'Health', color: '#e17055' }
];

const incomeCategories = [
  { name: 'Salary', color: '#00b894' },
  { name: 'Freelance', color: '#6c5ce7' },
  { name: 'Investment', color: '#74b9ff' },
  { name: 'Other', color: '#fdcb6e' }
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedCategory, setSelectedCategory] = useState(expenseCategories[0]);

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setSelectedCategory(newType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
  };

  const handleAdd = () => {
    if (name && amount) {
      onAdd({
        name,
        category: selectedCategory.name,
        amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        type,
        color: selectedCategory.color
      });
      
      // Reset form
      setName('');
      setAmount('');
      setType('expense');
      setSelectedCategory(expenseCategories[0]);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Transaction</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#74b9ff" />
            </Pressable>
          </View>

          <View style={styles.typeSelector}>
            <Pressable
              style={[styles.typeButton, type === 'expense' && styles.activeType]}
              onPress={() => handleTypeChange('expense')}
            >
              <Minus size={20} color={type === 'expense' ? '#ffffff' : '#74b9ff'} />
              <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>
                Expense
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, type === 'income' && styles.activeType]}
              onPress={() => handleTypeChange('income')}
            >
              <Plus size={20} color={type === 'income' ? '#ffffff' : '#74b9ff'} />
              <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>
                Income
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Coffee, Salary, Uber"
                placeholderTextColor="#74b9ff"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
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
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addText}>Add Transaction</Text>
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
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#0d1421',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeType: {
    backgroundColor: '#6c5ce7',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#74b9ff',
  },
  activeTypeText: {
    color: '#ffffff',
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