// ===== AUTHENTICATION WITH FIREBASE =====
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  appleProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from './firebase-config.js';
import { showToast, showConfirm } from './ui.js';

// Get Current User
export function getCurrentUser() {
  return auth.currentUser;
}

export function isLoggedIn() {
  return !!auth.currentUser;
}

// SIGN OUT
export function logout() {
  showConfirm('Are you sure you want to sign out?', async () => {
    try {
      await signOut(auth);
      showToast('Signed out', 'info');
      setTimeout(() => window.location.href = 'index.html', 800);
    } catch (err) {
      showToast('Error signing out', 'error');
    }
  });
}

// PROTECT ROUTE
export function requireAuth(redirectTo = 'login.html') {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.setItem('auth_redirect', window.location.href);
      window.location.href = redirectTo;
    }
  });
  return true;
}

// UPDATE NAVIGATION UI
export function updateNavAuth() {
  onAuthStateChanged(auth, (user) => {
    const loginBtns = document.querySelectorAll('.nav-login-btn');
    const userMenus = document.querySelectorAll('.nav-user-menu');
    const userAvatar = document.querySelector('.nav-user-avatar');
    
    if (user) {
      loginBtns.forEach(el => el.classList.add('hidden'));
      userMenus.forEach(el => el.classList.remove('hidden'));
      if (userAvatar) userAvatar.textContent = user.displayName?.[0] || user.email?.[0]?.toUpperCase() || '👤';
    } else {
      loginBtns.forEach(el => el.classList.remove('hidden'));
      userMenus.forEach(el => el.classList.add('hidden'));
    }
  });
}

// --- SOCIAL LOGIN LOGIC ---

// Fungsi ini kita export supaya bisa dipakai di window.handleSocialLogin pada login.html
export async function loginGoogle() { await startSocialLogin(googleProvider); }
export async function loginFacebook() { await startSocialLogin(facebookProvider); }
export async function loginApple() { await startSocialLogin(appleProvider); }

async function startSocialLogin(provider) {
  try {
    const result = await signInWithPopup(auth, provider);
    showToast(`Welcome ${result.user.displayName || 'User'}! 🎉`, 'success');
    
    const redirect = localStorage.getItem('auth_redirect') || 'dashboard.html';
    localStorage.removeItem('auth_redirect');
    setTimeout(() => window.location.href = redirect, 1000);
  } catch (err) {
    console.error("Social Login Error:", err.code);
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast('Login failed: ' + err.message, 'error');
    }
  }
}

// --- PAGE INITIALIZATION ---

export function initLoginPage() {
  const emailForm = document.querySelector('#email-login-form');
  const registerForm = document.querySelector('#register-form');

  // LOGIN EMAIL & PASSWORD
  emailForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = emailForm.querySelector('[name="email"]').value;
    const password = emailForm.querySelector('[name="password"]').value;
    const btn = emailForm.querySelector('button[type="submit"]');
    
    btn.disabled = true; 
    btn.innerHTML = '<span class="spinner"></span> Signing in...';
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back! 🎉', 'success');
      const redirect = localStorage.getItem('auth_redirect') || 'dashboard.html';
      localStorage.removeItem('auth_redirect');
      setTimeout(() => window.location.href = redirect, 1000);
    } catch (err) {
      showToast('Login failed: ' + err.message, 'error');
      btn.disabled = false; 
      btn.textContent = 'Sign In';
    }
  });

  // REGISTER EMAIL & PASSWORD
  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = registerForm.querySelector('[name="email"]').value;
    const password = registerForm.querySelector('[name="password"]').value;
    const btn = registerForm.querySelector('button[type="submit"]');
    
    btn.disabled = true; 
    btn.innerHTML = '<span class="spinner"></span> Creating account...';
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast('Account created! Welcome 🎉', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } catch (err) {
      showToast('Registration failed: ' + err.message, 'error');
      btn.disabled = false; 
      btn.textContent = 'Create Account';
    }
  });
}

export function initDashboard() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    const emailEl = document.querySelector('.dashboard-user-email');
    const nameEl  = document.querySelector('.dashboard-user-name');
    
    if (emailEl) emailEl.textContent = user.email;
    if (nameEl) nameEl.textContent = user.displayName || user.email?.split('@')[0] || 'User';
    
    document.querySelector('.logout-btn')?.addEventListener('click', logout);
  });
}
