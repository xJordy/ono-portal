import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAvMocjs6fji_7EsMi9_EidffGcnr0_uNA",
  authDomain: "react-final-fe.firebaseapp.com",
  projectId: "react-final-fe",
  storageBucket: "react-final-fe.firebasestorage.app",
  messagingSenderId: "752596702766",
  appId: "1:752596702766:web:dc33e727ec595fc26271bf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
