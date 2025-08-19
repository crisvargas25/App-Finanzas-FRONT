// filepath: d:\2025\Cashbook\cashbook-front\src\lib\utils.ts
//Esto se usa para unir clases de tailwind y evitar conflictos y duplicados
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}