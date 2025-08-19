import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FirstScreen from '../../features/auth/screens/FirstScreen';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import ForgetPassScreen from '../../features/auth/screens/ForgetPassScreen';

export type AuthStackParamList = {
  FirstScreen: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgetPass: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FirstScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgetPass" component={ForgetPassScreen} />
    </Stack.Navigator>
  );
}