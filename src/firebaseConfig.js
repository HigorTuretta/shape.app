// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Adiciona o GoogleAuthProvider
import { getFirestore } from "firebase/firestore"; // Firestore (Banco de Dados)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2GoHfDcB4eY52TvDAXQGuGsN3Yv11BVA",
  authDomain: "shape-cb9f9.firebaseapp.com",
  projectId: "shape-cb9f9",
  storageBucket: "shape-cb9f9.appspot.com",
  messagingSenderId: "947367947062",
  appId: "1:947367947062:web:6a9f43ee20cbad448aa197",
  measurementId: "G-JTZ6FBCNNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore (Database) and Auth (Authentication)
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Google Authentication Provider

// Export db, auth, and googleProvider
export { db, auth, googleProvider };
