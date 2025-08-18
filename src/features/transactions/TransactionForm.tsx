import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from '../../shared/ui/text';
import Input from '../../components/forms/input';
import { Transaction, Category, Budget, TransactionType } from '../../shared/types';
import { Ionicons } from '@expo/vector-icons';

interface TransactionFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  categories: Category[];
  budgets: Budget[];
  transaction?: Transaction | null;
  loading?: boolean;
}

export interface TransactionFormData {
  tipo: TransactionType;
  monto: number;
  categoria_id: number;
  presupuesto_id?: number;
  nota?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  visible,
  onClose,
  onSubmit,
  categories,
  budgets,
  transaction,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    tipo: 'outcome',
    monto: 0,
    categoria_id: categories[0]?.id || 0,
    presupuesto_id: undefined,
    nota: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        tipo: transaction.tipo,
        monto: transaction.monto,
        categoria_id: transaction.categoria_id,
        presupuesto_id: transaction.presupuesto_id,
        nota: transaction.nota || '',
      });
    } else {
      setFormData({
        tipo: 'outcome',
        monto: 0,
        categoria_id: categories[0]?.id || 0,
        presupuesto_id: undefined,
        nota: '',
      });
    }
    setErrors({});
  }, [transaction, categories, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.monto <= 0) {
      newErrors.monto = 'The amount must be greater than 0';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'You must select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      tipo: 'outcome',
      monto: 0,
      categoria_id: categories[0]?.id || 0,
      presupuesto_id: undefined,
      nota: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text size="lg" type="blackText">
              {transaction ? 'Edit Transaction' : 'New Transaction'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#373643" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {/* Tipo de Transacción */}
            <View style={styles.fieldContainer}>
              <Text size="sm" type="blackText" style={styles.label}>
                Type of Transaction
              </Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.tipo === 'income' && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, tipo: 'income' })}
                >
                  <Text
                    size="sm"
                    type={formData.tipo === 'income' ? 'whiteText' : 'blackText'}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.tipo === 'outcome' && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, tipo: 'outcome' })}
                >
                  <Text
                    size="sm"
                    type={formData.tipo === 'outcome' ? 'whiteText' : 'blackText'}
                  >
                    Outcome
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Monto */}
            <View style={styles.fieldContainer}>
              <Text size="sm" type="blackText" style={styles.label}>
                Amount
              </Text>
              <Input
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.monto.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, monto: parseFloat(text) || 0 })
                }
              />
              {errors.monto && (
                <Text size="xs" type="cbBlueText" style={styles.errorText}>
                  {errors.monto}
                </Text>
              )}
            </View>

            {/* Categoría */}
            <View style={styles.fieldContainer}>
              <Text size="sm" type="blackText" style={styles.label}>
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.optionButton,
                      formData.categoria_id === category.id && styles.optionButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, categoria_id: category.id })}
                  >
                    <Text
                      size="xs"
                      type={formData.categoria_id === category.id ? 'whiteText' : 'blackText'}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.categoria_id && (
                <Text size="xs" type="cbBlueText" style={styles.errorText}>
                  {errors.categoria_id}
                </Text>
              )}
            </View>

            {/* Presupuesto (Opcional) */}
            <View style={styles.fieldContainer}>
              <Text size="sm" type="blackText" style={styles.label}>
                Budget (Optional)
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    !formData.presupuesto_id && styles.optionButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, presupuesto_id: undefined })}
                >
                  <Text
                    size="xs"
                    type={!formData.presupuesto_id ? 'whiteText' : 'blackText'}
                  >
                    No Budget
                  </Text>
                </TouchableOpacity>
                {budgets.map((budget) => (
                  <TouchableOpacity
                    key={budget.id}
                    style={[
                      styles.optionButton,
                      formData.presupuesto_id === budget.id && styles.optionButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, presupuesto_id: budget.id })}
                  >
                    <Text
                      size="xs"
                      type={formData.presupuesto_id === budget.id ? 'whiteText' : 'blackText'}
                    >
                      {budget.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Nota */}
            <View style={styles.fieldContainer}>
              <Text size="sm" type="blackText" style={styles.label}>
                Note (Optional)
              </Text>
              <Input
                placeholder="Transaction description..."
                multiline
                numberOfLines={3}
                value={formData.nota}
                onChangeText={(text) => setFormData({ ...formData, nota: text })}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text size="smButton" type="whiteText">
                  {loading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3533cd',
    borderColor: '#3533cd',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
  },
  picker: {
    height: 50,
  },
  errorText: {
    marginTop: 4,
    color: '#ff4444',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  optionsContainer: {
    paddingVertical: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 8,
    backgroundColor: 'white',
  },
  optionButtonActive: {
    backgroundColor: '#3533cd',
    borderColor: '#3533cd',
  },
  submitButton: {
    backgroundColor: '#3533cd',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#BABABA',
  },
});

export default TransactionForm;
