import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoalItem from './GoalItem';
import AddGoalModal from './AddGoalModal';
import AddContributionModal from './AddContributionModal';

import { apiService } from '../../shared/services/api';

=export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  status: 'in_progress' | 'completed' | 'overdue';
  daysOverdue?: number;
};

function computeGoalStatus(
  goal: Omit<Goal, 'status' | 'daysOverdue'>,
  currentDate: Date
): { status: Goal['status']; daysOverdue?: number } {
  if (goal.currentAmount >= goal.targetAmount) return { status: 'completed' };
  const deadlineDate = new Date(goal.deadline);
  if (deadlineDate < currentDate) {
    const days = Math.floor((currentDate.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'overdue', daysOverdue: days };
  }
  return { status: 'in_progress' };
}

function mapDocToUI(doc: any): Omit<Goal, 'status' | 'daysOverdue'> {
  const iso = doc.fechaMeta || '';
  const yyyyMMdd = iso.length >= 10 ? iso.slice(0, 10) : iso; 
  return {
    id: doc._id,
    name: doc.nombreMeta,
    targetAmount: Number(doc.montoObjetivo || 0),
    currentAmount: Number(doc.montoActual || 0),
    deadline: yyyyMMdd,
  };
}

type CreatePayload = Omit<Goal, 'id' | 'status' | 'daysOverdue' | 'currentAmount'> & { currentAmount?: number };
type UpdatePayload = Omit<Goal, 'status' | 'daysOverdue'>;
function isUpdatePayload(p: CreatePayload | UpdatePayload): p is UpdatePayload {
  return (p as any).id != null;
}

const SavingsGoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [contribModalVisible, setContribModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editMode, setEditMode] = useState(false);

  const loadFromCloud = useCallback(async () => {
    try {
      const userServerId = await AsyncStorage.getItem('user_id');
      if (!userServerId) return;

      const docs = await apiService.listGoalsFromCloud(userServerId); // array del back
      const now = new Date();
      const list = docs.map((d) => {
        const base = mapDocToUI(d);
        return { ...base, ...computeGoalStatus(base, now) };
      });
      setGoals(list);
    } catch (e: any) {
      console.log('loadFromCloud error:', e?.message || e);
      Alert.alert('Error', 'No fue posible cargar tus metas.');
    }
  }, []);

  useEffect(() => { loadFromCloud(); }, [loadFromCloud]);

  // Crear 
  const handleAddGoal = async (payload: CreatePayload) => {
    try {
      const userServerId = await AsyncStorage.getItem('user_id');
      if (!userServerId) return;

      const curr = payload.currentAmount ?? 0;
      await apiService.createGoalInCloud({
        userId: userServerId,
        name: payload.name,
        targetAmount: payload.targetAmount,
        currentAmount: curr,
        deadline: payload.deadline,
        status: 'en_progreso',
      });
      setModalVisible(false);
      await loadFromCloud();
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo crear la meta.');
      console.log('createGoal error:', e?.message || e);
    }
  };

  // Editar 
  const handleEditGoal = async (updated: UpdatePayload) => {
    try {
      await apiService.updateGoalInCloud(updated.id, {
        name: updated.name,
        targetAmount: updated.targetAmount,
        currentAmount: updated.currentAmount,
        deadline: updated.deadline,
      });
      setModalVisible(false);
      setEditMode(false);
      await loadFromCloud();
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo actualizar la meta.');
      console.log('updateGoal error:', e?.message || e);
    }
  };

  // Eliminar 
  const handleDeleteGoal = async (goalId: string) => {
    try {
      await apiService.deleteGoalInCloud(goalId);
      await loadFromCloud();
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo eliminar la meta.');
      console.log('deleteGoal error:', e?.message || e);
    }
  };

  // Aportación 
  const handleAddContribution = async (amount: number) => {
    if (!selectedGoal) return;
    try {
      const newAmount = selectedGoal.currentAmount + amount;
      await apiService.updateGoalInCloud(selectedGoal.id, { currentAmount: newAmount });
      setContribModalVisible(false);
      await loadFromCloud();
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo registrar la aportación.');
      console.log('addContribution error:', e?.message || e);
    }
  };

  const handleSaveFromModal = (payload: CreatePayload | UpdatePayload): void => {
    if (isUpdatePayload(payload)) {
      void handleEditGoal(payload);
    } else {
      void handleAddGoal(payload);
    }
  };

  const openAddContribution = (goal: Goal) => { setSelectedGoal(goal); setContribModalVisible(true); };
  const openEditGoal = (goal: Goal) => { setSelectedGoal(goal); setEditMode(true); setModalVisible(true); };

  const sections = [
    { title: 'Overdue',    data: goals.filter(g => g.status === 'overdue') },
    { title: 'In Progress', data: goals.filter(g => g.status === 'in_progress') },
    { title: 'Completed',   data: goals.filter(g => g.status === 'completed') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings Goals</Text>
      <Text style={styles.subtitle}>Define and achieve your financial objectives</Text>

      <TouchableOpacity
        style={styles.newGoalButton}
        onPress={() => { setEditMode(false); setSelectedGoal(null); setModalVisible(true); }}
      >
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
        onSave={handleSaveFromModal}
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
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3533cd', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#373643', marginBottom: 20 },
  newGoalButton: {
    flexDirection: 'row', backgroundColor: '#22c55e', padding: 10, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  newGoalText: { color: '#fff', fontWeight: 'bold', marginRight: 10 },
  icon: { marginLeft: 5 },
  sectionHeaderContainer: { paddingVertical: 8, paddingHorizontal: 5, backgroundColor: '#f0f0f0', borderRadius: 6, marginTop: 10 },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#3533cd' },
  emptySection: { fontSize: 14, color: '#999', marginTop: 4 },
});

export default SavingsGoalsScreen;
