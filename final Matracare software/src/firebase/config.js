// Firebase Configuration — MatraCare
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqXvcWKVniu8JtZgBS4vx7mrmKwkEYTEc",
  authDomain: "matracare-app.firebaseapp.com",
  projectId: "matracare-app",
  storageBucket: "matracare-app.firebasestorage.app",
  messagingSenderId: "33450814219",
  appId: "1:33450814219:web:837a4ed3a560de29aa500e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
