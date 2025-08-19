import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../../../shared/ui/card';
import { Text } from '../../../shared/ui/text';
import { Transaction } from '../../../shared/types';
import { Ionicons } from '@expo/vector-icons';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => transaction.id && onDelete(transaction.id),
        },
      ]
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card variant="elevated" color='#ffffff'>
        <View style={styles.header}>
          <View style={styles.typeIndicator}>
            <Ionicons
              name={transaction.tipo === 'income' ? 'arrow-up' : 'arrow-down'}
              size={20}
              color={transaction.tipo === 'income' ? '#4ecd7f' : '#d7515f'}
            />
            <Text
              size="xs"
              type={transaction.tipo === 'income' ? 'blackText' : 'blackText'}
              style={{
                color: transaction.tipo === 'income' ? '#4ecd7f' : '#d7515f',
                fontWeight: '600',
              }}
            >
              {transaction.tipo === 'income' ? 'Income' : 'Outcome'}
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onEdit(transaction)}
              style={styles.actionButton}
            >
              <Ionicons name="pencil" size={18} color="#3533cd" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <Ionicons name="trash" size={18} color="#d7515f" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text size="lg" type="blackText" style={styles.amount}>
            {formatAmount(transaction.monto)}
          </Text>
        </View>

        <View style={styles.details}>
          {transaction.categoria && (
            <View style={styles.detailItem}>
              <Ionicons name="pricetag" size={14} color="#BABABA" />
              <Text size="xs" type="grayText" style={styles.detailText}>
                {transaction.categoria.name}
              </Text>
            </View>
          )}

          {transaction.presupuesto && (
            <View style={styles.detailItem}>
              <Ionicons name="wallet" size={14} color="#BABABA" />
              <Text size="xs" type="grayText" style={styles.detailText}>
                {transaction.presupuesto.name}
              </Text>
            </View>
          )}

          {transaction.fecha && (
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color="#BABABA" />
              <Text size="xs" type="grayText" style={styles.detailText}>
                {formatDate(transaction.fecha)}
              </Text>
            </View>
          )}
        </View>

        {transaction.nota && (
          <View style={styles.noteContainer}>
            <Text size="xs" type="grayText" style={styles.note}>
              {transaction.nota}
            </Text>
          </View>
        )}
      
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
  },
  amountContainer: {
    marginBottom: 12,
  },
  amount: {
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  noteContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
  },
  note: {
    
  },
});

export default TransactionCard;