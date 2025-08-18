import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '../../shared/types'; 

interface GoalItemProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onAddContribution: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onEdit, onDelete, onAddContribution }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const percentage = progress.toFixed(1);
  const remaining = goal.targetAmount - goal.currentAmount;
  let statusText = '';
  let badgeBackground = '';
  let badgeTextColor = '';

  switch (goal.status) {
    case 'overdue':
      statusText = 'Overdue';
      badgeBackground = '#ffebee';
      badgeTextColor = '#f44336';
      break;
    case 'in_progress':
      statusText = 'In Progress';
      badgeBackground = '#e8eaf6';
      badgeTextColor = '#3533cd';
      break;
    case 'completed':
      statusText = 'Completed';
      badgeBackground = '#e8f5e9';
      badgeTextColor = '#4caf50';
      break;
  }

  const confirmDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{goal.name}</Text>
        <View style={styles.icons}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color="#3533cd" />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete}>
            <Ionicons name="trash-outline" size={20} color="#f44336" style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: badgeBackground }]}>
        <Text style={[styles.statusBadgeText, { color: badgeTextColor }]}>{statusText}</Text>
      </View>
      <View style={styles.progressRow}>
        <Text style={styles.progressTitle}>Progress</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressBarFilled, { width: `${progress}%` }]} />
        <View style={[styles.progressBarRemaining, { width: `${100 - progress}%` }]} />
      </View>
      <View style={styles.amountsRow}>
        <Text style={styles.currentAmount}>${goal.currentAmount.toLocaleString()}</Text>
        <Text style={styles.targetAmount}>${goal.targetAmount.toLocaleString()}</Text>
      </View>
      {goal.status === 'overdue' && goal.daysOverdue && (
        <View style={styles.overdueRow}>
          <Ionicons name="calendar-outline" size={16} color="#f44336" />
          <Text style={styles.overdueText}>Overdue by {goal.daysOverdue} days</Text>
        </View>
      )}
      <View style={styles.remainingRow}>
        <Ionicons name="arrow-forward-outline" size={16} color="#373643" />
        <Text style={styles.remainingText}>${remaining.toLocaleString()} remaining</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAddContribution}>
        <Ionicons name="add-circle-outline" size={20} color="#3533cd" style={styles.addIcon} />
        <Text style={styles.addText}>Add Contribution</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  icons: {
    flexDirection: 'row',
  },
  deleteIcon: {
    marginLeft: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressTitle: {
    fontSize: 14,
    color: '#373643',
  },
  percentage: {
    fontSize: 14,
    color: '#373643',
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFilled: {
    backgroundColor: '#4caf50',
  },
  progressBarRemaining: {
    backgroundColor: '#3533cd',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  currentAmount: {
    fontSize: 16,
    color: '#4caf50',
  },
  targetAmount: {
    fontSize: 16,
    color: '#373643',
  },
  overdueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  overdueText: {
    fontSize: 14,
    color: '#f44336',
    marginLeft: 5,
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  remainingText: {
    fontSize: 14,
    color: '#373643',
    marginLeft: 5,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#e8eaf6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    marginRight: 5,
  },
  addText: {
    fontSize: 16,
    color: '#3533cd',
    fontWeight: 'bold',
  },
});

export default GoalItem;
