/*
 * Servicio API para la aplicación móvil.
 *
 * Esta implementación se basa en el archivo de ejemplo para la aplicación web
 * y se ha adaptado para React Native. Utiliza AsyncStorage para
 * persistir el token de autenticación y permite interactuar con una API REST
 * protegida con JWT.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// Obtén la URL base de la API desde las variables de entorno de Expo.
// Debes definir `EXPO_PUBLIC_API_URL` en tu entorno (por ejemplo en app.json
// dentro de `extra`). Si no se define, utiliza un valor por defecto.
import { Platform } from 'react-native';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || process.env.API_BASE_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api');

// In production builds the base URL should not be logged to avoid leaking
// configuration details.  Use the DEBUG flag to enable logging when
// developing locally.
class ApiService {
  /**
   * Actualiza el token de autenticación si es necesario. Llama a un
   * endpoint de actualización que extiende la validez del token en el servidor.
   */ 
  private async updateTokenIfNeeded(): Promise<void> {
    const token = await AsyncStorage.getItem('auth_token')
    const userId = await AsyncStorage.getItem('user_id')
    if (!token || !userId) return

    try {
      await fetch(`${API_BASE_URL}/auth/update?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {
      // Registra si no fue posible actualizar el token para propósitos de depuración
      console.error('No se pudo actualizar el token', err)
    }
  }

  /**
   * Maneja un error de autenticación eliminando credenciales almacenadas.
   */
  private async handleUnauthorized(): Promise<void> {
    await AsyncStorage.removeItem('auth_token')
    await AsyncStorage.removeItem('user_id')
  }

  /**
   * Método interno que encapsula la lógica de fetch con manejo de token
   * y manejo global de errores. Devuelve la respuesta parseada como JSON.
   *
   * @param endpoint Ruta relativa a la API (ej. "/user/getall")
   * @param options Opciones de fetch (método, cuerpo, cabeceras, etc.)
   * @param authRequired Si se necesita token para esta petición
   */
    private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    authRequired = true,
    ): Promise<T> {
    let token: string | null = null;

    if (authRequired) {
        token = await AsyncStorage.getItem('auth_token');
        if (token) {
        await this.updateTokenIfNeeded();
        }
    }

    const headers: Record<string, any> = {
        'Content-Type': 'application/json',
        ...(authRequired && token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    const fullUrl = `${API_BASE_URL}${endpoint}`;
    
    console.log('Sending request to:', fullUrl);
    console.log('Request config:', config);

    try {
        const response = await fetch(fullUrl, config);

        const responseBody = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseBody);

        if (response.status === 401) {
        await this.handleUnauthorized();
        throw new Error('Token expirado o credenciales inválidas');
        }

        // Acepta 201 como exitoso además de 200-299
        if (!response.ok && response.status !== 201) {
        let errorMessage = `API Error: ${response.status}`;
        try {
            const errorData = JSON.parse(responseBody);
            console.error('Server error details:', errorData);
            errorMessage = errorData.message || errorMessage;
        } catch {
            console.error('Failed to parse error response as JSON:', responseBody);
        }
        throw new Error(errorMessage);
        }

        const jsonResponse = JSON.parse(responseBody);
        return jsonResponse as T;
    } catch (err) {
        console.error('Fetch network error:', err);
        throw err;
    }
    }
  // ========= ENDPOINTS DE AUTENTICACIÓN =========

  /**
   * Inicia sesión. No necesita token previo.
   * Almacena el token y el id de usuario en AsyncStorage.
   */
  async login(email: string, password: string) {
    const requestBody = { email, password };
    console.log('Login request body:', requestBody); // Verifica los datos enviados
    try {
      const result = await this.request<{
        message: string;
        token: string;
        user: {
          id: string;
          name: string;
          email: string;
          role: { type: 'admin' | 'user' | 'client' }[];
        };
      }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
        },
        false,
      );
      console.log('Login response:', result); // Verifica la respuesta del servidor
      await AsyncStorage.setItem('auth_token', result.token);
      await AsyncStorage.setItem('user_id', result.user.id);
      console.log('Stored token:', result.token); // Confirma que se guardó
      return result;
    } catch (err) {
      console.error('Login failed:', err); // Log del error completo en login
      throw err;
    }
  }

  /**
   * Registra un nuevo usuario. No necesita token previo.
   * Almacena el token y el id de usuario en AsyncStorage.
   */
    async signup(userData: { name: string; email: string; password: string; currency: string }) {
    const requestBody = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        currency: userData.currency,
        role: [{ type: "user" }], // Auto-asigna rol "user" por defecto
    };
    const result = await this.request<{
        message: string;
        user: {
        id: string;
        name: string;
        email: string;
        role: { type: 'user' }[];
        status: boolean;
        };
    }>(
        '/users/register',
        {
        method: 'POST',
        body: JSON.stringify(requestBody),
        },
        false,
    );

    // No guardamos token ni user_id, solo retornamos el resultado
    return result;
    }

  /**
   * Obtiene la hora del servidor (no requiere autenticación).
   */
  async getTime(userId: string) {
    return this.request('/auth/gettime', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }, false)
  }

  /**
   * Solicita la extensión del token directamente.
   */
  async updateToken(userId: string) {
    const token = await AsyncStorage.getItem('auth_token')
    return fetch(`${API_BASE_URL}/auth/update?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())
  }

  // ========= ENDPOINTS DE USUARIOS =========

  async getUsers() {
    return this.request('/user/getall')
  }

  async getUserById(id: string) {
    return this.request(`/user/get/${id}`)
  }

  async updateUser(id: string, data: any) {
    return this.request(`/user/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string) {
    return this.request(`/user/delete/${id}`, {
      method: 'DELETE',
    })
  }

  async getAdmins() {
    return this.request('/user/getadmins')
  }


  // ========= CORREO =========

  async sendEmail(data: any) {
    return this.request('/email/sendEmail', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ========= ENDPOINTS DE TRANSACCIONES =========

  /**
   * Obtiene todas las transacciones del usuario autenticado
   */
  async getTransactions() {
    return this.request<any[]>('/transactions', {
      method: 'GET',
    });
  }

  /**
   * Crea una nueva transacción
   */
  async createTransaction(transactionData: {
    tipo: 'income' | 'outcome';
    monto: number;
    categoria_id: number;
    presupuesto_id?: number;
    nota?: string;
  }) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  /**
   * Actualiza una transacción existente
   */
  async updateTransaction(id: number, transactionData: {
    tipo?: 'income' | 'outcome';
    monto?: number;
    categoria_id?: number;
    presupuesto_id?: number;
    nota?: string;
  }) {
    return this.request<any>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  /**
   * Elimina una transacción
   */
  async deleteTransaction(id: number) {
    return this.request<any>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  async getCategories() {
    return this.request<any[]>('/categories', {
      method: 'GET',
    });
  }

  /**
   * Obtiene todos los presupuestos del usuario
   */
  async getBudgets() {
    return this.request<any[]>('/budgets', {
      method: 'GET',
    });
  }

  // ========= SINCRONIZACIÓN =========

  async syncSensor(data: any) {
    return this.request('/sync/sync-sensor', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

// Instancia única del servicio API
export const apiService = new ApiService()