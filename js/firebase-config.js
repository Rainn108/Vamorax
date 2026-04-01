// ===== FIREBASE CONFIGURATION =====
// Proyek: webbang-32962
const firebaseConfig = {
  apiKey: "AIzaSyAodUP4ovThYhIqyYSWnhtpL_KrhB6pILo",
  authDomain: "webbang-32962.firebaseapp.com",
  projectId: "webbang-32962",
  storageBucket: "webbang-32962.firebasestorage.app",
  messagingSenderId: "721233682498",
  appId: "1:721233682498:web:4f6148d2424f7fe9174ddb",
  measurementId: "G-DP212LNDK8"
};

// Initialize Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// Initialize Authentication & Provider Google
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  signOut, 
  sendEmailVerification,
  GoogleAuthProvider, // Tambahan untuk Google
  signInWithPopup    // Tambahan untuk Google (Anti-Looping)
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firestore
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Storage
import { 
  getStorage, 
  ref, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Inisialisasi App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider(); // Buat instance provider di sini

// Export semua yang dibutuhkan
export { 
  app, auth, db, storage, googleProvider, // Export provider juga
  RecaptchaVerifier, signInWithPhoneNumber,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, signOut, sendEmailVerification,
  signInWithPopup, // Export fungsinya
  doc, setDoc, getDoc, updateDoc, collection, addDoc,
  query, where, getDocs, serverTimestamp, ref, getDownloadURL
};
