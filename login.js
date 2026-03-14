'use strict';

// ── DOM refs ──────────────────────────────────────────────
const loginBtn       = document.getElementById('loginBtn');
const successOverlay = document.getElementById('successOverlay');
const dashboardBtn   = document.getElementById('dashboardBtn');

const fields = {
  email:    document.getElementById('email'),
  password: document.getElementById('password'),
};

const errors = {
  email:    document.getElementById('emailError'),
  password: document.getElementById('passwordError'),
};

// ── Validators ────────────────────────────────────────────
const validators = {
  email(val) {
    if (!val.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Enter a valid email address.';
    return '';
  },

  password(val) {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return '';
  },
};

// ── Field validation helper ───────────────────────────────
function validateField(name) {
  const field = fields[name];
  const msg   = validators[name](field.value);

  field.classList.toggle('is-invalid', !!msg);
  field.classList.toggle('is-valid',   !msg && field.value !== '');

  errors[name].textContent = msg;
  return !msg;
}

// ── Live validation on blur ───────────────────────────────
Object.keys(fields).forEach(name => {
  fields[name].addEventListener('blur', () => validateField(name));
});

// ── Toggle password visibility ────────────────────────────
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const input    = document.getElementById(btn.dataset.target);
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    btn.classList.toggle('active', isHidden);

    const icon = btn.querySelector('.eye-icon');
    if (isHidden) {
      icon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    } else {
      icon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
    }
  });
});

// ── Login button click ────────────────────────────────────
loginBtn.addEventListener('click', async () => {
  const valid = Object.keys(fields).map(name => validateField(name)).every(Boolean);
  if (!valid) return;

  // Simulate async login request
  loginBtn.disabled = true;
  loginBtn.querySelector('.btn-text').hidden   = true;
  loginBtn.querySelector('.btn-loader').hidden = false;

  await delay(1400);

  // Show success
  successOverlay.hidden = false;
});

// ── Dashboard button ──────────────────────────────────────
dashboardBtn.addEventListener('click', () => {
  // Placeholder: redirect to dashboard
  alert('Redirecting to dashboard…');
});

// ── Util ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
