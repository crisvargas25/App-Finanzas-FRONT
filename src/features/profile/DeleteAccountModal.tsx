// screens/DeleteAccountModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#373643" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>Delete</Text>
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
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#373643',
    textAlign: 'center',
    marginBottom: 20,
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
    color: '#373643',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeleteAccountModal;