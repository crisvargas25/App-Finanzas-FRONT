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
import { Budget, Transaction, Category } from "../types";


const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://192.168.3.149:4000/api');

export default API_BASE_URL;


// In production builds the base URL should not be logged to avoid leaking
// configuration details.  Use the DEBUG flag to enable logging when
// developing locally.
class ApiService {
  /**
   * Actualiza el token de autenticación si es necesario. Llama a un
   * endpoint de actualización que extiende la validez del token en el servidor.
   */ 
  private async updateTokenIfNeeded(): Promise<void> {
    const token = await AsyncStorage.getItem('auth_token');
    const userId = await AsyncStorage.getItem('user_id');
    if (!token || !userId) {
        await this.handleUnauthorized();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/update?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });

        if (response.status === 401) {
        await this.handleUnauthorized();
        throw new Error('Token inválido o expirado');
        }

        if (!response.ok) {
        throw new Error('No se pudo actualizar el token');
        }

        const result = await response.json();
        console.log('Token update response:', result);

        // Si el servidor devuelve un nuevo token, guárdalo
        if (result.token) {
        await AsyncStorage.setItem('auth_token', result.token);
        }
    } catch (err) {
        console.error('No se pudo actualizar el token:', err);
        await this.handleUnauthorized();
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

  
  // ====== GOALS (Cloud API) ======

// GET metas desde el backend (Mongo). Devuelve un array.
async listGoalsFromCloud(userServerId: string) {
  return this.request<Array<{
    _id: string;
    userId: string;
    nombreMeta: string;
    montoObjetivo: number;
    montoActual: number;
    fechaMeta: string;    
    estado?: 'en_progreso' | 'cumplida' | 'cancelada';
    updatedAt?: string;
  }>>(`/saving-goals/getall?userId=${encodeURIComponent(userServerId)}`);
}

// Crear meta en backend → devuelve _id de Mongo
async createGoalInCloud(input: {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status?: 'en_progreso' | 'cumplida' | 'cancelada';
}) {
  const body = {
    userId: input.userId,
    nombreMeta: input.name,
    montoObjetivo: input.targetAmount,
    montoActual: input.currentAmount,
    fechaMeta: input.deadline,
    estado: input.status,
  };
  const res = await this.request<{ message: string; savingGoal: { _id: string } }>(
    `/saving-goals/create`,
    { method: 'POST', body: JSON.stringify(body) }
  );
  return res.savingGoal._id;
}

// Actualizar meta en backend
async updateGoalInCloud(serverId: string, patch: {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  status?: 'en_progreso' | 'cumplida' | 'cancelada';
}) {
  const body = {
    ...(patch.name != null ? { nombreMeta: patch.name } : {}),
    ...(patch.targetAmount != null ? { montoObjetivo: patch.targetAmount } : {}),
    ...(patch.currentAmount != null ? { montoActual: patch.currentAmount } : {}),
    ...(patch.deadline != null ? { fechaMeta: patch.deadline } : {}),
    ...(patch.status != null ? { estado: patch.status } : {}),
  };
  await this.request<{ message: string }>(
    `/saving-goals/update/${encodeURIComponent(serverId)}`,
    { method: 'PUT', body: JSON.stringify(body) }
  );
}

  // Eliminar meta en backend
  async deleteGoalInCloud(serverId: string) {
    return this.request<{ message: string }>(
      `/saving-goals/delete/${encodeURIComponent(serverId)}`,
      { method: 'DELETE' }
    );
  }

    // ========= BUDGETS =========

      async getBudgets(userId: string) {
      return this.request<Budget[]>(`/budgets/getall?userId=${userId}`, {
        method: "GET",
      });
    }

    async createBudget(data: Omit<Budget, "id">) {
      return this.request<Budget>("/budgets/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }

    async updateBudget(id: string, data: Partial<Budget>) {
      return this.request<Budget>(`/budgets/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }

    async deleteBudget(id: string) {
      return this.request<{ message: string }>(`/budgets/delete/${id}`, {
        method: "DELETE",
      });
    }


    
      

        /// ========= CATEGORIES =========
    async getCategories() {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) throw new Error("No se encontró userId en AsyncStorage");

      return this.request(`/finance-categories/getall?userId=${userId}`, {
        method: "GET",
      });
    }

    async createCategory(data: { name: string; type: string; color: string }) {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) throw new Error("No se encontró userId en AsyncStorage");

      const body = {
        userId,   
        ...data,
      };

      return this.request(`/finance-categories/create`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    async updateCategory(id: string, data: { name?: string; type?: string; color?: string }) {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) throw new Error("No se encontró userId en AsyncStorage");

      const body = {
        userId,  
        ...data,
      };

      return this.request(`/finance-categories/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    }

    async deleteCategory(id: string) {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) throw new Error("No se encontró userId en AsyncStorage");

      return this.request(`/finance-categories/delete/${id}?userId=${userId}`, {
        method: "DELETE",
      });
    }
     // ========= TRANSACTIONS =========

  async getTransactions() {
    const userId = await AsyncStorage.getItem("user_id");
    if (!userId) throw new Error("No se encontró userId en AsyncStorage");

    return this.request<Transaction[]>(`/transactions/getall?userId=${userId}`, {
      method: "GET",
    });
  }

async createTransaction(data: any) {
  return this.request("/transactions/create", {
    method: "POST",
    body: JSON.stringify(data),   // 👈 importante
    headers: { "Content-Type": "application/json" },
  });
}

  async updateTransaction(id: string, data: Partial<Transaction>) {
    const userId = await AsyncStorage.getItem("user_id");
    if (!userId) throw new Error("No se encontró userId en AsyncStorage");

    return this.request<Transaction>(`/transactions/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, userId }),
    });
  }

  async deleteTransaction(id: string) {
    const userId = await AsyncStorage.getItem("user_id");
    if (!userId) throw new Error("No se encontró userId en AsyncStorage");

    return this.request<{ message: string }>(
      `/transactions/delete/${id}?userId=${userId}`,
      { method: "DELETE" }
    );
  }


}



export const apiService = new ApiService()