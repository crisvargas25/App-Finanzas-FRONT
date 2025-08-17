import React from 'react';
import { View } from 'react-native';
import { PieChart, PieChartData } from '../../ui/pieChart';
import { Text } from '../../ui/text';

interface PieChartCard2Props {
  data?: PieChartData[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  paddingLeft?: string;
  center?: number[];
  backgroundColor?: string;
  chartType?: 'expenses' | 'goals' | 'categories' | 'custom';
  showTotal?: boolean;
  currency?: string;
  totalLabel?: string;
}

// Diferentes conjuntos de datos predefinidos
const dataPresets = {
  expenses: [
    {
      name: 'Food',
      population: 450, // $450
      color: '#122c6f',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Transport',
      population: 200, // $200
      color: '#4ECDC4',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Bills',
      population: 180, // $180
      color: '#45B7D1',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Entertainment',
      population: 120, // $120
      color: '#9C27B0',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Savings',
      population: 300, // $300
      color: '#FFCA28',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
  ],

  goals: [
    {
      name: 'Completed',
      population: 40,
      color: '#122c6f',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'In Progress',
      population: 35,
      color: '#4ECDC4',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Pending',
      population: 25,
      color: '#45B7D1',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
  ],

  categories: [
    {
      name: 'Category A',
      population: 50,
      color: '#122c6f',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Category B',
      population: 30,
      color: '#4ECDC4',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
    {
      name: 'Category C',
      population: 20,
      color: '#45B7D1',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
  ],

  custom: [
    {
      name: 'Item 1',
      population: 100,
      color: '#607D8B',
      legendFontColor: '#a6a6a6',
      legendFontSize: 12,
    },
  ],
};

// Función para calcular el total gastado
const calculateTotal = (data: PieChartData[]): number => {
  return data.reduce((total, item) => total + item.population, 0);
};

// Función para formatear moneda
const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function PieChartCard2({
  data,
  width = 280,
  height = 180,
  showLegend = true,
  paddingLeft = "0",
  center = [2, 0],
  backgroundColor = 'transparent',
  chartType = 'expenses',
  showTotal = true,
  currency = '$',
  totalLabel = 'Total Spent'
}: PieChartCard2Props) {
  // Si no se proporcionan datos, usar el preset según el tipo
  const chartData = data || dataPresets[chartType];
  
  // Calcular el total solo si es de tipo expenses y showTotal es true
  const shouldShowTotal = showTotal && (chartType === 'expenses' || data);
  const totalAmount = shouldShowTotal ? calculateTotal(chartData) : 0;

  return (
    <View>
      <PieChart
        data={chartData}
        width={width}
        height={height}
        paddingLeft={paddingLeft}
        center={center}
        hasLegend={showLegend}
        backgroundColor={backgroundColor}
      />
      {shouldShowTotal && (
        <View style={{ marginTop: 9, alignItems: 'center' }}>
          <Text size="sm" type="blackText" style={{ fontWeight: '600', color: '#a6a6a6' }}>
            {totalLabel}: {formatCurrency(totalAmount, currency)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default PieChartCard2;
