import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from '../../../shared/ui/text';
import Input from '../../../components/forms/input';
import { Budget } from '../../../shared/types';
import { Ionicons } from '@expo/vector-icons';

interface BudgetFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  budget?: Budget | null;
  loading?: boolean;
}

export interface BudgetFormData {
  nombre: string;
  monto_total: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'active' | 'closed' | 'canceled';
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  visible,
  onClose,
  onSubmit,
  budget,
  loading = false,
}) => {
  const [formData, setFormData] = useState<BudgetFormData>({
    nombre: '',
    monto_total: 0,
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (budget) {
      setFormData({
        nombre: budget.nombre,
        monto_total: budget.monto_total,
        fecha_inicio: budget.fecha_inicio,
        fecha_fin: budget.fecha_fin,
        estado: budget.estado,
      });
    } else {
      setFormData({
        nombre: '',
        monto_total: 0,
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'active',
      });
    }
    setErrors({});
  }, [budget, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.monto_total <= 0) {
      newErrors.monto_total = 'El monto debe ser mayor a 0';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }

    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio >= formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
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
      nombre: '',
      monto_total: 0,
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'active',
    });
    setErrors({});
    onClose();
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Formato YYYY-MM-DD
  };

  const handleDateChange = (field: 'fecha_inicio' | 'fecha_fin', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text size="lg" type="blackText" style={styles.title}>
            {budget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Nombre del Presupuesto
            </Text>
            <Input
              value={formData.nombre}
              onChangeText={(text: string) => setFormData(prev => ({ ...prev, nombre: text }))}
              placeholder="Ej: Vacaciones 2025"
              style={[styles.input, errors.nombre && styles.inputError]}
            />
            {errors.nombre && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.nombre}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Monto Total
            </Text>
            <Input
              value={formData.monto_total.toString()}
              onChangeText={(text: string) => setFormData(prev => ({ 
                ...prev, 
                monto_total: parseFloat(text) || 0 
              }))}
              placeholder="0.00"
              keyboardType="numeric"
              style={[styles.input, errors.monto_total && styles.inputError]}
            />
            {errors.monto_total && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.monto_total}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Fecha de Inicio
            </Text>
            <Input
              value={formatDateForInput(formData.fecha_inicio)}
              onChangeText={(text: string) => handleDateChange('fecha_inicio', text)}
              placeholder="YYYY-MM-DD"
              style={[styles.input, errors.fecha_inicio && styles.inputError]}
            />
            {errors.fecha_inicio && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.fecha_inicio}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Fecha de Fin
            </Text>
            <Input
              value={formatDateForInput(formData.fecha_fin)}
              onChangeText={(text: string) => handleDateChange('fecha_fin', text)}
              placeholder="YYYY-MM-DD"
              style={[styles.input, errors.fecha_fin && styles.inputError]}
            />
            {errors.fecha_fin && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.fecha_fin}
              </Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Estado
            </Text>
            <View style={styles.statusContainer}>
              {['active', 'closed', 'canceled'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    formData.estado === status && styles.statusButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, estado: status as 'active' | 'closed' | 'canceled' }))}
                >
                  <Text 
                    size="sm" 
                    type={formData.estado === status ? "whiteText" : "blackText"}
                  >
                    {status === 'active' ? 'Activo' : status === 'closed' ? 'Cerrado' : 'Cancelado'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text size="smButton" type="whiteText" style={styles.submitButtonText}>
                {loading ? 'Guardando...' : (budget ? 'Actualizar' : 'Crear Presupuesto')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    marginTop: 4,
  },
  pickerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  picker: {
    height: 40,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusButtonSelected: {
    backgroundColor: '#3533cd',
    borderColor: '#3533cd',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#3533cd',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontWeight: 'bold',
  },
});

export default BudgetForm;