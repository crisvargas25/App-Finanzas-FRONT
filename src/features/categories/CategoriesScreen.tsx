// screens/CategoriesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryItem from './CategoryItem';
import AddCategoryModal from './AddCategoryModal';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  createdAt: string;
}

// Mock backend functions - replace with actual API calls later
const fetchCategories = async (): Promise<Category[]> => {
  // Simulate API response
  return [
    { id: '1', name: 'Salary', type: 'income', color: '#22c55e', createdAt: '2024-01-14' },
    { id: '2', name: 'Food', type: 'expense', color: '#ef4444', createdAt: '2024-01-14' },
    { id: '3', name: 'Transportation', type: 'expense', color: '#3b82f6', createdAt: '2024-01-14' },
    { id: '4', name: 'Entertainment', type: 'expense', color: '#f59e0b', createdAt: '2024-01-14' },
    { id: '5', name: 'Utilities', type: 'expense', color: '#a855f7', createdAt: '2024-01-15' },
  ];
};

const addCategory = async (newCategory: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
  // Simulate adding to backend
  return { ...newCategory, id: Math.random().toString(), createdAt: new Date().toISOString().split('T')[0] };
};

const updateCategory = async (updatedCategory: Category): Promise<void> => {
  // Simulate update
  console.log('Updated category:', updatedCategory);
};

const deleteCategory = async (categoryId: string): Promise<void> => {
  // Simulate delete
  console.log('Deleted category:', categoryId);
};

const CategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const fetchedCategories = await fetchCategories();
    setCategories(fetchedCategories);
    applyFilter('all', fetchedCategories);
  };

  const applyFilter = (newFilter: 'all' | 'income' | 'expense', cats: Category[]) => {
    let filtered = cats;
    if (newFilter === 'income') {
      filtered = cats.filter(c => c.type === 'income');
    } else if (newFilter === 'expense') {
      filtered = cats.filter(c => c.type === 'expense');
    }
    setFilteredCategories(filtered);
    setFilter(newFilter);
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'id' | 'createdAt'>) => {
    const addedCategory = await addCategory(newCategory);
    const newCats = [...categories, addedCategory];
    setCategories(newCats);
    applyFilter(filter, newCats);
    setModalVisible(false);
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    await updateCategory(updatedCategory);
    const newCats = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
    setCategories(newCats);
    applyFilter(filter, newCats);
    setModalVisible(false);
    setEditMode(false);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
    const newCats = categories.filter(c => c.id !== categoryId);
    setCategories(newCats);
    applyFilter(filter, newCats);
  };

  const openEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>Manage your income and expense categories</Text>
      
      <TouchableOpacity style={styles.newButton} onPress={() => { setEditMode(false); setSelectedCategory(null); setModalVisible(true); }}>
        <Text style={styles.newButtonText}>+ New Category</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <Ionicons name="filter-outline" size={20} color="#373643" style={styles.filterIcon} />
        <Text style={styles.filterTitle}>Filters</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, filter === 'all' && styles.activeTab]} 
          onPress={() => applyFilter('all', categories)}
        >
          <Text style={[styles.tabText, filter === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, filter === 'income' && styles.activeTab]} 
          onPress={() => applyFilter('income', categories)}
        >
          <Text style={[styles.tabText, filter === 'income' && styles.activeTabText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, filter === 'expense' && styles.activeTab]} 
          onPress={() => applyFilter('expense', categories)}
        >
          <Text style={[styles.tabText, filter === 'expense' && styles.activeTabText]}>Expenses</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onEdit={() => openEditCategory(item)}
            onDelete={() => handleDeleteCategory(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <AddCategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={editMode ? handleEditCategory : handleAddCategory}
        initialData={editMode ? selectedCategory : undefined}
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
    color: '#3533cd',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#373643',
    marginBottom: 20,
  },
  newButton: {
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterIcon: {
    marginRight: 5,
  },
  filterTitle: {
    fontSize: 16,
    color: '#373643',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#22c55e',
  },
  tabText: {
    color: '#373643',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    paddingBottom: 20,
  },
});

export default CategoriesScreen;