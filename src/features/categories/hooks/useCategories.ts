// shared/hooks/useCategories.ts
import { useState, useEffect } from "react";
import { apiService } from "../../../shared/services/api"
import { Category } from "../../../shared/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (newCategory: Omit<Category, "_id" | "creationDate">) => {
    await apiService.createCategory(newCategory);
    await loadCategories();
  };

  const editCategory = async (id: string, patch: Partial<Category>) => {
    await apiService.updateCategory(id, patch);
    await loadCategories();
  };

  const removeCategory = async (id: string) => {
    await apiService.deleteCategory(id);
    await loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading, error, addCategory, editCategory, removeCategory };
}
