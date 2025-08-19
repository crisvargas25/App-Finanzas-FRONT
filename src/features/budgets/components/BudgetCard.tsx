import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../../../shared/ui/text';
import { Budget } from '../../../shared/types';
import { Ionicons } from '@expo/vector-icons';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: number) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'closed':
        return '#9E9E9E';
      case 'canceled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'closed':
        return 'Cerrado';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Presupuesto',
      `¿Estás seguro de que quieres eliminar "${budget.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(budget.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text size="md" type="blackText" style={styles.title}>
            {budget.nombre}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(budget.estado) }]}>
            <Text size="xs" type="whiteText">
              {getStatusText(budget.estado)}
            </Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => onEdit(budget)} style={styles.actionButton}>
            <Ionicons name="pencil" size={18} color="#3533cd" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Ionicons name="trash" size={18} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text size="lg" type="cbBlueText" style={styles.amount}>
            {formatCurrency(budget.monto_total)}
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text size="xs" type="grayText">Inicio</Text>
            <Text size="sm" type="blackText">{formatDate(budget.fecha_inicio)}</Text>
          </View>
          <View style={styles.dateSeparator} />
          <View style={styles.dateItem}>
            <Text size="xs" type="grayText">Fin</Text>
            <Text size="sm" type="blackText">{formatDate(budget.fecha_fin)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  content: {
    gap: 12,
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dateItem: {
    flex: 1,
    alignItems: 'center',
  },
  dateSeparator: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
});

export default BudgetCard;