import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrKfcK8rypaFrYlx_YyVQj3ZdcEtzLXCM",
  authDomain: "saromc1-c47c0.firebaseapp.com",
  projectId: "saromc1-c47c0",
  storageBucket: "saromc1-c47c0.firebasestorage.app",
  messagingSenderId: "299939581133",
  appId: "1:299939581133:web:d21453cbf809d2ecccad84",
  measurementId: "G-8QBD1EHGC1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, signInWithPopup, signOut };
