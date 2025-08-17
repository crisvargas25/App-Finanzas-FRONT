import { useState } from 'react';

interface UseToggleVisibilityReturn {
  isVisible: boolean;
  toggleVisibility: () => void;
  hideValue: (value: string, replacement?: string) => string;
}

export const useToggleVisibility = (initialValue: boolean = false): UseToggleVisibilityReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(initialValue);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  const hideValue = (value: string, replacement: string = '****'): string => {
    if (isVisible) {
      return value;
    }
    
    // Para números de tarjeta, mostrar solo los últimos 4 dígitos
    if (value.includes('****')) {
      return value; // Ya está oculto
    }
    
    // Si es un número de tarjeta completo, ocultar todo excepto los últimos 4 dígitos
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 4) {
      const lastFour = digits.slice(-4);
      return `**** **** **** ${lastFour}`;
    }
    
    return replacement;
  };

  return {
    isVisible,
    toggleVisibility,
    hideValue
  };
};
