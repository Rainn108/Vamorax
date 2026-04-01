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

// Initialize Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Inisialisasi Provider Sosial
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { 
  auth, db, googleProvider, facebookProvider, appleProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
};
