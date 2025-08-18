// Aqui tendremos los tipos globales compartidos de la aplicacion

// ===== Role =====
// Usamos el mismo enum que el backend para consistencia
export enum RoleType {
  USER = 'user',
  ADMIN = 'admin',
}

export interface Role {
  type: RoleType;
}

// ===== User =====
export interface User {
  _id: string; // Obligatorio, elimina id?: string
  name: string;
  email: string;
  password: string;
  role: Role[]; // Array de roles, obligatorio
  creationDate: Date; // Obligatorio, usa Date
  deleteDate?: Date; // Opcional, usa Date
  status: boolean;
  currency: 'USD' | 'MXN' | 'EUR' | 'GBP'; // Agregado para coincidir con el modelo
}
// ===== Menu =====
export interface Menu {
  _id?: string;
  title: string;
  path: string;
  icon: string;
  description: string;
  roles: Role[];
  status: boolean;
}


// ===== goal =====
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status?: 'overdue' | 'in_progress' | 'completed';
  daysOverdue?: number;
}

// ===== Transaction =====
export type TransactionType = 'income' | 'outcome';

export interface Category {
  id: number;
  name: string;
}

export interface Budget {
  id: number;
  usuario_id?: number;
  nombre: string;
  monto_total: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'active' | 'closed' | 'canceled';
}

export interface Transaction {
  id?: number;
  usuario_id?: number;
  tipo: TransactionType;
  monto: number;
  fecha?: string;
  categoria_id: number;
  presupuesto_id?: number;
  nota?: string;
  // Para mostrar datos relacionados
  categoria?: Category;
  presupuesto?: Budget;
}