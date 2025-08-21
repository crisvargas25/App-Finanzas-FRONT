// src/features/transactions/screens/TransactionsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl, Alert, ScrollView } from 'react-native';
import { Text } from '../../../shared/ui/text';
import MainContainer from '../../../components/common/containers/mainContainer';
import TransactionCard from '../../../components/common/cards/TransactionCard';
import TransactionForm from '../TransactionsForm';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../../../shared/types';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/common/headings/header';
import SolidButton from '../../../components/common/buttons/solidButton';
import Card from '../../../shared/ui/card';

export default function TransactionsScreen() {
  const {
    transactions,
    categories,
    budgets,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreateTransaction = async (data: any) => {
    try {
      await createTransaction(data);
      setShowForm(false);
      Alert.alert('Éxito', 'Transaction created successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error creating transaction');
    }
  };

  const handleUpdateTransaction = async (data: any) => {
    if (!editingTransaction?._id && !editingTransaction?.id) return;
    try {
      const id = editingTransaction?._id || editingTransaction?.id!;
      await updateTransaction(id, data);
      setShowForm(false);
      setEditingTransaction(null);
      Alert.alert('Éxito', 'Transaction updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error updating transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      Alert.alert('Éxito', 'Transaction deleted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error deleting transaction');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const getTotalBalance = () => {
    return transactions.reduce((total, t) => {
      return t.type === 'ingreso' ? total + t.monto : total - t.monto;
    }, 0);
  };

  const getIncomeTotal = () => {
    return transactions.filter((t) => t.type === 'ingreso').reduce((total, t) => total + t.monto, 0);
  };

  const getExpenseTotal = () => {
    return transactions.filter((t) => t.type === 'gasto').reduce((total, t) => total + t.monto, 0);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (error) {
    return (
      <ScrollView>
        <MainContainer>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#d7515f" />
            <Text size="lg" type="blackText" style={styles.errorTitle}>
              Error loading transactions
            </Text>
            <Text size="sm" type="grayText" style={styles.errorMessage}>
              {error}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshTransactions}>
              <Text size="sm" type="whiteText">Retry</Text>
            </TouchableOpacity>
          </View>
        </MainContainer>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#3533cd']}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <MainContainer>
        <Header title="Transactions" />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setShowForm(true)}>
            <SolidButton text="Add Transaction" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <Card variant="elevated" color="#ffffff">
            <View style={styles.summaryCard}>
              <Text size="sm" type="grayText">Total Balance</Text>
              <Text
                size="xl"
                style={{
                  color: getTotalBalance() >= 0 ? '#4caf50' : '#f44336',
                }}
              >
                {formatAmount(getTotalBalance())}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text size="xs" type="grayText">Incomes</Text>
                <Text size="sm" type="navyBlueText">
                  {formatAmount(getIncomeTotal())}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text size="xs" type="grayText">Expenses</Text>
                <Text size="sm" type="navyBlueText">
                  {formatAmount(getExpenseTotal())}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#BABABA" />
            <Text size="lg" type="grayText" style={styles.emptyTitle}>
              You have no transactions yet
            </Text>
            <Text size="sm" type="grayText" style={styles.emptySubtitle}>
              Touch the + button to add your first transaction
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction._id || transaction.id}
                transaction={transaction}
                categories={categories}
                budgets={budgets}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            ))}
          </View>
        )}

        <TransactionForm
          visible={showForm}
          onClose={handleCloseForm}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          categories={categories}
          budgets={budgets}
          transaction={editingTransaction}
          loading={loading}
        />
      </MainContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: { marginBottom: 16 },
  summaryContainer: { marginBottom: 16 },
  summaryCard: { alignItems: 'center', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center' },
  transactionsList: { paddingBottom: 20 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { marginTop: 16, marginBottom: 8 },
  emptySubtitle: { textAlign: 'center', maxWidth: 250 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorTitle: { marginTop: 16, marginBottom: 8, textAlign: 'center' },
  errorMessage: { textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#3533cd', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
