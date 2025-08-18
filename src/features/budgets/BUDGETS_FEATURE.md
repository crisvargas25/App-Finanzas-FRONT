# Budgets Feature

Esta funcionalidad permite la gestión completa de presupuestos en la aplicación de cashbook.

## Estructura de archivos

```
budgets/
├── AddBudgetScreen.tsx          # Pantalla para agregar presupuestos
├── BudgetScreen.tsx             # Pantalla principal con lista de presupuestos
├── components/
│   ├── BudgetCard.tsx           # Componente tarjeta de presupuesto
│   ├── BudgetForm.tsx           # Formulario para crear/editar presupuestos
│   └── index.ts                 # Exportaciones de componentes
├── hooks/
│   ├── useBudgets.ts            # Hook principal para manejo de presupuestos
│   └── index.ts                 # Exportaciones de hooks
└── screens/
    └── BudgetDetailScreen.tsx   # Pantalla de detalles del presupuesto
```

## Modelo de datos

El presupuesto (`Budget`) tiene la siguiente estructura:

```typescript
interface Budget {
  id: number;                    // ID único (generado por backend)
  usuario_id?: number;           // ID del usuario (asignado por backend)
  nombre: string;                // Nombre del presupuesto
  monto_total: number;           // Monto total del presupuesto
  fecha_inicio: string;          // Fecha de inicio (YYYY-MM-DD)
  fecha_fin: string;             // Fecha de fin (YYYY-MM-DD)
  estado: 'active' | 'closed' | 'canceled'; // Estado del presupuesto
}
```

## Funcionalidades CRUD

### Create (Crear)
- **Hook**: `createBudget(budgetData: BudgetFormData)`
- **Pantalla**: `AddBudgetScreen` o modal en `BudgetScreen`
- **Validaciones**:
  - Nombre requerido
  - Monto mayor a 0
  - Fechas requeridas
  - Fecha fin posterior a fecha inicio

### Read (Leer)
- **Hook principal**: `useBudgets()` retorna todos los presupuestos
- **Métodos adicionales**:
  - `getBudgetById(id)`: Obtener presupuesto por ID
  - `getActiveBudgets()`: Obtener solo presupuestos activos
  - `getBudgetsByDateRange(start, end)`: Filtrar por rango de fechas

### Update (Actualizar)
- **Hook**: `updateBudget(id: number, budgetData: BudgetFormData)`
- **UI**: Modal con formulario desde `BudgetCard` o `BudgetDetailScreen`

### Delete (Eliminar)
- **Hook**: `deleteBudget(id: number)`
- **UI**: Botón de eliminar en `BudgetCard` con confirmación
- **Confirmación**: Alert antes de eliminar

## Componentes principales

### BudgetScreen
Pantalla principal que muestra:
- Lista de todos los presupuestos
- Botón para agregar nuevo presupuesto
- Pull-to-refresh
- Estados vacío y de error

### BudgetForm
Modal para crear/editar presupuestos con:
- Campos: nombre, monto, fechas, estado
- Validación en tiempo real
- Manejo de errores
- Botones de acción contextuales

### BudgetCard
Tarjeta individual que muestra:
- Nombre y estado del presupuesto
- Monto formateado como moneda
- Fechas de inicio y fin
- Botones de acción (editar/eliminar)

### BudgetDetailScreen
Pantalla de detalles con:
- Información completa del presupuesto
- Cálculos de días restantes
- Barra de progreso temporal
- Acciones de edición y eliminación

## Estados de presupuesto

- **active**: Presupuesto activo y vigente
- **closed**: Presupuesto cerrado manualmente
- **canceled**: Presupuesto cancelado

## Integración con API

Actualmente usa datos mock, pero está preparado para integración con API REST:

```typescript
// Futuras llamadas a API (comentadas en el código)
// GET /api/budgets - Listar presupuestos
// POST /api/budgets - Crear presupuesto
// PUT /api/budgets/:id - Actualizar presupuesto
// DELETE /api/budgets/:id - Eliminar presupuesto
```

## Uso en transacciones

Los presupuestos se relacionan con las transacciones a través del campo `presupuesto_id`, permitiendo categorizar gastos e ingresos dentro de presupuestos específicos.

## Navegación

La funcionalidad se integra con React Navigation:
- `BudgetScreen`: Pantalla principal accesible desde navegación
- `AddBudgetScreen`: Modal o pantalla de agregar
- `BudgetDetailScreen`: Detalles con navegación hacia atrás

## Consideraciones de UX

- Formateo de moneda según locale español
- Formateo de fechas legible
- Confirmaciones para acciones destructivas
- Estados de carga y error bien manejados
- Interfaz responsive y accesible
