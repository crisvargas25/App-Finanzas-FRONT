import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../../../shared/ui/text';
import { Budget } from '../../../shared/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBudgets } from '../hooks/useBudgets';

export default function BudgetDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { budgetId } = route.params as { budgetId: string }; // ahora _id es string
  const { getBudgetById, deleteBudget } = useBudgets();

  const budget: Budget | null = getBudgetById(budgetId);

  if (!budget) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text size="lg" type="blackText" style={styles.errorTitle}>
          Presupuesto no encontrado
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text size="sm" type="whiteText">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return '#4CAF50';
      case 'cerrado': return '#9E9E9E';
      case 'cancelado': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
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

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(budget.fechaFin);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBudgetDuration = () => {
    const startDate = new Date(budget.fechaInicio);
    const endDate = new Date(budget.fechaFin);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleEdit = () => {
    Alert.alert('Información', 'Funcionalidad de edición en desarrollo');
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Presupuesto',
      `¿Estás seguro de que quieres eliminar "${budget.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudget(budget._id);
              Alert.alert('Éxito', 'Presupuesto eliminado correctamente');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el presupuesto');
            }
          },
        },
      ]
    );
  };

  const daysRemaining = getDaysRemaining();
  const totalDays = getBudgetDuration();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text size="xl" type="blackText" style={styles.title}>
              {budget.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(budget.estado) }]}>
              <Text size="sm" type="whiteText">
                {budget.estado}
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <Ionicons name="pencil" size={20} color="#3533cd" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton]}>
              <Ionicons name="trash" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.amountCard}>
          <Text size="sm" type="grayText" style={styles.amountLabel}>
            Monto Total
          </Text>
          <Text size="2xl" type="cbBlueText" style={styles.amount}>
            {formatCurrency(budget.montoTotal)}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={24} color="#3533cd" />
            </View>
            <Text size="xs" type="grayText">Fecha de Inicio</Text>
            <Text size="md" type="blackText" style={styles.infoValue}>
              {formatDate(budget.fechaInicio)}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={24} color="#3533cd" />
            </View>
            <Text size="xs" type="grayText">Fecha de Fin</Text>
            <Text size="md" type="blackText" style={styles.infoValue}>
              {formatDate(budget.fechaFin)}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="time-outline" size={24} color="#3533cd" />
            </View>
            <Text size="xs" type="grayText">Duración Total</Text>
            <Text size="md" type="blackText" style={styles.infoValue}>
              {totalDays} días
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="hourglass-outline" size={24} color="#3533cd" />
            </View>
            <Text size="xs" type="grayText">Días Restantes</Text>
            <Text size="md" type="blackText" style={styles.infoValue}>
              {daysRemaining > 0 ? `${daysRemaining} días` : 'Vencido'}
            </Text>
          </View>
        </View>

        {budget.estado === 'activo' && (
          <View style={styles.progressCard}>
            <Text size="md" type="blackText" style={styles.progressTitle}>
              Progreso del Presupuesto
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(100, (totalDays - daysRemaining) / totalDays * 100)}%` }
                ]} 
              />
            </View>
            <Text size="sm" type="grayText" style={styles.progressText}>
              {Math.round((totalDays - daysRemaining) / totalDays * 100)}% del tiempo transcurrido
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: { flex: 1, marginRight: 16 },
  title: { fontWeight: 'bold', marginBottom: 8 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  actionsContainer: { flexDirection: 'row', gap: 8 },
  actionButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: { backgroundColor: '#fff' },
  amountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  amountLabel: { marginBottom: 8 },
  amount: { fontWeight: 'bold' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoIcon: { marginBottom: 8 },
  infoValue: { marginTop: 4, fontWeight: '600', textAlign: 'center' },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressTitle: { fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#3533cd', borderRadius: 4 },
  progressText: { textAlign: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  errorTitle: { marginTop: 16, marginBottom: 24, textAlign: 'center' },
  backButton: { backgroundColor: '#3533cd', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
});
