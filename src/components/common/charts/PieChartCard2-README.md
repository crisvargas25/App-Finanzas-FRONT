# PieChartCard2 - Componente Reutilizable

## Descripción
`PieChartCard2` es un componente reutilizable para mostrar gráficos de pastel dentro de cards. Puede utilizarse para mostrar diferentes tipos de información financiera y de progreso.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `data` | `PieChartData[]` | `undefined` | Datos personalizados para el gráfico |
| `width` | `number` | `280` | Ancho del gráfico |
| `height` | `number` | `180` | Alto del gráfico |
| `showLegend` | `boolean` | `true` | Mostrar o ocultar la leyenda |
| `paddingLeft` | `string` | `"0"` | Padding izquierdo |
| `center` | `number[]` | `[2, 0]` | Posición del centro del gráfico |
| `backgroundColor` | `string` | `'transparent'` | Color de fondo |
| `chartType` | `'expenses' \| 'goals' \| 'categories' \| 'custom'` | `'expenses'` | Tipo de preset a utilizar |
| `showTotal` | `boolean` | `true` | Mostrar el total calculado debajo del gráfico |
| `currency` | `string` | `'$'` | Símbolo de moneda para mostrar |
| `totalLabel` | `string` | `'Total Spent'` | Etiqueta para el total mostrado |

## Funcionalidades Nuevas

### 🧮 **Cálculo Automático de Totales**
El componente ahora incluye una función que suma automáticamente todos los valores del gráfico y los muestra debajo en formato de moneda.

### 💰 **Formateo de Moneda**
Los totales se muestran con formato de moneda, incluyendo separadores de miles y decimales.

## Tipos de Presets Disponibles

### 1. `expenses` (Default) - **Con Total Automático**
- Food ($450) - Rojo
- Transport ($200) - Verde azulado  
- Bills ($180) - Azul
- Entertainment ($120) - Púrpura
- Savings ($300) - Amarillo
- **Total mostrado: $1,250.00**

### 2. `goals`
- Completed (40%) - Cian
- In Progress (35%) - Naranja
- Pending (25%) - Rojo

### 3. `categories`
- Category A (50%) - Púrpura
- Category B (30%) - Azul
- Category C (20%) - Verde

### 4. `custom`
- Item 1 (100%) - Gris azulado

## Ejemplos de Uso

### Uso Básico con Total Automático
```tsx
// Expenses con total automático (default)
<PieChartCard2 chartType="expenses" />

// Goals sin total
<PieChartCard2 chartType="goals" showTotal={false} />

// Con etiqueta personalizada
<PieChartCard2 
  chartType="expenses" 
  totalLabel="Gastos Totales"
  currency="€"
/>
```

### Uso con Datos Personalizados y Total
```tsx
const expenseData = [
  {
    name: 'Groceries',
    population: 350, // $350
    color: '#FF6B6B',
    legendFontColor: '#333333',
    legendFontSize: 12,
  },
  {
    name: 'Gas',
    population: 120, // $120
    color: '#4ECDC4',
    legendFontColor: '#333333',
    legendFontSize: 12,
  },
];

<PieChartCard2 
  data={expenseData} 
  totalLabel="Monthly Expenses"
  currency="$"
/>
// Mostrará: Monthly Expenses: $470.00
```

### Personalización Avanzada
```tsx
<PieChartCard2 
  data={customData}
  width={300}
  height={200}
  showLegend={false}
  paddingLeft="20"
  center={[10, 20]}
  backgroundColor="#f5f5f5"
/>
```

### Dentro de Card2
```tsx
<Card2 
  title="Budget Analysis" 
  graphic={<PieChartCard2 chartType="expenses" />} 
  description="Your monthly budget breakdown" 
/>
```

## Estructura de Datos

```typescript
interface PieChartData {
  name: string;          // Nombre del segmento
  population: number;    // Valor/porcentaje del segmento
  color: string;         // Color del segmento (hex)
  legendFontColor: string; // Color del texto en la leyenda
  legendFontSize: number;  // Tamaño de fuente de la leyenda
}
```

## Colores Recomendados

```typescript
const colorPalette = {
  primary: '#FF6B6B',    // Rojo coral
  secondary: '#4ECDC4',  // Verde azulado
  accent: '#45B7D1',     // Azul cielo
  success: '#4CAF50',    // Verde
  warning: '#FFA726',    // Naranja
  error: '#EF5350',      // Rojo
  info: '#26C6DA',       // Cian
  purple: '#9C27B0',     // Púrpura
  indigo: '#3F51B5',     // Índigo
  teal: '#009688',       // Verde azulado oscuro
};
```

## Casos de Uso Comunes

1. **Análisis de Gastos**: Mostrar distribución de gastos por categoría
2. **Progreso de Metas**: Visualizar el estado de cumplimiento de objetivos
3. **Análisis de Presupuesto**: Comparar presupuesto usado vs disponible
4. **Distribución de Ingresos**: Mostrar fuentes de ingresos
5. **Análisis de Inversiones**: Visualizar cartera de inversiones
