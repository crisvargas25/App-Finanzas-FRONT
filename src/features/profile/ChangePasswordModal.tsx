// screens/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    onSave(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Change Password</Text>
          <Text style={styles.modalMessage}>
            Enter your current password and a new one to update your account security.
          </Text>

          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }} onPress={handleSave}>
              <LinearGradient
                colors={['#2563eb', '#3b82f6']}
                style={styles.saveButton}
              >
                <Text style={styles.saveText}>Change</Text>
              </LinearGradient>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 15,
    color: '#111',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    color: '#555',
    fontWeight: '600',
  },
  saveButton: {
    padding: 15,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChangePasswordModal;
