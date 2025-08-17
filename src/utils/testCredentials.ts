// Credenciales de prueba para la aplicación Cashbook
export const TEST_CREDENTIALS = {
  email: 'demo@cashbook.com',
  password: 'demo123',
  fullName: 'Usuario Demo'
};

// Datos de usuario de ejemplo
export const DEMO_USER = {
  id: '1',
  fullName: 'Usuario Demo',
  email: 'demo@cashbook.com',
  currency: 'MXN',
  profileImage: null,
  createdAt: new Date().toISOString(),
};

// Función para validar credenciales
export const validateCredentials = (email: string, password: string): boolean => {
  return email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password;
};
