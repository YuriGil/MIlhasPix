import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MinhasOfertasScreen from './screens/MinhasOfertasScreen';
import NovaOfertaScreen from './screens/NovaOfertaScreen';

export type RootStackParamList = {
  MinhasOfertas: undefined;
  NovaOferta: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MinhasOfertas"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="MinhasOfertas" component={MinhasOfertasScreen} />
          <Stack.Screen name="NovaOferta" component={NovaOfertaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}