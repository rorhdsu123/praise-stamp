import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBH0LR94NyqTqZdlXE2rqvE7QZ4fJdCghA",
  authDomain: "praise-stamp.firebaseapp.com",
  databaseURL: "https://praise-stamp-default-rtdb.firebaseio.com",
  projectId: "praise-stamp",
  storageBucket: "praise-stamp.firebasestorage.app",
  messagingSenderId: "1040368164731",
  appId: "1:1040368164731:web:35437464beb48f938ca7de"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
