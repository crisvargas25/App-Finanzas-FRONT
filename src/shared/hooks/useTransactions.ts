import { useState, useEffect } from 'react';
import { Transaction, Category, Budget } from '../types';

// Datos mock temporales hasta que el backend esté listo
const mockCategories: Category[] = [
  { id: 1, name: 'Comida' },
  { id: 2, name: 'Transporte' },
  { id: 3, name: 'Alojamiento' },
  { id: 4, name: 'Entretenimiento' },
  { id: 5, name: 'Salario' },
  { id: 6, name: 'Otros' },
];

const mockBudgets: Budget[] = [
  { 
    id: 1, 
    nombre: 'Presupuesto Mensual',
    monto_total: 3000,
    fecha_inicio: '2025-08-01',
    fecha_fin: '2025-08-31',
    estado: 'active'
  },
  { 
    id: 2, 
    nombre: 'Vacaciones',
    monto_total: 5000,
    fecha_inicio: '2025-06-01',
    fecha_fin: '2025-07-31',
    estado: 'active'
  },
  { 
    id: 3, 
    nombre: 'Emergencias',
    monto_total: 1000,
    fecha_inicio: '2025-01-01',
    fecha_fin: '2025-12-31',
    estado: 'active'
  },
];

// Transacciones de ejemplo hardcodeadas
const initialTransactions: Transaction[] = [
  {
    id: 1,
    tipo: 'income',
    monto: 2500,
    categoria_id: 5,
    fecha: '2025-08-18T10:30:00Z',
    nota: 'Salario mensual',
    categoria: { id: 5, name: 'Salario' },
    presupuesto: { 
      id: 1, 
      nombre: 'Presupuesto Mensual',
      monto_total: 3000,
      fecha_inicio: '2025-08-01',
      fecha_fin: '2025-08-31',
      estado: 'active'
    },
    presupuesto_id: 1,
  },
  {
    id: 2,
    tipo: 'outcome',
    monto: 45.50,
    categoria_id: 1,
    fecha: '2025-08-18T14:15:00Z',
    nota: 'Almuerzo en restaurante',
    categoria: { id: 1, name: 'Comida' },
  },
  {
    id: 3,
    tipo: 'outcome',
    monto: 15.20,
    categoria_id: 2,
    fecha: '2025-08-17T08:45:00Z',
    nota: 'Metro al trabajo',
    categoria: { id: 2, name: 'Transporte' },
    presupuesto: { 
      id: 1, 
      nombre: 'Presupuesto Mensual',
      monto_total: 3000,
      fecha_inicio: '2025-08-01',
      fecha_fin: '2025-08-31',
      estado: 'active'
    },
    presupuesto_id: 1,
  },
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carga inicial
  const loadInitialData = async () => {
    setLoading(true);
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    setError(null);
  };

  // Cargar datos al inicio
  useEffect(() => {
    loadInitialData();
  }, []);

  const createTransaction = async (transactionData: {
    tipo: 'income' | 'outcome';
    monto: number;
    categoria_id: number;
    presupuesto_id?: number;
    nota?: string;
  }) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Crear nueva transacción con ID único
      const newId = Math.max(...transactions.map(t => t.id || 0)) + 1;
      
      const categoria = categories.find(c => c.id === transactionData.categoria_id);
      const presupuesto = transactionData.presupuesto_id 
        ? budgets.find(b => b.id === transactionData.presupuesto_id)
        : undefined;
      
      const newTransaction: Transaction = {
        id: newId,
        ...transactionData,
        fecha: new Date().toISOString(),
        categoria,
        presupuesto,
      };
      
      // Agregar al inicio de la lista
      setTransactions(prev => [newTransaction, ...prev]);
      setError(null);
      
      console.log('✅ Transacción creada:', newTransaction);
      return newTransaction;
    } catch (err) {
      setError('Error al crear transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: number, transactionData: {
    tipo?: 'income' | 'outcome';
    monto?: number;
    categoria_id?: number;
    presupuesto_id?: number;
    nota?: string;
  }) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      setTransactions(prev => 
        prev.map(t => {
          if (t.id === id) {
            const categoria = transactionData.categoria_id 
              ? categories.find(c => c.id === transactionData.categoria_id) || t.categoria
              : t.categoria;
              
            const presupuesto = transactionData.presupuesto_id !== undefined
              ? budgets.find(b => b.id === transactionData.presupuesto_id)
              : t.presupuesto;
            
            const updatedTransaction = {
              ...t,
              ...transactionData,
              categoria,
              presupuesto,
            };
            
            console.log('✅ Transacción actualizada:', updatedTransaction);
            return updatedTransaction;
          }
          return t;
        })
      );
      
      setError(null);
    } catch (err) {
      setError('Error al actualizar transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      setTransactions(prev => {
        const filtered = prev.filter(t => t.id !== id);
        console.log('✅ Transacción eliminada, ID:', id);
        return filtered;
      });
      setError(null);
    } catch (err) {
      setError('Error al eliminar transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    console.log('🔄 Refrescando transacciones...');
    await loadInitialData();
  };

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
