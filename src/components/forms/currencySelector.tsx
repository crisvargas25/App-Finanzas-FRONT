import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text } from '../ui/text';

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

interface CurrencySelectorProps {
  value: string;
  onValueChange: (currency: string) => void;
  placeholder?: string;
}

export default function CurrencySelector({ 
  value, 
  onValueChange, 
  placeholder = "Select Currency" 
}: CurrencySelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedCurrency = CURRENCY_OPTIONS.find(option => option.code === value);

  const handleSelect = (currencyCode: string) => {
    onValueChange(currencyCode);
    setModalVisible(false);
  };

  const renderCurrencyItem = ({ item }: { item: CurrencyOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        value === item.code && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.code)}
    >
      <View style={styles.optionContent}>
        <Text size="smButton" type="blackText" style={styles.currencySymbol}>
          {item.symbol}
        </Text>
        <View style={styles.currencyInfo}>
          <Text size="smButton" type="blackText" style={styles.currencyCode}>
            {item.code}
          </Text>
          <Text size="smButton" type="grayText" style={styles.currencyName}>
            {item.name}
          </Text>
        </View>
      </View>
      {value === item.code && (
        <Text size="smButton" type="blackText">
          {'✓'}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedCurrency ? (
            <View style={styles.selectedContent}>
              <Text size="smButton" type="grayText" style={styles.selectedSymbol}>
                {selectedCurrency.symbol}
              </Text>
              <Text size="smButton" type="grayText">
                {selectedCurrency.code} - {selectedCurrency.name}
              </Text>
            </View>
          ) : (
            <Text size="smButton" type="grayText">
              {placeholder}
            </Text>
          )}
          <Text size="smButton" type="grayText">
            {'▼'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text size="lg" type="blackText">
                Selecciona Moneda
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text size="md" type="blackText">
                  {'✕'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={CURRENCY_OPTIONS}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item.code}
              style={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selector: {
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
    paddingVertical: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedSymbol: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
  },
  closeButton: {
    padding: 5,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
  },
  selectedOption: {
    backgroundColor: '#6f99d31b',
    borderRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencySymbol: {
    marginRight: 15,
    fontSize: 20,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 12,
  },
});
