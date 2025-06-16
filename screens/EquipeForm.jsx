import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function EquipeForm({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const equipe = route.params?.equipe;

  useEffect(() => {
    if (equipe) {
      setNome(equipe.nome);
      setDescricao(equipe.descricao || '');
    }
  }, [equipe]);

  const salvarEquipe = async () => {
    if (!nome) {
      Alert.alert('Atenção', 'O nome da equipe é obrigatório');
      return;
    }

    try {
      if (equipe) {
        await updateDoc(doc(db, 'equipes', equipe.id), { nome, descricao });
      } else {
        await addDoc(collection(db, 'equipes'), { 
          nome, 
          descricao,
          participantes: [] // Array vazio para armazenar IDs dos participantes
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a equipe');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput 
        placeholder="Nome da Equipe*" 
        value={nome} 
        onChangeText={setNome} 
        style={{ marginBottom: 10 }} 
      />
      <TextInput 
        placeholder="Descrição" 
        value={descricao} 
        onChangeText={setDescricao} 
        style={{ marginBottom: 10 }} 
        multiline
      />
      <Button title="Salvar" onPress={salvarEquipe} />
      {equipe && (
        <Button 
          title="Gerenciar Participantes" 
          onPress={() => navigation.navigate('Participantes', { equipeId: equipe.id })} 
        />
      )}
    </View>
  );
}