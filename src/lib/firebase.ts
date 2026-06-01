import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8qLb5mxz9jkmu8BjJIIqSP-bgPsf6c24",
  authDomain: "aooracademy.firebaseapp.com",
  projectId: "aooracademy",
  storageBucket: "aooracademy.firebasestorage.app",
  messagingSenderId: "999799516733",
  appId: "1:999799516733:web:6b29f4d4dde1d5193d4454",
  measurementId: "G-MKYYD5F8C6",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export default app;
