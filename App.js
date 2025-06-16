import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EquipeList from './screens/EquipeList';
import EquipeForm from './screens/EquipeForm';
import ParticipanteList from './screens/ParticipanteList';
import ParticipanteForm from './screens/ParticipanteForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Equipes">
        <Stack.Screen name="Equipes" component={EquipeList} />
        <Stack.Screen name="Nova Equipe" component={EquipeForm} />
        <Stack.Screen name="Participantes" component={ParticipanteList} />
        <Stack.Screen name="Novo Participante" component={ParticipanteForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}