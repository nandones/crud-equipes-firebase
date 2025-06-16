import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function ParticipanteList({ navigation, route }) {
  const { equipeId } = route.params;
  const [participantes, setParticipantes] = useState([]);
  const [equipe, setEquipe] = useState(null);

  useEffect(() => {
    // Carrega dados da equipe
    const equipeUnsubscribe = onSnapshot(doc(db, 'equipes', equipeId), (doc) => {
      if (doc.exists()) {
        setEquipe({ id: doc.id, ...doc.data() });
      }
    });

    // Carrega participantes da equipe
    const q = query(collection(db, 'participantes'), where('equipeId', '==', equipeId));
    const participantesUnsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipantes(lista);
    });

    return () => {
      equipeUnsubscribe();
      participantesUnsubscribe();
    };
  }, [equipeId]);

  const removerParticipante = async (id) => {
    try {
      // Remove o participante
      await deleteDoc(doc(db, 'participantes', id));
      
      // Remove o ID do participante da equipe
      const updatedParticipantes = equipe.participantes.filter(pid => pid !== id);
      await updateDoc(doc(db, 'equipes', equipeId), {
        participantes: updatedParticipantes
      });
      
      Alert.alert('Sucesso', 'Participante removido com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o participante');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {equipe && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Equipe: {equipe.nome}</Text>
          <Text>Total de participantes: {participantes.length}/5</Text>
        </View>
      )}

      <Button 
        title="Novo Participante" 
        onPress={() => {
          if (participantes.length >= 5) {
            Alert.alert('Limite atingido', 'Cada equipe pode ter no máximo 5 participantes');
          } else {
            navigation.navigate('Novo Participante', { equipeId });
          }
        }} 
      />

      <FlatList
        data={participantes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>Email: {item.email}</Text>
            {item.funcao && <Text>Função: {item.funcao}</Text>}
            
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Button title="Editar" onPress={() => navigation.navigate('Novo Participante', { participante: item, equipeId })} />
              <Button title="Excluir" onPress={() => removerParticipante(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}