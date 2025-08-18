import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '../../../shared/types';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    goal:
      | Omit<Goal, 'id' | 'status' | 'daysOverdue' | 'currentAmount'>
      | Omit<Goal, 'status' | 'daysOverdue'>
  ) => void;
  initialData?: Goal;
}

const COLORS = {
  primary: '#3533cd',
  text: '#373643',
  border: '#ddd',
  placeholder: '#9AA0A6', // tono más suave
  error: '#ff4d4f',
};

function formatLocalYYYYMMDD(d: Date) {
  // Evita corrimientos por zona horaria al serializar
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetAmount(initialData.targetAmount.toString());
      setDeadline(initialData.deadline ? new Date(initialData.deadline) : undefined);
    } else {
      setName('');
      setTargetAmount('');
      setDeadline(undefined);
    }
    setError('');
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim()) return setError('Please enter a goal name.');
    if (!targetAmount || isNaN(parseFloat(targetAmount))) {
      return setError('Please enter a valid amount.');
    }
    if (!deadline) return setError('Please select a deadline.');

    const goal = {
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      deadline: formatLocalYYYYMMDD(deadline), // YYYY-MM-DD estable
      ...(initialData && {
        id: initialData.id,
        currentAmount: initialData.currentAmount,
      }),
    };

    onSave(goal);
  };

  const openPicker = () => setShowPicker(true);
  const closePicker = () => setShowPicker(false);

  const handleConfirmDate = (date: Date) => {
    // Seteamos a mediodía local para evitar DST edge-cases visuales
    const fixed = new Date(date);
    fixed.setHours(12, 0, 0, 0);
    setDeadline(fixed);
    closePicker();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{initialData ? 'Edit Goal' : 'New Goal'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Goal Name"
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Target Amount"
            placeholderTextColor={COLORS.placeholder}
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="numeric"
            inputMode="numeric"
          />

          <TouchableOpacity style={styles.dateInput} onPress={openPicker} activeOpacity={0.7}>
            <Text style={deadline ? styles.dateText : styles.placeholderText}>
              {deadline ? deadline.toLocaleDateString() : 'Select Deadline'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Picker en modal confiable para Expo */}
          <DateTimePickerModal
            isVisible={showPicker}
            mode="date"
            date={deadline || new Date()}
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            onConfirm={handleConfirmDate}
            onCancel={closePicker}
            textColor={COLORS.text}       // Color de los números
            themeVariant="light"           // Fondo claro
          />


          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={[styles.buttonText, styles.saveText]}>
                {initialData ? 'Save' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 420,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.placeholder,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
  },
});

export default AddGoalModal;