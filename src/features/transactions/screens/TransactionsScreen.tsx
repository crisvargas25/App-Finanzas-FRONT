import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, ScrollView } from 'react-native';
import { Text } from '../../../shared/ui/text';
import MainContainer from '../../../components/common/containers/mainContainer';
import TransactionCard from '../../../components/common/cards/TransactionCard';
import TransactionForm from '../TransactionForm';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../../../shared/types';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/common/headings/header';
import Header2 from '../../../components/common/headings/header2';
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
    } catch (error) {
      Alert.alert('Error', 'Error creating transaction');
    }
  };

  const handleUpdateTransaction = async (data: any) => {
    if (!editingTransaction?.id) return;
    
    try {
      await updateTransaction(editingTransaction.id, data);
      setShowForm(false);
      setEditingTransaction(null);
      Alert.alert('Éxito', 'Transaction updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Error updating transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(id);
      Alert.alert('Éxito', 'Transaction deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Error deleting transaction');
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
    return transactions.reduce((total, transaction) => {
      return transaction.tipo === 'income' 
        ? total + transaction.monto 
        : total - transaction.monto;
    }, 0);
  };

  const getIncomeTotal = () => {
    return transactions
      .filter(t => t.tipo === 'income')
      .reduce((total, t) => total + t.monto, 0);
  };

  const getExpenseTotal = () => {
    return transactions
      .filter(t => t.tipo === 'outcome')
      .reduce((total, t) => total + t.monto, 0);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
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
        {/* Header con resumen */}
        <Header title="Transactions" />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setShowForm(true)}>
            <SolidButton text="Add Transaction" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <Card variant='elevated' color="#ffffff">
            <View style={styles.summaryCard}>
              <Text size="sm" type="grayText">Total Balance</Text>
              <Text
                size="xl" 
                style={{
                  color: getTotalBalance() >= 0 ? '#9fdab5ff' : '#d9606cff',
                }}
              >
                {formatAmount(getTotalBalance())}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text size="xs" type="grayText">Incomes</Text>
                <Text size="sm" type="greenText">
                  {formatAmount(getIncomeTotal())}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text size="xs" type="grayText">Expenses</Text>
                <Text size="sm" type="redText">
                  {formatAmount(getExpenseTotal())}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Lista de transacciones */}
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
                key={transaction.id?.toString() || Math.random().toString()}
                transaction={transaction}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            ))}
          </View>
        )}

        {/* Modal de formulario */}
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
  container: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonContainer: {
    bottom: 16,
  },
  summaryContainer: {
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceAmount: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  transactionsList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    maxWidth: 250,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3533cd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
