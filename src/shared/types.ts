// Aqui tendremos los tipos globales compartidos de la aplicacion

// ===== Role =====
export type RoleType = 'user' | 'admin';

export interface Role {
  type: RoleType;
}

// ===== User =====
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password: string;
  role: Role[];
  creationDate?: string;
  deleteDate?: string;
  status: boolean;
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
