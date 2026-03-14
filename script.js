'use strict';

// ── DOM refs ──────────────────────────────────────────────
const form            = document.getElementById('registerForm');
const submitBtn       = document.getElementById('submitBtn');
const successOverlay  = document.getElementById('successOverlay');
const successName     = document.getElementById('successName');

const fields = {
  fullName:        document.getElementById('fullName'),
  email:           document.getElementById('email'),
  phone:           document.getElementById('phone'),
  password:        document.getElementById('password'),
  confirmPassword: document.getElementById('confirmPassword'),
  terms:           document.getElementById('terms'),
};

const errors = {
  fullName:        document.getElementById('fullNameError'),
  email:           document.getElementById('emailError'),
  phone:           document.getElementById('phoneError'),
  password:        document.getElementById('passwordError'),
  confirmPassword: document.getElementById('confirmPasswordError'),
  terms:           document.getElementById('termsError'),
};

const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

// ── Validators ────────────────────────────────────────────
const validators = {
  fullName(val) {
    if (!val.trim()) return 'Full name is required.';
    if (val.trim().length < 3) return 'Name must be at least 3 characters.';
    if (!/^[a-zA-Z\s'.,-]+$/.test(val.trim())) return 'Name contains invalid characters.';
    return '';
  },

  email(val) {
    if (!val.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Enter a valid email address.';
    return '';
  },

  phone(val) {
    const digits = val.replace(/\D/g, '');
    if (!val.trim()) return 'Phone number is required.';
    if (digits.length < 9 || digits.length > 15) return 'Enter a valid phone number (9–15 digits).';
    if (!/^[\d\s+()\-]+$/.test(val.trim())) return 'Phone number contains invalid characters.';
    return '';
  },

  password(val) {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(val)) return 'Include at least one uppercase letter.';
    if (!/[0-9]/.test(val)) return 'Include at least one number.';
    return '';
  },

  confirmPassword(val) {
    if (!val) return 'Please confirm your password.';
    if (val !== fields.password.value) return 'Passwords do not match.';
    return '';
  },

  terms(checked) {
    if (!checked) return 'You must accept the Terms of Service.';
    return '';
  },
};

// ── Password strength ─────────────────────────────────────
function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const strengthLevels = [
  { min: 0, max: 1, label: '',        color: 'transparent', width: '0%'   },
  { min: 1, max: 2, label: 'Weak',    color: '#e53e3e',     width: '25%'  },
  { min: 2, max: 3, label: 'Fair',    color: '#ed8936',     width: '50%'  },
  { min: 3, max: 4, label: 'Good',    color: '#ecc94b',     width: '75%'  },
  { min: 4, max: 5, label: 'Strong',  color: '#38a169',     width: '90%'  },
  { min: 5, max: 6, label: 'Great!',  color: '#2b6cb0',     width: '100%' },
];

function updateStrength(pwd) {
  if (!pwd) {
    strengthFill.style.width = '0%';
    strengthFill.style.backgroundColor = 'transparent';
    strengthLabel.textContent = '';
    strengthLabel.style.color = '';
    return;
  }
  const score = getStrength(pwd);
  const level = strengthLevels.find(l => score >= l.min && score < l.max) || strengthLevels[strengthLevels.length - 1];
  strengthFill.style.width = level.width;
  strengthFill.style.backgroundColor = level.color;
  strengthLabel.textContent = level.label;
  strengthLabel.style.color = level.color;
}

// ── Field validation helper ───────────────────────────────
function validateField(name) {
  const field = fields[name];
  const value = name === 'terms' ? field.checked : field.value;
  const msg   = validators[name](value);

  if (name !== 'terms') {
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid',   !msg && value !== '');
  }

  errors[name].textContent = msg;
  return !msg;
}

// ── Live validation on blur ───────────────────────────────
Object.keys(fields).forEach(name => {
  const field = fields[name];
  const eventType = name === 'terms' ? 'change' : 'blur';

  field.addEventListener(eventType, () => validateField(name));

  // Re-validate confirm password when password changes
  if (name === 'password') {
    field.addEventListener('input', () => {
      updateStrength(field.value);
      if (fields.confirmPassword.value) validateField('confirmPassword');
    });
  }
});

// ── Toggle password visibility ────────────────────────────
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    btn.classList.toggle('active', isHidden);

    // Swap icon
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

// ── Form submit ───────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const valid = Object.keys(fields).map(name => validateField(name)).every(Boolean);
  if (!valid) return;

  // Simulate async submission
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').hidden   = true;
  submitBtn.querySelector('.btn-loader').hidden = false;

  await delay(1400);

  // Show success
  const name = fields.fullName.value.trim().split(' ')[0];
  successName.textContent = name;
  successOverlay.hidden = false;
});

// ── Reset (back from success) ─────────────────────────────
function resetForm() {
  form.reset();

  // Clear validation states
  Object.values(fields).forEach(field => {
    if (field.type !== 'checkbox') {
      field.classList.remove('is-valid', 'is-invalid');
    }
  });
  Object.values(errors).forEach(el => el.textContent = '');

  updateStrength('');

  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').hidden   = false;
  submitBtn.querySelector('.btn-loader').hidden = true;

  successOverlay.hidden = true;
}

// Expose to inline onclick
window.resetForm = resetForm;

// ── Util ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
