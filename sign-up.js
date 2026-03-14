'use strict';

// ── DOM refs ──────────────────────────────────────────────
const signUpBtn      = document.getElementById('signUpBtn');
const successOverlay = document.getElementById('successOverlay');
const eyeBtn         = document.getElementById('eyeBtn');
const eyeIcon        = document.getElementById('eyeIcon');

const inputs = {
  fullName: document.getElementById('fullName'),
  email:    document.getElementById('email'),
  phone:    document.getElementById('phone'),
  password: document.getElementById('password'),
  terms:    document.getElementById('terms'),
};

const errors = {
  fullName: document.getElementById('fullNameError'),
  email:    document.getElementById('emailError'),
  phone:    document.getElementById('phoneError'),
  password: document.getElementById('passwordError'),
  terms:    document.getElementById('termsError'),
};

// ── Eye toggle ────────────────────────────────────────────
let passVisible = false;

eyeBtn.addEventListener('click', () => {
  passVisible = !passVisible;
  inputs.password.type = passVisible ? 'text' : 'password';
  eyeIcon.style.opacity = passVisible ? '1' : '0.5';
});

// ── Validators ────────────────────────────────────────────
const validators = {
  fullName(val) {
    if (!val.trim()) return 'Please enter your full name.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email(val) {
    if (!val.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
    return '';
  },
  phone(val) {
    if (!val.trim()) return 'Please enter your phone number.';
    if (!/^[\d\s\+\-\(\)]{7,}$/.test(val)) return 'Please enter a valid phone number.';
    return '';
  },
  password(val) {
    if (!val) return 'Please enter a password.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    return '';
  },
  terms() {
    if (!inputs.terms.checked) return 'You must agree to the Terms of Service.';
    return '';
  },
};

function validateField(name) {
  const input = inputs[name];
  const val   = name === 'terms' ? '' : input.value;
  const msg   = validators[name](val);

  if (name !== 'terms') {
    input.classList.toggle('is-invalid', !!msg);
    input.classList.toggle('is-valid',   !msg && val !== '');
  }

  errors[name].textContent = msg;
  return !msg;
}

// ── Live validation ───────────────────────────────────────
['fullName', 'email', 'phone', 'password'].forEach(name => {
  inputs[name].addEventListener('blur', () => validateField(name));
});

inputs.terms.addEventListener('change', () => validateField('terms'));

// ── Sign Up ───────────────────────────────────────────────
signUpBtn.addEventListener('click', async () => {
  const allValid = ['fullName', 'email', 'phone', 'password', 'terms']
    .map(name => validateField(name))
    .every(Boolean);

  if (!allValid) return;

  // Show loader
  signUpBtn.disabled = true;
  signUpBtn.querySelector('.auth-btn-text').hidden  = true;
  signUpBtn.querySelector('.auth-btn-loader').hidden = false;

  await delay(900);

  // Show success overlay
  successOverlay.hidden = false;

  // Redirect after 2.5s
  setTimeout(() => {
    window.location.href = 'landing.html';
  }, 2500);
});

// ── Util ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
