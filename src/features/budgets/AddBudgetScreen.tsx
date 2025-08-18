import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from '../../shared/ui/text';
import BudgetForm, { BudgetFormData } from './components/BudgetForm';
import { useBudgets } from './hooks/useBudgets';
import { useNavigation } from '@react-navigation/native';

export default function AddBudgetScreen() {
  const navigation = useNavigation();
  const { createBudget, loading } = useBudgets();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      await createBudget(data);
      Alert.alert(
        'Éxito', 
        'Presupuesto creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el presupuesto');
    }
  };

  const handleCloseForm = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BudgetForm
        visible={isFormVisible}
        onClose={handleCloseForm}
        onSubmit={handleCreateBudget}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
