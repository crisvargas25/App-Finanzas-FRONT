import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export interface PieChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  backgroundColor?: string;
  paddingLeft?: string;
  center?: number[];
  absolute?: boolean;
  hasLegend?: boolean;
}

const defaultChartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 0,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

export function PieChart({
  data,
  width = screenWidth - 32,
  height = 220,
  backgroundColor = 'transparent',
  paddingLeft = '12',
  center = [10, 50],
  absolute = false,
  hasLegend = true
}: PieChartProps) {
  return (
    <View style={{ backgroundColor }}>
      <RNPieChart
        data={data}
        width={width}
        height={height}
        chartConfig={defaultChartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft={paddingLeft}
        center={center}
        absolute={absolute}
        hasLegend={hasLegend}
      />
    </View>
  );
}