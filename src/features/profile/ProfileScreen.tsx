// screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../shared/types'; 
import EditProfileModal from './EditProfileModal';
import DeleteAccountModal from './DeleteAccountModal';

const defaultAvatar = require('../../../assets/imgs/profile.jpeg');

const fetchUserProfile = async (): Promise<User> => {
  return {
    _id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    creationDate: new Date('2024-01-15'),
    deleteDate: undefined,
    status: true,
    currency: 'MXN',
    role: [], // ya no lo mostraremos
  };
};

const updateUserProfile = async (updatedUser: User): Promise<User> => {
  console.log('Updated user:', updatedUser);
  return updatedUser;
};

const deleteUserAccount = async (userId: string): Promise<void> => {
  console.log('Deleted user:', userId);
};

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const fetchedUser = await fetchUserProfile();
    setUser(fetchedUser);
  };

  const handleEditProfile = async (updatedUser: User) => {
    if (user) {
      const newUser = await updateUserProfile(updatedUser);
      setUser(newUser);
      setEditModalVisible(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (user?._id) {
      await deleteUserAccount(user._id);
      setDeleteModalVisible(false);
      Alert.alert('Success', 'Account deleted successfully');
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
        <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
          <Ionicons name="trash-outline" size={20} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#373643',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    marginRight: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#373643',
  },
});

export default ProfileScreen;
