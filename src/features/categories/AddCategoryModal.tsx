// components/AddCategoryModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  createdAt: string;
}

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id' | 'createdAt'> | Category) => void;
  initialData?: Category;
}

const COLORS = {
  primary: '#3533cd',
  text: '#373643',
  border: '#e5e7eb',
  placeholder: '#9AA0A6',
  success: '#22c55e',
  bg: '#fff',
  headerBg: '#f4f6ff',
  chipBg: '#eef2ff',
};

const predefinedColors = [
  '#22c55e', // Green
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#f59e0b', // Orange
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#6d28d9', // Violet
  '#10b981', // Teal
];

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState(predefinedColors[0]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setColor(initialData.color);
    } else {
      setName('');
      setType('expense');
      setColor(predefinedColors[0]);
    }
    setError('');
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a category name.');
      return;
    }
    const category = {
      name: name.trim(),
      type,
      color,
      ...(initialData && { id: initialData.id, createdAt: initialData.createdAt }),
    } as Omit<Category, 'id' | 'createdAt'> | Category;

    onSave(category);
  };

  const renderColorItem = ({ item }: { item: string }) => {
    const isSelected = color === item;
    return (
      <TouchableOpacity
        style={[
          styles.colorSwatch,
          { backgroundColor: item },
          isSelected && styles.colorSelected,
        ]}
        onPress={() => setColor(item)}
        accessibilityRole="button"
        accessibilityLabel={`Pick color ${item}`}
      >
        {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{initialData ? 'Edit Category' : 'New Category'}</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close modal">
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {initialData
              ? 'Update the details of your category'
              : 'Create a category to organize your transactions'}
          </Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Food, Transportation..."
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
          />

          {/* Type (chips instead of Picker) */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeChip, type === 'income' && styles.typeChipActive]}
              onPress={() => setType('income')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: type === 'income' }}
            >
              <Ionicons
                name="arrow-down-circle"
                size={16}
                color={type === 'income' ? '#fff' : COLORS.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
                Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeChip, type === 'expense' && styles.typeChipActive]}
              onPress={() => setType('expense')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: type === 'expense' }}
            >
              <Ionicons
                name="arrow-up-circle"
                size={16}
                color={type === 'expense' ? '#fff' : COLORS.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* Color */}
          <Text style={styles.label}>Color</Text>
          <FlatList
            data={predefinedColors}
            renderItem={renderColorItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.colorList}
            contentContainerStyle={{ paddingVertical: 2 }}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onClose}>
              <Text style={[styles.btnText, styles.btnGhostText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
              <Text style={[styles.btnText, styles.btnPrimaryText]}>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    padding: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    backgroundColor: COLORS.headerBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  subtitle: { fontSize: 13, color: COLORS.text, opacity: 0.8, marginBottom: 12, marginTop: 2 },

  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 8 },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },

  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  typeChipActive: {
    backgroundColor: COLORS.primary,
  },
  typeText: { color: COLORS.primary, fontWeight: '600' },
  typeTextActive: { color: '#fff' },

  colorList: { marginBottom: 14, marginTop: 2 },
  colorSwatch: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },

  errorText: { color: '#ff4d4f', textAlign: 'center', marginBottom: 6 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnGhost: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnPrimary: {
    backgroundColor: COLORS.success,
  },
  btnText: { fontSize: 15, fontWeight: '700' },
  btnGhostText: { color: COLORS.text },
  btnPrimaryText: { color: '#fff' },
});

export default AddCategoryModal;
