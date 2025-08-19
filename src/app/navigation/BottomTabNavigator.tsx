import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../../features/dashboard/DashboardScreen';
import TransactionsScreen from '../../features/transactions/screens/TransactionsScreen';
import BudgetScreen from '../../features/budgets/BudgetScreen';
import SavingsGoalsScreen from '../../features/goals/SavingsGoalsScreen';
import CategoriesScreen from '../../features/categories/CategoriesScreen';

export type BottomTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Budget: undefined;
  Goals: undefined;
  Categories: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Budget':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Goals':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Categories':
              iconName = focused ? 'pricetag' : 'pricetag-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3533cd',
        tabBarInactiveTintColor: '#373643',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ tabBarLabel: 'Transactions' }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ tabBarLabel: 'Budgets' }}
      />
      <Tab.Screen
        name="Goals"
        component={SavingsGoalsScreen}
        options={{ tabBarLabel: 'Goals' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Categories' }}
      />
    </Tab.Navigator>
  );
}
