import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Card1 from '../../components/common/cards/card1';
import Card2 from '../../components/common/cards/card2';
import Header from '../../components/common/headings/header';
import MainContainer from '../../components/common/containers/mainContainer';
import PieChartCard2 from '../../components/common/charts/pieChartCard2';
import customBudgetData from './customChartDashboard';
import Header2 from '../../components/common/headings/header2';
import OutlinedButton from '../../components/common/buttons/outlinedButton';
import LinkButton from '../../components/common/buttons/linkButton';
import SolidButton from '../../components/common/buttons/solidButton';
import BalanceCard from '../../components/common/cards/BalanceCard';

export default function DashboardScreen() {
  // Ejemplo de datos personalizados con valores monetarios

  return (
    <ScrollView>
      <MainContainer>
        <Header title="Welcome again!" description="Here's your financial overview." />
        <BalanceCard />
        
        {/* Gráfico con preset de expenses - muestra total automáticamente */}
        <Card2 
          title="Monthly Spending Breakdown" 
          graphic={<PieChartCard2 chartType="expenses" />} 
          description="Your detailed expense breakdown with total amount" 
        />
        
        {/* Gráfico con preset de goals - sin total */}
        <Card2 
          title="Goals Status" 
          graphic={<PieChartCard2 chartType="goals" showTotal={false} />} 
          description="Track your goal completion!" 
        />
        
        {/* Gráfico con datos personalizados - con total personalizado */}
        <Card2 
          title="Budget Analysis" 
          graphic={
            <PieChartCard2 
              data={customBudgetData} 
              totalLabel="Total Budget"
              currency="$"
            />
          } 
          description="Monitor your budget usage effectively!" 
        />

          <Header2 title="Recent transactions" button={<LinkButton text="View all" />} />        
      </MainContainer>
    </ScrollView> 
  );
}
  
