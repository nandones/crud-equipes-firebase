import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function EquipeList({ navigation }) {
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'equipes'), snapshot => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEquipes(lista);
    });

    return () => unsubscribe();
  }, []);

  const removerEquipe = async (id) => {
    try {
      await deleteDoc(doc(db, 'equipes', id));
      Alert.alert('Sucesso', 'Equipe removida com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a equipe');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Nova Equipe" onPress={() => navigation.navigate('Nova Equipe')} />
      <FlatList
        data={equipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.nome}</Text>
            {item.descricao && <Text>{item.descricao}</Text>}
            <Text>Participantes: {item.participantes?.length || 0}/5</Text>
            
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Button title="Editar" onPress={() => navigation.navigate('Nova Equipe', { equipe: item })} />
              <Button title="Participantes" onPress={() => navigation.navigate('Participantes', { equipeId: item.id })} />
              <Button title="Excluir" onPress={() => removerEquipe(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}