import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  currency: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { fullName: string; email: string; password: string; currency?: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Asumiendo que la API retorna los datos del usuario
        const userData: User = {
          id: data.user?.id || data.id,
          fullName: data.user?.fullName || data.fullName,
          email: data.user?.email || data.email,
          currency: data.user?.currency || 'MXN',
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Si la API retorna un token, lo puedes guardar aquí
        if (data.token) {
          // Aquí puedes guardar el token en AsyncStorage si es necesario
          // await AsyncStorage.setItem('authToken', data.token);
        }
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message || 'Credenciales incorrectas');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const signup = async (userData: { fullName: string; email: string; password: string; currency?: string }): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          currency: userData.currency || 'MXN',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const newUser: User = {
          id: data.user?.id || data.id,
          fullName: data.user?.fullName || data.fullName,
          email: data.user?.email || data.email,
          currency: data.user?.currency || data.currency || 'MXN',
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Si la API retorna un token, lo puedes guardar aquí
        if (data.token) {
          // await AsyncStorage.setItem('authToken', data.token);
        }
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.message || 'Error al crear la cuenta');
        return false;
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
