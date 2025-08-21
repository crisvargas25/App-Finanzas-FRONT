import { useEffect, useState } from 'react';
import { apiService } from '../../../shared/services/api';
import { Budget } from '../../../shared/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('user_id'); 
      if (!userId) throw new Error("No se encontró user_id en AsyncStorage");
      const data = await apiService.getBudgets(userId) as Budget[];
      setBudgets(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budget: Omit<Budget, "_id">) => {
    try {
      const userId = await AsyncStorage.getItem('user_id'); 
      if (!userId) throw new Error("No se encontró user_id en AsyncStorage");
      const data = { ...budget, userId };
      await apiService.createBudget(data);
      await loadBudgets();
    } catch (err) {
      console.error("Error creating budget:", err);
    }
  };

  const updateBudget = async (_id: string, patch: Partial<Budget>) => {
    try {
      await apiService.updateBudget(_id, patch);
      await loadBudgets();
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  const deleteBudget = async (_id: string) => {
    try {
      await apiService.deleteBudget(_id);
      await loadBudgets();
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  const getBudgetById = (_id: string): Budget | null =>
    budgets.find(b => b._id === _id) || null;

  useEffect(() => { loadBudgets(); }, []);

  return { budgets, loading, error, loadBudgets, addBudget, updateBudget, deleteBudget, getBudgetById };
}
