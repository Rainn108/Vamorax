// ===== AUTHENTICATION WITH FIREBASE =====
import { 
  auth, googleProvider, facebookProvider, appleProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from './firebase-config.js';
import { showToast, showConfirm } from './ui.js';

export function getCurrentUser() { return auth.currentUser; }
export function isLoggedIn() { return !!auth.currentUser; }

export function logout() {
  showConfirm('Are you sure you want to sign out?', async () => {
    await signOut(auth);
    showToast('Signed out', 'info');
    setTimeout(() => window.location.href = 'index.html', 800);
  });
}

// Social Login Logic
export async function loginSocial(type) {
  let provider;
  if (type === 'google') provider = googleProvider;
  else if (type === 'facebook') provider = facebookProvider;
  else if (type === 'apple') provider = appleProvider;

  try {
    const result = await signInWithPopup(auth, provider);
    showToast(`Welcome ${result.user.displayName}! 🎉`, 'success');
    const redirect = localStorage.getItem('auth_redirect') || 'dashboard.html';
    localStorage.removeItem('auth_redirect');
    setTimeout(() => window.location.href = redirect, 1000);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast('Login failed: ' + err.message, 'error');
    }
  }
}

export function initLoginPage() {
  const emailForm = document.querySelector('#email-login-form');
  const registerForm = document.querySelector('#register-form');

  emailForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = emailForm.querySelector('[name="email"]').value;
    const password = emailForm.querySelector('[name="password"]').value;
    const btn = emailForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Signing in...';
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back! 🎉', 'success');
      window.location.href = 'dashboard.html';
    } catch (err) {
      showToast('Login failed: ' + err.message, 'error');
      btn.disabled = false; btn.textContent = 'Sign In';
    }
  });

  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = registerForm.querySelector('[name="email"]').value;
    const password = registerForm.querySelector('[name="password"]').value;
    const btn = registerForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Creating account...';
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast('Account created! 🎉', 'success');
      window.location.href = 'dashboard.html';
    } catch (err) {
      showToast('Registration failed: ' + err.message, 'error');
      btn.disabled = false; btn.textContent = 'Create Account';
    }
  });
}

export function initDashboard() {
  onAuthStateChanged(auth, (user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    const emailEl = document.querySelector('.dashboard-user-email');
    if (emailEl) emailEl.textContent = user.email;
    document.querySelector('.logout-btn')?.addEventListener('click', logout);
  });
}
