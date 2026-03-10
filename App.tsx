import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import CharacterListScreen from './src/screens/CharacterListScreen';
import CharacterDetailScreen from './src/screens/CharacterDetailScreen';
import { RootStackParamList } from './src/types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0066cc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={CharacterListScreen}
          options={{ title: 'Disney Explorer' }}
        />
        <Stack.Screen
          name="Detail"
          component={CharacterDetailScreen}
          options={{ title: 'Détails du Personnage' }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
