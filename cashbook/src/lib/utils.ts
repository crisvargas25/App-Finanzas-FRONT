import clsx from 'clsx';
import { format } from 'date-fns';

export function cn(...inputs: any[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: string = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), 'dd/MM/yyyy');
}