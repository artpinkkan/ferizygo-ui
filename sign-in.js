'use strict';

// ── DOM refs ──────────────────────────────────────────────
const signInBtn  = document.getElementById('signInBtn');
const emailInput = document.getElementById('email');
const passInput  = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passError  = document.getElementById('passwordError');
const eyeBtn     = document.getElementById('eyeBtn');
const eyeIcon    = document.getElementById('eyeIcon');

// ── Eye toggle ────────────────────────────────────────────
let passVisible = false;

eyeBtn.addEventListener('click', () => {
  passVisible = !passVisible;
  passInput.type = passVisible ? 'text' : 'password';
  eyeIcon.style.opacity = passVisible ? '1' : '0.5';
});

// ── Validators ────────────────────────────────────────────
function validateEmail() {
  const val = emailInput.value.trim();
  if (!val) return show(emailError, emailInput, 'Please enter your email address.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return show(emailError, emailInput, 'Please enter a valid email address.');
  return clear(emailError, emailInput);
}

function validatePassword() {
  const val = passInput.value;
  if (!val) return show(passError, passInput, 'Please enter your password.');
  if (val.length < 6) return show(passError, passInput, 'Password must be at least 6 characters.');
  return clear(passError, passInput);
}

function show(errEl, inputEl, msg) {
  errEl.textContent = msg;
  inputEl.classList.add('is-invalid');
  inputEl.classList.remove('is-valid');
  return false;
}

function clear(errEl, inputEl) {
  errEl.textContent = '';
  inputEl.classList.remove('is-invalid');
  inputEl.classList.add('is-valid');
  return true;
}

// ── Live validation ───────────────────────────────────────
emailInput.addEventListener('blur', validateEmail);
passInput.addEventListener('blur', validatePassword);

// ── Sign In ───────────────────────────────────────────────
signInBtn.addEventListener('click', async () => {
  const emailOk = validateEmail();
  const passOk  = validatePassword();
  if (!emailOk || !passOk) return;

  // Show loader
  signInBtn.disabled = true;
  signInBtn.querySelector('.auth-btn-text').hidden  = true;
  signInBtn.querySelector('.auth-btn-loader').hidden = false;

  await delay(900);

  window.location.href = 'landing.html';
});

// ── Util ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
