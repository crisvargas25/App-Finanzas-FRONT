// components/CategoryItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  createdAt: string;
}

interface CategoryItemProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onEdit, onDelete }) => {
  const typeColor = category.type === 'income' ? '#22c55e' : '#ef4444';
  const typeText = category.type.charAt(0).toUpperCase() + category.type.slice(1);

  const handleDelete = () => {
    Alert.alert(
      'Confirm delete',
      `Are you sure you want to delete the category "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={styles.name}>{category.name}</Text>
      <View style={[styles.typePill, { backgroundColor: `${typeColor}20` }]}>
        <Text style={[styles.typeText, { color: typeColor }]}>{typeText}</Text>
      </View>
      <TouchableOpacity onPress={onEdit}>
        <Ionicons name="create-outline" size={20} color="#3533cd" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3533cd',
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
});

export default CategoryItem;
