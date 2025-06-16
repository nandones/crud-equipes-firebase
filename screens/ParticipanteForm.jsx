import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

export default function ParticipanteForm({ navigation, route }) {
  const { equipeId, participante } = route.params;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');

  useEffect(() => {
    if (participante) {
      setNome(participante.nome);
      setEmail(participante.email);
      setFuncao(participante.funcao || '');
    }
  }, [participante]);

  const validarParticipantes = async () => {
    const equipeRef = doc(db, 'equipes', equipeId);
    const equipeSnap = await getDoc(equipeRef);
    
    if (equipeSnap.exists()) {
      const equipeData = equipeSnap.data();
      if (equipeData.participantes && equipeData.participantes.length >= 5 && !participante) {
        Alert.alert('Limite atingido', 'Cada equipe pode ter no máximo 5 participantes');
        return false;
      }
    }
    return true;
  };

  const salvarParticipante = async () => {
    if (!nome || !email) {
      Alert.alert('Atenção', 'Nome e email são obrigatórios');
      return;
    }

    const podeAdicionar = await validarParticipantes();
    if (!podeAdicionar) return;

    try {
      if (participante) {
        await updateDoc(doc(db, 'participantes', participante.id), { nome, email, funcao });
      } else {
        const participanteRef = await addDoc(collection(db, 'participantes'), {
          nome,
          email,
          funcao,
          equipeId
        });
        
        // Adiciona o ID do participante à equipe
        const equipeRef = doc(db, 'equipes', equipeId);
        await updateDoc(equipeRef, {
          participantes: [...(equipeSnap.data().participantes || []), participanteRef.id]
        });
      }
      navigation.goBack();
      console.log('Participante salvo com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o participante');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput 
        placeholder="Nome*" 
        value={nome} 
        onChangeText={setNome} 
        style={{ marginBottom: 10 }} 
      />
      <TextInput 
        placeholder="Email*" 
        value={email} 
        onChangeText={setEmail} 
        style={{ marginBottom: 10 }} 
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Função" 
        value={funcao} 
        onChangeText={setFuncao} 
        style={{ marginBottom: 10 }} 
      />
      <Button title="Salvar" onPress={salvarParticipante} />
    </View>
  );
}