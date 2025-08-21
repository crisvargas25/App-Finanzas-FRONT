import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "../../../shared/ui/text";
import Input from "../../../components/forms/input";
import { Budget } from "../../../shared/types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface BudgetFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  budget?: Budget | null;
  loading?: boolean;
}

export interface BudgetFormData {
  name: string;
  montoTotal: number;
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: "activo" | "cerrado" | "cancelado";
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  visible,
  onClose,
  onSubmit,
  budget,
  loading = false,
}) => {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: "",
    montoTotal: 0,
    periodo: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "activo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPicker, setShowPicker] = useState<"inicio" | "fin" | null>(null);

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        montoTotal: budget.montoTotal,
        periodo: budget.periodo,
        fechaInicio: budget.fechaInicio,
        fechaFin: budget.fechaFin,
        estado: budget.estado,
      });
    } else {
      setFormData({
        name: "",
        montoTotal: 0,
        periodo: "",
        fechaInicio: "",
        fechaFin: "",
        estado: "activo",
      });
    }
    setErrors({});
  }, [budget, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (formData.montoTotal <= 0)
      newErrors.montoTotal = "El monto debe ser mayor a 0";
    if (!formData.periodo.trim()) newErrors.periodo = "El periodo es requerido";
    if (!formData.fechaInicio) newErrors.fechaInicio = "La fecha de inicio es requerida";
    if (!formData.fechaFin) newErrors.fechaFin = "La fecha de fin es requerida";
    if (
      formData.fechaInicio &&
      formData.fechaFin &&
      formData.fechaInicio >= formData.fechaFin
    ) {
      newErrors.fechaFin =
        "La fecha de fin debe ser posterior a la fecha de inicio";
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
      name: "",
      montoTotal: 0,
      periodo: "",
      fechaInicio: "",
      fechaFin: "",
      estado: "activo",
    });
    setErrors({});
    onClose();
  };

  const handleDateConfirm = (date: Date) => {
    const iso = date.toISOString().split("T")[0]; 
    if (showPicker === "inicio") {
      setFormData((prev) => ({ ...prev, fechaInicio: iso }));
    } else if (showPicker === "fin") {
      setFormData((prev) => ({ ...prev, fechaFin: iso }));
    }
    setShowPicker(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text size="lg" type="blackText" style={styles.title}>
            {budget ? "Editar Presupuesto" : "Nuevo Presupuesto"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nombre */}
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Nombre del Presupuesto
            </Text>
            <Input
              value={formData.name}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Ej: Vacaciones 2025"
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.name}
              </Text>
            )}
          </View>

          {/* Monto */}
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Monto Total
            </Text>
            <Input
              value={formData.montoTotal.toString()}
              onChangeText={(text: string) =>
                setFormData((prev) => ({
                  ...prev,
                  montoTotal: parseFloat(text) || 0,
                }))
              }
              placeholder="0.00"
              keyboardType="numeric"
              style={[styles.input, errors.montoTotal && styles.inputError]}
            />
            {errors.montoTotal && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.montoTotal}
              </Text>
            )}
          </View>

          {/* Periodo */}
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Periodo
            </Text>
            <Input
              value={formData.periodo}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, periodo: text }))
              }
              placeholder="Ej: mensual"
              style={[styles.input, errors.periodo && styles.inputError]}
            />
            {errors.periodo && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.periodo}
              </Text>
            )}
          </View>

          {/* Fecha Inicio */}
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Fecha de Inicio
            </Text>
            <TouchableOpacity
              style={[styles.input, errors.fechaInicio && styles.inputError]}
              onPress={() => setShowPicker("inicio")}
            >
              <Text>
                {formData.fechaInicio || "Seleccionar fecha de inicio"}
              </Text>
            </TouchableOpacity>
            {errors.fechaInicio && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.fechaInicio}
              </Text>
            )}
          </View>

          {/* Fecha Fin */}
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Fecha de Fin
            </Text>
            <TouchableOpacity
              style={[styles.input, errors.fechaFin && styles.inputError]}
              onPress={() => setShowPicker("fin")}
            >
              <Text>{formData.fechaFin || "Seleccionar fecha de fin"}</Text>
            </TouchableOpacity>
            {errors.fechaFin && (
              <Text size="xs" type="grayText" style={styles.errorText}>
                {errors.fechaFin}
              </Text>
            )}
          </View>

          {/* Estado */}
          <View style={styles.formGroup}>
            <Text size="sm" type="blackText" style={styles.label}>
              Estado
            </Text>
            <View style={styles.statusContainer}>
              {["activo", "cerrado", "cancelado"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    formData.estado === status && styles.statusButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      estado: status as "activo" | "cerrado" | "cancelado",
                    }))
                  }
                >
                  <Text
                    size="sm"
                    type={formData.estado === status ? "whiteText" : "blackText"}
                  >
                    {status === "activo"
                      ? "Activo"
                      : status === "cerrado"
                      ? "Cerrado"
                      : "Cancelado"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botón */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text size="smButton" type="whiteText" style={styles.submitButtonText}>
                {loading
                  ? "Guardando..."
                  : budget
                  ? "Actualizar"
                  : "Crear Presupuesto"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <DateTimePickerModal
        isVisible={showPicker !== null}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowPicker(null)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: { padding: 4 },
  title: { fontWeight: "bold" },
  placeholder: { width: 32 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  formGroup: { marginBottom: 20 },
  label: { marginBottom: 8, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#ff4444" },
  errorText: { color: "#ff4444", marginTop: 4 },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  statusButtonSelected: { backgroundColor: "#3533cd", borderColor: "#3533cd" },
  buttonContainer: { marginTop: 20, marginBottom: 40 },
  submitButton: {
    backgroundColor: "#3533cd",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#ccc" },
  submitButtonText: { fontWeight: "bold" },
});

export default BudgetForm;
