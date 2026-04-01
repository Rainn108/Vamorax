// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyAodUP4ovThYhIqyYSWnhtpL_KrhB6pILo",
  authDomain: "webbang-32962.firebaseapp.com",
  projectId: "webbang-32962",
  storageBucket: "webbang-32962.firebasestorage.app",
  messagingSenderId: "721233682498",
  appId: "1:721233682498:web:4f6148d2424f7fe9174ddb",
  measurementId: "G-DP212LNDK8"
};

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  signOut, 
  sendEmailVerification,
  GoogleAuthProvider, 
  FacebookAuthProvider, // <--- Tambahan Facebook
  OAuthProvider,        // <--- Tambahan Apple
  signInWithPopup    
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Inisialisasi
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Inisialisasi Provider
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com'); // Provider Apple

export { 
  app, auth, db, storage, 
  googleProvider, facebookProvider, appleProvider, // Export semua provider
  RecaptchaVerifier, signInWithPhoneNumber,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut, sendEmailVerification,
  signInWithPopup,
  doc, setDoc, getDoc, updateDoc, collection, addDoc,
  query, where, getDocs, serverTimestamp, ref, getDownloadURL
};
