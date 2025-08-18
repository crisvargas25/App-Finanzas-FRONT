import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

/**
 * Representa el contexto de autenticación de la aplicación.
 *
 * `isAuthenticated` indica si existe un token válido almacenado.
 * `login` recibe credenciales, llama a la API y guarda el token.
 * `signup` recibe datos de usuario, crea una nueva cuenta y guarda el token.
 * `logout` borra las credenciales y restablece el estado.
 */
type AuthContextType = {
  isAuthenticated: boolean;
login: (email: string, password: string, isMock?: boolean) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; currency: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  // Los valores predeterminados se sobrescriben en el proveedor
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al inicializar, revisa si hay token persistido para marcar autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  /**
   * Maneja el proceso de inicio de sesión.
   * Llama al endpoint de login, guarda credenciales y actualiza el contexto.
   */
  const login = async (email: string, password: string, isMock = false) => {
    if (isMock) {
      // Simula usuario autenticado sin tocar el backend
      await AsyncStorage.setItem('auth_token', 'mock_token_123');
      await AsyncStorage.setItem('user_id', 'mock_user_123');
      setIsAuthenticated(true);
      return;
    }

    // login real contra la API
    await apiService.login(email, password);
    setIsAuthenticated(true);
  };

  /**
   * Maneja el proceso de registro de usuario.
   * Llama al endpoint de signup, guarda credenciales y actualiza el contexto.
   */
  const signup = async (userData: { name: string; email: string; password: string; currency: string }) => {
    // apiService.signup se encarga de guardar el token e id en AsyncStorage
    await apiService.signup(userData);
    setIsAuthenticated(true);
  };

  /**
   * Cierra sesión eliminando las credenciales y restableciendo el estado
   */
  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_id');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};