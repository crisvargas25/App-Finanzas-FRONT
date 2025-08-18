import { useState, useEffect } from 'react';
import { Budget } from '../../../shared/types';

export interface BudgetFormData {
  nombre: string;
  monto_total: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'active' | 'closed' | 'canceled';
}

// Datos mock temporales hasta que el backend esté listo
const initialBudgets: Budget[] = [
  {
    id: 1,
    nombre: 'Presupuesto Enero 2025',
    monto_total: 3000,
    fecha_inicio: '2025-01-01',
    fecha_fin: '2025-01-31',
    estado: 'active',
  },
  {
    id: 2,
    nombre: 'Vacaciones Verano',
    monto_total: 5000,
    fecha_inicio: '2025-06-01',
    fecha_fin: '2025-07-31',
    estado: 'active',
  },
  {
    id: 3,
    nombre: 'Emergencias Diciembre',
    monto_total: 1000,
    fecha_inicio: '2024-12-01',
    fecha_fin: '2024-12-31',
    estado: 'closed',
  },
];

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carga inicial
  const loadBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // En el futuro, aquí se hará la llamada real a la API
      // const response = await apiService.get('/budgets');
      // setBudgets(response.data);
    } catch (err) {
      setError('Error al cargar los presupuestos');
      console.error('Error loading budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    loadBudgets();
  }, []);

  const createBudget = async (budgetData: BudgetFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Crear nuevo presupuesto con ID único
      const newId = Math.max(...budgets.map(b => b.id)) + 1;
      
      const newBudget: Budget = {
        id: newId,
        ...budgetData,
      };
      
      setBudgets(prevBudgets => [...prevBudgets, newBudget]);
      
      // En el futuro, aquí se hará la llamada real a la API
      // const response = await apiService.post('/budgets', budgetData);
      // setBudgets(prevBudgets => [...prevBudgets, response.data]);
      
      return newBudget;
    } catch (err) {
      setError('Error al crear el presupuesto');
      console.error('Error creating budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (id: number, budgetData: BudgetFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBudget: Budget = {
        id,
        ...budgetData,
      };
      
      setBudgets(prevBudgets => 
        prevBudgets.map(budget => 
          budget.id === id ? updatedBudget : budget
        )
      );
      
      // En el futuro, aquí se hará la llamada real a la API
      // const response = await apiService.put(`/budgets/${id}`, budgetData);
      // setBudgets(prevBudgets => 
      //   prevBudgets.map(budget => 
      //     budget.id === id ? response.data : budget
      //   )
      // );
      
      return updatedBudget;
    } catch (err) {
      setError('Error al actualizar el presupuesto');
      console.error('Error updating budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBudgets(prevBudgets => 
        prevBudgets.filter(budget => budget.id !== id)
      );
      
      // En el futuro, aquí se hará la llamada real a la API
      // await apiService.delete(`/budgets/${id}`);
      
    } catch (err) {
      setError('Error al eliminar el presupuesto');
      console.error('Error deleting budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBudgetById = (id: number): Budget | undefined => {
    return budgets.find(budget => budget.id === id);
  };

  const getActiveBudgets = (): Budget[] => {
    return budgets.filter(budget => budget.estado === 'active');
  };

  const getBudgetsByDateRange = (startDate: string, endDate: string): Budget[] => {
    return budgets.filter(budget => 
      budget.fecha_inicio >= startDate && budget.fecha_fin <= endDate
    );
  };

  const refreshBudgets = () => {
    loadBudgets();
  };

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    getActiveBudgets,
    getBudgetsByDateRange,
    refreshBudgets,
  };
};
