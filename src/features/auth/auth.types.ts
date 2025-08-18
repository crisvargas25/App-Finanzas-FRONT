export type AuthTab = 'login' | 'signup';

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  currency: string;
  role?: { type: 'user'}[]; // Opcional, pero refleja el cuerpo enviado
}

export interface UseAuthFormReturn {
  activeTab: AuthTab;
  handleTabChange: (tab: AuthTab) => void;

  // Login
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleLogin: () => Promise<void>;

  // SignUp
  name: string;
  setName: (value: string) => void;
  confirmEmail: string;
  setConfirmEmail: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  handleSignUp: () => Promise<void>;
}