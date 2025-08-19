// screens/EditProfileModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../shared/types';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User;
}

const currencies = ['USD', 'MXN', 'EUR', 'GBP'];

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onSave, user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState(user.currency || currencies[0]);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name,
      email,
      currency,
    };
    onSave(updatedUser);
  };

  const renderCurrencyItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => {
        setCurrency(item);
        setCurrencyModalVisible(false);
      }}
    >
      <Text style={styles.currencyText}>{item}</Text>
      {currency === item && <Ionicons name="checkmark" size={20} color="#22c55e" />}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#373643" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Edit Profile</Text>
          <Text style={styles.modalSubtitle}>Update your information below</Text>

          {/* Nombre */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor="#999"
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          {/* Currency Selector */}
          <Text style={styles.label}>Currency</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <Text style={styles.selectorText}>{currency}</Text>
            <Ionicons name="chevron-down" size={20} color="#373643" />
          </TouchableOpacity>

          {/* Modal para seleccionar currency */}
          <Modal visible={currencyModalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.currencyModal}>
                <Text style={styles.currencyTitle}>Select Currency</Text>
                <FlatList
                  data={currencies}
                  renderItem={renderCurrencyItem}
                  keyExtractor={(item) => item}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
                <TouchableOpacity
                  style={styles.closeCurrencyButton}
                  onPress={() => setCurrencyModalVisible(false)}
                >
                  <Text style={styles.closeCurrencyText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Botones */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
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
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    elevation: 4,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3533cd',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#373643',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#373643',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: '#000',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  selectorText: {
    color: '#000',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    padding: 20,
    elevation: 5,
  },
  currencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3533cd',
    marginBottom: 15,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  currencyText: {
    fontSize: 16,
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  closeCurrencyButton: {
    marginTop: 15,
    backgroundColor: '#22c55e',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  closeCurrencyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  cancelText: {
    color: '#373643',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfileModal;
