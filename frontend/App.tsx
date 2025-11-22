// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { AddPlantScreen } from './screens/AddPlantScreen';
// import { PlantDetailsScreen } from './src/screens/PlantDetailsScreen';

// Theme customization
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4caf50',
    secondary: '#8bc34a',
    tertiary: '#81c784',
  },
};

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Navigation
type RootStackParamList = {
  Home: undefined;
  AddPlant: undefined;
  PlantDetails: { plantId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#4caf50" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPlant" component={AddPlantScreen} />
            {/* <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}