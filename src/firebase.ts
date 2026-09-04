// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyABsS0eblW6rBz5nveIVp7hAs3q61XMjlA",
  authDomain: "thaitalk-36d2b.firebaseapp.com",
  projectId: "thaitalk-36d2b",
  storageBucket: "thaitalk-36d2b.firebasestorage.app",
  messagingSenderId: "76341039534",
  appId: "1:76341039534:web:2b031bbfcaf377cb86f83f",
  measurementId: "G-XCRD1491PG"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);