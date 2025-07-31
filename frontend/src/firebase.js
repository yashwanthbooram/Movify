import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIs8S6f90cxkmpjVSopcXRfMm7wERBtHo",
  authDomain: "movify-app-a2316.firebaseapp.com",
  projectId: "movify-app-a2316",
  storageBucket: "movify-app-a2316.firebasestorage.app",
  messagingSenderId: "210297340730",
  appId: "1:210297340730:web:10370c075e3f6b4230c603",
  measurementId: "G-FY5KSK2C7Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
