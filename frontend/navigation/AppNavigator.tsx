// frontend/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddPlantScreen } from '../screens/AddPlantScreen';
import { PlantDetailsScreen } from '../screens/PlantDetailsScreen';
import { EditPlantScreen } from '../screens/EditPlantScreen';

// Definir tipos das rotas e parâmetros
export type RootStackParamList = {
  Home: undefined;
  AddPlant: undefined;
  PlantDetails: { plantId: number };
  EditPlant: { plantId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'PlantCare' }}
      />
      <Stack.Screen 
        name="AddPlant" 
        component={AddPlantScreen}
        options={{ title: 'Adicionar Planta' }}
      />
      <Stack.Screen 
        name="PlantDetails" 
        component={PlantDetailsScreen}
        options={{ title: 'Detalhes da Planta' }}
      />
      <Stack.Screen 
        name="EditPlant" 
        component={EditPlantScreen}
        options={{ title: 'Editar Planta' }}
      />
    </Stack.Navigator>
  );
};