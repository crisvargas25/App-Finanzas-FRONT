// src/features/transactions/hooks/useTransactions.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { apiService } from "../../../shared/services/api";
import { Transaction, Category, Budget } from "../../../shared/types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const data = await apiService.getTransactions();
      setTransactions(data || []);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) throw new Error("No se encontró userId en AsyncStorage");

      const data = await apiService.getBudgets(userId);
      setBudgets(data || []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const createTransaction = async (transaction: Partial<Transaction>) => {
    setLoading(true);
    try {
      const newTransaction = await apiService.createTransaction(transaction);
      setTransactions((prev) => [...prev, newTransaction]);
    } catch (err) {
      console.error("Error creating transaction:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    setLoading(true);
    try {
      const updated = await apiService.updateTransaction(id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id || t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Error updating transaction:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await apiService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      throw err;
    }
  };

  const refreshTransactions = async () => {
    setLoading(true);
    await fetchTransactions();
    await fetchCategories();
    await fetchBudgets();
    setLoading(false);
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  return {
    transactions,
    categories,
    budgets,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  };
};
