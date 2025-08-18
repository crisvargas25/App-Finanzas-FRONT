// screens/SavingsGoalsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import GoalItem from './GoalItem';
import AddGoalModal from './AddGoalModal';
import AddContributionModal from './AddContributionModal';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '../../shared/types'; // Adjust path to your types file if different

// Mock backend functions - replace these with actual API calls later
const fetchGoals = async (): Promise<Omit<Goal, 'status' | 'daysOverdue'>[]> => {
  return [
    { id: '1', name: 'Europe Vacation', targetAmount: 50000, currentAmount: 12500, deadline: '2025-06-15' },
    { id: '2', name: 'New Laptop', targetAmount: 1000, currentAmount: 1000, deadline: '2025-12-01' },
    { id: '3', name: 'Emergency Savings', targetAmount: 5000, currentAmount: 2000, deadline: '2025-09-30' },
  ];
};

const addGoal = async (newGoal: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'daysOverdue'>): Promise<Omit<Goal, 'status' | 'daysOverdue'>> => {
  return { ...newGoal, id: Math.random().toString(), currentAmount: 0 };
};

const updateGoal = async (updatedGoal: Omit<Goal, 'status' | 'daysOverdue'>): Promise<void> => {
  console.log('Updated goal:', updatedGoal);
};

const deleteGoal = async (goalId: string): Promise<void> => {
  console.log('Deleted goal:', goalId);
};

const addContribution = async (goalId: string, amount: number): Promise<number> => {
  console.log('Added contribution to goal', goalId, ':', amount);
  return amount;
};

const computeGoalStatus = (goal: Omit<Goal, 'status' | 'daysOverdue'>, currentDate: Date): { status: Goal['status'], daysOverdue?: number } => {
  if (goal.currentAmount >= goal.targetAmount) {
    return { status: 'completed' };
  }
  const deadlineDate = new Date(goal.deadline);
  if (deadlineDate < currentDate) {
    const days = Math.floor((currentDate.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'overdue', daysOverdue: days };
  }
  return { status: 'in_progress' };
};

const SavingsGoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [contribModalVisible, setContribModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const fetchedGoals = await fetchGoals();
    const currentDate = new Date();
    const processedGoals = fetchedGoals.map(goal => ({
      ...goal,
      ...computeGoalStatus(goal, currentDate),
    }));
    setGoals(processedGoals);
  };

  const updateGoalsState = (newGoals: Omit<Goal, 'status' | 'daysOverdue'>[]) => {
    const currentDate = new Date();
    setGoals(newGoals.map(goal => ({
      ...goal,
      ...computeGoalStatus(goal, currentDate),
    })));
  };

  const handleAddGoal = async (newGoal: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'daysOverdue'>) => {
    const addedGoal = await addGoal(newGoal);
    const currentGoals = await fetchGoals();
    updateGoalsState([...currentGoals, addedGoal]);
    setModalVisible(false);
  };

  const handleEditGoal = async (updatedGoal: Omit<Goal, 'status' | 'daysOverdue'>) => {
    await updateGoal(updatedGoal);
    const newGoals = goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
    updateGoalsState(newGoals);
    setModalVisible(false);
    setEditMode(false);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
    const newGoals = goals.filter(g => g.id !== goalId);
    updateGoalsState(newGoals);
  };

  const handleAddContribution = async (amount: number) => {
    if (!selectedGoal) return;
    const added = await addContribution(selectedGoal.id, amount);
    const updatedGoal = { ...selectedGoal, currentAmount: selectedGoal.currentAmount + added };
    const newGoals = goals.map(g => g.id === selectedGoal.id ? updatedGoal : g);
    updateGoalsState(newGoals);
    setContribModalVisible(false);
  };

  const openAddContribution = (goal: Goal) => {
    setSelectedGoal(goal);
    setContribModalVisible(true);
  };

  const openEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditMode(true);
    setModalVisible(true);
  };

  const sections = [
    { title: 'Overdue', data: goals.filter(g => g.status === 'overdue') },
    { title: 'In Progress', data: goals.filter(g => g.status === 'in_progress') },
    { title: 'Completed', data: goals.filter(g => g.status === 'completed') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings Goals</Text>
      <Text style={styles.subtitle}>Define and achieve your financial objectives</Text>
      
      <TouchableOpacity style={styles.newGoalButton} onPress={() => { setEditMode(false); setSelectedGoal(null); setModalVisible(true); }}>
        <Text style={styles.newGoalText}>New Goal</Text>
        <Ionicons name="add" size={20} color="#fff" style={styles.icon} />
      </TouchableOpacity>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GoalItem
            goal={item}
            onEdit={() => openEditGoal(item)}
            onDelete={() => handleDeleteGoal(item.id)}
            onAddContribution={() => openAddContribution(item)}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
            {data.length === 0 && <Text style={styles.emptySection}>No goals here</Text>}
          </View>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />

      <AddGoalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={editMode ? handleEditGoal : handleAddGoal}
        initialData={editMode ? selectedGoal : undefined}
      />

      <AddContributionModal
        visible={contribModalVisible}
        onClose={() => setContribModalVisible(false)}
        onSave={handleAddContribution}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3533cd', // Cambiado de #3533cd a negro
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#373643',
    marginBottom: 20,
  },
  newGoalButton: {
    flexDirection: 'row',
    backgroundColor: '#22c55e', // Cambiado a verde como en CategoriesScreen
    padding: 10,
    borderRadius: 20, // Ajustado para mayor redondeo como en CategoriesScreen
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  newGoalText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    marginLeft: 5,
  },
  sectionHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3533cd', // Cambiado de #3533cd a negro
  },
  emptySection: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default SavingsGoalsScreen;