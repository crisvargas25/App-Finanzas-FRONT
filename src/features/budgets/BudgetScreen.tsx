import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text } from '../../shared/ui/text';
import { Budget } from '../../shared/types';
import { useBudgets } from './hooks/useBudgets';
import BudgetCard from './components/BudgetCard';
import BudgetForm, { BudgetFormData } from './components/BudgetForm';
import { Ionicons } from '@expo/vector-icons';
import MainContainer from '../../components/common/containers/mainContainer';

export default function BudgetScreen() {
  const {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets,
  } = useBudgets();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      await createBudget(data);
      setIsFormVisible(false);
      Alert.alert('Éxito', 'Presupuesto creado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el presupuesto');
    }
  };

  const handleUpdateBudget = async (data: BudgetFormData) => {
    if (!selectedBudget) return;
    
    try {
      await updateBudget(selectedBudget.id, data);
      setIsFormVisible(false);
      setSelectedBudget(null);
      Alert.alert('Éxito', 'Presupuesto actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el presupuesto');
    }
  };

  const handleDeleteBudget = async (budgetId: number) => {
    try {
      await deleteBudget(budgetId);
      Alert.alert('Éxito', 'Presupuesto eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el presupuesto');
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormVisible(true);
  };

  const handleAddBudget = () => {
    setSelectedBudget(null);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedBudget(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBudgets();
    setRefreshing(false);
  };

  const renderBudgetCard = ({ item }: { item: Budget }) => (
    <BudgetCard
      budget={item}
      onEdit={handleEditBudget}
      onDelete={handleDeleteBudget}
    />
  );

  const renderEmptyState = () => (
    <MainContainer>
      <Ionicons name="wallet-outline" size={64} color="#ccc" />
      <Text size="lg" type="grayText" style={styles.emptyTitle}>
        No hay presupuestos
      </Text>
      <Text size="sm" type="grayText" style={styles.emptySubtitle}>
        Crea tu primer presupuesto para comenzar a gestionar tus finanzas
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddBudget}>
        <Text size="sm" type="whiteText">Crear Presupuesto</Text>
      </TouchableOpacity>
    </MainContainer>
  );

  if (error) {
    return (
      <MainContainer>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text size="lg" type="blackText" style={styles.errorTitle}>
          Error al cargar presupuestos
        </Text>
        <Text size="sm" type="grayText" style={styles.errorSubtitle}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshBudgets}>
          <Text size="sm" type="whiteText">Reintentar</Text>
        </TouchableOpacity>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <View>
        <Text size="xl" type="blackText">
          Budgets
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBudget}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={budgets}
        renderItem={renderBudgetCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          budgets.length === 0 && styles.listContainerEmpty
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <BudgetForm
        visible={isFormVisible}
        onClose={handleCloseForm}
        onSubmit={selectedBudget ? handleUpdateBudget : handleCreateBudget}
        budget={selectedBudget}
        loading={loading}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#3533cd',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  listContainerEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3533cd',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});