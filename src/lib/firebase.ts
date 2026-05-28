import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAcNflQJvcOy_dORa0mbwI-n7Nyw-ajR0c",
  authDomain: "links-keeper-99871.firebaseapp.com",
  projectId: "links-keeper-99871",
  storageBucket: "links-keeper-99871.firebasestorage.app",
  messagingSenderId: "101466116383",
  appId: "1:101466116383:web:0fe404e8e493b7f772602a",
  measurementId: "G-9KHR4W8TVR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
