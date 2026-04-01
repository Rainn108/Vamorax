import { 
  auth, googleProvider, facebookProvider, appleProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from './firebase-config.js';
import { showToast } from './ui.js';

export const isLoggedIn = () => !!auth.currentUser;

// Fungsi Social Login (Google, FB, Apple)
export async function loginSocial(type) {
  let provider = type === 'google' ? googleProvider : type === 'facebook' ? facebookProvider : appleProvider;
  try {
    const result = await signInWithPopup(auth, provider);
    showToast(`Welcome ${result.user.displayName}! 🎉`, 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') showToast(err.message, 'error');
  }
}

export function initLoginPage() {
  const emailForm = document.querySelector('#email-login-form');
  const registerForm = document.querySelector('#register-form');

  emailForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back!', 'success');
      window.location.href = 'dashboard.html';
    } catch (err) { showToast(err.message, 'error'); }
  });

  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast('Account created!', 'success');
      window.location.href = 'dashboard.html';
    } catch (err) { showToast(err.message, 'error'); }
  });
}
