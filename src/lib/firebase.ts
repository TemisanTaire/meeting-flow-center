
// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBRvJigVXsTPXr5pr76kciJ9Vw3sFC7dg",
  authDomain: "hackthestack.firebaseapp.com",
  projectId: "hackthestack",
  storageBucket: "hackthestack.firebasestorage.app",
  messagingSenderId: "525894234073",
  appId: "1:525894234073:web:0fdbeaad6976c28c49f3c8",
  measurementId: "G-QHBN5T26RK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
