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

export interface Category {
  _id: string;
  userId: string;
  name: string; 
  tipo: "ingreso" | "gasto";
  color: string;
}




export interface Budget {
  _id: string;
  userId: string;
  name: string;
  montoTotal: number;
  periodo: 'mensual' | 'semanal' | 'personalizado';
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'cerrado' | 'cancelado';
}

export interface Transaction {
  _id?: string; 
  id?: string; 
  userId: string;
  type: "ingreso" | "gasto"; 
  monto: number;
  fecha: string; 
  categoriaId?: Category | string | null;   
  presupuestoId?: Budget | string | null;   
  nota?: string;
}

export interface TransactionFormData {
  type: "income" | "outcome"; 
  monto: number;
  categoriaId?: string;
  presupuestoId?: string;
  nota?: string;
}