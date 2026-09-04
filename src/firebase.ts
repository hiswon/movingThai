// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD85xjsi1kOwrkTg0_trsMbR4kKEbLiYtQ",
  authDomain: "thaigl-87d0d.firebaseapp.com",
  projectId: "thaigl-87d0d",
  storageBucket: "thaigl-87d0d.firebasestorage.app",
  messagingSenderId: "427244341724",
  appId: "1:427244341724:web:09db1da79ebcd6bb8ea719",
  measurementId: "G-WE4ZWY3ZV6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);