import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAAB7k2N_3-w6FfykeoTT6djbZPzroxxRk',
  authDomain: 'crud-equipes.firebaseapp.com',
  projectId: 'crud-equipes',
  storageBucket: 'crud-equipes.firebasestorage.app',
  messagingSenderId: '813539379347',
  appId: '1:813539379347:web:749ecc99751b7b79676566',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };