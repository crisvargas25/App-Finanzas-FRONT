# CRUD de Transacciones - Documentación

## Descripción General

El CRUD de transacciones permite a los usuarios **Crear, Leer, Actualizar y Eliminar** transacciones financieras en la aplicación. Cada transacción incluye información como tipo (ingreso/gasto), monto, categoría, presupuesto opcional y notas.

## Estructura de Datos

### Campos de Transacción

- **id** (INT, PK, AI): Identificador único generado automáticamente por el backend
- **usuario_id** (INT, FK): Usuario que realizó la transacción (generado por el backend)
- **tipo** (ENUM): 'income' (ingreso) o 'outcome' (gasto)
- **monto** (DECIMAL): Cantidad de dinero de la transacción
- **fecha** (DATETIME): Fecha y hora generada automáticamente por el backend
- **categoria_id** (INT, FK): Categoría de la transacción (Food, Transportation, etc.)
- **presupuesto_id** (INT, FK, opcional): Presupuesto asociado (si aplica)
- **nota** (TEXT, opcional): Descripción adicional (ej. "Hotel 2 noches")

### Categorías Disponibles

- Comida
- Transporte
- Alojamiento
- Entretenimiento
- Salario
- Otros

## Componentes Principales

### 1. `TransactionsScreen.tsx`
Pantalla principal que muestra:
- **Resumen financiero**: Balance total, ingresos totales, gastos totales
- **Lista de transacciones**: Todas las transacciones del usuario
- **Botón flotante (+)**: Para agregar nuevas transacciones
- **Pull-to-refresh**: Para actualizar los datos

### 2. `TransactionForm.tsx`
Modal para crear/editar transacciones con:
- **Selector de tipo**: Botones para elegir ingreso o gasto
- **Campo de monto**: Input numérico
- **Selector de categoría**: Botones horizontales
- **Selector de presupuesto**: Botones horizontales (opcional)
- **Campo de nota**: Textarea para descripción adicional

### 3. `TransactionCard.tsx`
Tarjeta individual que muestra:
- **Indicador visual**: Flecha arriba (ingreso) o abajo (gasto) con colores
- **Monto**: Formateado como moneda
- **Detalles**: Categoría, presupuesto, fecha
- **Acciones**: Botones para editar y eliminar

### 4. `useTransactions.ts`
Hook personalizado que maneja:
- **Estado**: Transacciones, categorías, presupuestos, loading, errores
- **API calls**: Crear, leer, actualizar, eliminar
- **Fallback**: Datos mock cuando la API no está disponible

## Funcionalidades del CRUD

### ✅ **CREATE** (Crear)
- Toca el botón flotante "+" 
- Completa el formulario
- Selecciona tipo, monto, categoría
- Opcionalmente selecciona presupuesto y agrega nota
- Toca "Guardar"

### ✅ **READ** (Leer)
- Las transacciones se cargan automáticamente al abrir la pantalla
- Desliza hacia abajo para refrescar
- Visualiza resumen financiero en la parte superior
- Scroll infinito en la lista de transacciones

### ✅ **UPDATE** (Actualizar)
- Toca el ícono de lápiz en cualquier transacción
- Modifica los campos deseados en el formulario
- Toca "Guardar" para confirmar cambios

### ✅ **DELETE** (Eliminar)
- Toca el ícono de basura en cualquier transacción
- Confirma la eliminación en el diálogo de alerta
- La transacción se elimina inmediatamente

## Estados de la Aplicación

### Loading States
- Indicadores de carga durante operaciones de API
- Botones deshabilitados durante el guardado
- Pull-to-refresh spinner

### Error States
- Pantalla de error con botón de reintento
- Alertas para operaciones fallidas
- Fallback a datos mock si la API no está disponible

### Empty States
- Mensaje y ícono cuando no hay transacciones
- Call-to-action para agregar la primera transacción

## Integración con Backend

### Endpoints Esperados
```
GET    /api/transactions       - Obtener todas las transacciones
POST   /api/transactions       - Crear nueva transacción  
PUT    /api/transactions/:id   - Actualizar transacción
DELETE /api/transactions/:id   - Eliminar transacción
GET    /api/categories         - Obtener categorías
GET    /api/budgets           - Obtener presupuestos
```

### Headers Requeridos
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Características Técnicas

### ✨ **Responsive Design**
- Adaptable a diferentes tamaños de pantalla
- Interfaz táctil optimizada para móviles

### ✨ **Offline Support**
- Funciona con datos mock cuando no hay conexión
- Sincronización automática cuando se restablece la conexión

### ✨ **UX Optimizada**
- Animaciones suaves
- Feedback visual inmediato
- Confirmaciones para acciones destructivas

### ✨ **Accesibilidad**
- Colores semánticamente correctos (verde para ingresos, rojo para gastos)
- Íconos intuitivos
- Textos descriptivos

## Uso y Navegación

1. **Acceder**: Navega a la pantalla "Transacciones" desde el menú principal
2. **Agregar**: Toca el botón "+" flotante para crear una nueva transacción
3. **Ver**: Scroll por la lista para ver todas las transacciones
4. **Editar**: Toca el ícono de lápiz en cualquier transacción
5. **Eliminar**: Toca el ícono de basura y confirma la eliminación
6. **Refrescar**: Desliza hacia abajo para actualizar los datos

## Próximas Mejoras

- [ ] Filtros por fecha, categoría, tipo
- [ ] Búsqueda por texto en notas
- [ ] Exportación de datos (CSV, PDF)
- [ ] Gráficos de gastos por categoría
- [ ] Notificaciones push para recordatorios
- [ ] Sincronización en tiempo real
- [ ] Modo oscuro
- [ ] Múltiples monedas
