// ===== AUTHENTICATION =====
import { showToast, showConfirm } from './ui.js';

// Simulated auth (replace with Firebase in production)
const USER_KEY = 'alight_user';

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export function logout() {
  showConfirm('Are you sure you want to sign out?', () => {
    localStorage.removeItem(USER_KEY);
    showToast('Signed out', 'info');
    setTimeout(() => window.location.href = 'index.html', 800);
  });
}

export function requireAuth(redirectTo = 'login.html') {
  if (!isLoggedIn()) {
    localStorage.setItem('auth_redirect', window.location.href);
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function updateNavAuth() {
  const user = getCurrentUser();
  const loginBtns = document.querySelectorAll('.nav-login-btn');
  const userMenus = document.querySelectorAll('.nav-user-menu');
  const userAvatar = document.querySelector('.nav-user-avatar');
  if (user) {
    loginBtns.forEach(el => el.classList.add('hidden'));
    userMenus.forEach(el => el.classList.remove('hidden'));
    if (userAvatar) userAvatar.textContent = user.email?.[0]?.toUpperCase() || '👤';
  } else {
    loginBtns.forEach(el => el.classList.remove('hidden'));
    userMenus.forEach(el => el.classList.add('hidden'));
  }
}

export function initLoginPage() {
  const emailForm = document.querySelector('#email-login-form');
  const phoneForm = document.querySelector('#phone-login-form');
  const otpForm = document.querySelector('#otp-form');
  const tabBtns = document.querySelectorAll('.auth-tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.auth-tab-content').forEach(c => c.classList.add('hidden'));
      document.querySelector(`#tab-${btn.dataset.tab}`)?.classList.remove('hidden');
    });
  });

  // OTP input auto-advance
  document.querySelectorAll('.otp-input').forEach((input, i, inputs) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && i < inputs.length - 1) inputs[i + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && i > 0) inputs[i - 1].focus();
    });
  });

  emailForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = emailForm.querySelector('[name="email"]').value;
    const password = emailForm.querySelector('[name="password"]').value;
    const btn = emailForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Signing in...';
    try {
      // Simulate login (replace with Firebase signInWithEmailAndPassword)
      await new Promise(r => setTimeout(r, 1200));
      const user = { uid: 'demo_' + Date.now(), email, createdAt: new Date().toISOString() };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      showToast('Welcome! 🎉', 'success');
      const redirect = localStorage.getItem('auth_redirect') || 'dashboard.html';
      localStorage.removeItem('auth_redirect');
      setTimeout(() => window.location.href = redirect, 1000);
    } catch (err) {
      showToast('Login failed. Check your credentials.', 'error');
      btn.disabled = false; btn.textContent = 'Sign In';
    }
  });

  const registerForm = document.querySelector('#register-form');
  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = registerForm.querySelector('[name="email"]').value;
    const password = registerForm.querySelector('[name="password"]').value;
    const btn = registerForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Creating account...';
    try {
      await new Promise(r => setTimeout(r, 1200));
      const user = { uid: 'demo_' + Date.now(), email, createdAt: new Date().toISOString(), purchasedPresets: [], downloadedFreePresets: [] };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      showToast('Account created! Welcome 🎉', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } catch (err) {
      showToast('Registration failed.', 'error');
      btn.disabled = false; btn.textContent = 'Create Account';
    }
  });
}

export function initDashboard() {
  if (!requireAuth()) return;
  const user = getCurrentUser();
  const emailEl = document.querySelector('.dashboard-user-email');
  const nameEl  = document.querySelector('.dashboard-user-name');
  if (emailEl) emailEl.textContent = user.email;
  // Use displayName if set, otherwise fall back to email prefix
  if (nameEl) nameEl.textContent = user.displayName || user.email?.split('@')[0] || 'User';
  document.querySelector('.logout-btn')?.addEventListener('click', logout);
}
