import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../ui/text';
import { Button } from '../../ui/button';
import { colors } from '../../../styles/colors';
import TabSwitcher from '../tabSwitcher';

interface TransactionFormProps {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  onTypeChange: (type: 'income' | 'expense') => void;
  onAmountChange: (amount: number) => void;
  onCategoryChange: (category: string) => void;
  onNoteChange: (note: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TransactionForm({
  type,
  amount,
  category,
  note,
  onTypeChange,
  onAmountChange,
  onCategoryChange,
  onNoteChange,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  return (
    <View style={styles.container}>
      <TabSwitcher
        tabs={[
          { key: 'expense', title: 'Expense' },
          { key: 'income', title: 'Income' }
        ]}
        activeKey={type}
        onChange={(tab: any) => onTypeChange(tab)}
      />

      {/* Add your input fields here */}
      
      <View style={styles.buttonRow}>
        <Button 
          onClick={onCancel}
          style={styles.cancelButton}
        >
          <Text size="sm" type="whiteText">Cancel</Text>
        </Button>
        <Button onClick={onSubmit}>
          <Text size="sm" type="whiteText">Create</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: colors.gray,
  },
});

export default TransactionForm;