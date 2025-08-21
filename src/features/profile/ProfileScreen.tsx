// screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../shared/types';
import EditProfileModal from './EditProfileModal';
import DeleteAccountModal from './DeleteAccountModal';
import ChangePasswordModal from './ChangePasswordModal';
import { apiService } from '../../shared/services/api'; 

const defaultAvatar = require('../../../assets/imgs/profile.jpeg');

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

useEffect(() => {
  const loadUserProfile = async () => {
    try {
      const fetchedUser = await apiService.getUserProfile();
      console.log("Perfil cargado:", fetchedUser);
      setUser(fetchedUser);
    } catch (err) {
      console.error(" Error en getUserProfile:", err);
    }
  };

  loadUserProfile();
}, []);




  const handleEditProfile = async (updatedUser: User) => {
  try {
    const response = await apiService.updateUserProfile({
      name: updatedUser.name,
      email: updatedUser.email,
      currency: updatedUser.currency,
    });

    console.log(" Usuario actualizado:", response.user);

    setUser(response.user); 
    setEditModalVisible(false);
  } catch (error) {
    console.error(" Error al actualizar perfil:", error);
  }
};


  const handleDeleteAccount = async () => {
    try {
      await apiService.deleteUserAccount();
      setDeleteModalVisible(false);
      Alert.alert('Success', 'Cuenta eliminada correctamente');
    } catch (error) {
      console.error("Error en deleteUserAccount:", error);
      Alert.alert("Error", "No se pudo eliminar la cuenta.");
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    try {
      await apiService.changePassword(newPassword);
      setChangePasswordVisible(false);
      Alert.alert('Success', 'Contraseña cambiada correctamente');
    } catch (error) {
      console.error(" Error en changePassword:", error);
      Alert.alert("Error", "No se pudo cambiar la contraseña.");
    }
  };

  if (!user) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={defaultAvatar} style={styles.avatar} resizeMode="cover" />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Currency</Text>
          <Text style={styles.detailValue}>{user.currency}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Joined</Text>
          <Text style={styles.detailValue}>
            {new Date(user.creationDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>{user.status ? 'Active' : 'Inactive'}</Text>
        </View>
        {user.deleteDate && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Deleted</Text>
            <Text style={styles.detailValue}>
              {new Date(user.deleteDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Ionicons name="create-outline" size={20} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.changePasswordButton} onPress={() => setChangePasswordVisible(true)}>
          <Ionicons name="key-outline" size={20} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
          <Ionicons name="trash-outline" size={20} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* === MODALES === */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditProfile}
        user={user}
      />
      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
      />
      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
        onSave={handleChangePassword}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  header: { alignItems: 'center', marginBottom: 25, paddingVertical: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, borderWidth: 2, borderColor: '#ccc', backgroundColor: '#ddd' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  email: { fontSize: 16, color: '#555' },
  detailsContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 20 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 16, color: '#373643' },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  actions: { flexDirection: 'column', gap: 12 },
  editButton: { flexDirection: 'row', backgroundColor: '#22c55e', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  changePasswordButton: { flexDirection: 'row', backgroundColor: '#3b82f6', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  deleteButton: { flexDirection: 'row', backgroundColor: '#ef4444', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionIcon: { marginRight: 10 },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loading: { textAlign: 'center', marginTop: 20, color: '#373643' },
});

export default ProfileScreen;
