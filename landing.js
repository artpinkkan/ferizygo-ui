'use strict';

// ── Set min date to today ──────────────────────────────────
const bkDate = document.getElementById('bk-date');
bkDate.min = new Date().toISOString().split('T')[0];

// ── Vehicle checkbox toggle ───────────────────────────────
const vchk   = document.getElementById('bk-vehicle-chk');
const vtypes = document.getElementById('bk-vehicle-types');

function updateVehicleState() {
  vtypes.querySelectorAll('input').forEach(r => r.disabled = !vchk.checked);
  vtypes.style.opacity = vchk.checked ? '1' : '0.4';
}

vchk.addEventListener('change', updateVehicleState);
updateVehicleState();

// ── Search button ─────────────────────────────────────────
document.getElementById('bk-search').addEventListener('click', () => {
  const from       = document.getElementById('bk-from').value;
  const to         = document.getElementById('bk-to').value;
  const date       = bkDate.value;
  const passengers = document.getElementById('bk-passengers').value;
  const vtype      = vchk.checked
    ? (document.querySelector('input[name="bk-vtype"]:checked')?.value || '')
    : 'none';

  const params = new URLSearchParams({ from, to, date, passengers, vehicle: vtype });
  window.location.href = `search-routes-detail.html?${params.toString()}`;
});

// ── Auth modals (login / signup) ───────────────────────────
(function () {
  const loginTrigger  = document.getElementById('lp-login-trigger');
  const signupTrigger = document.getElementById('lp-signup-trigger');
  const loginModal    = document.getElementById('lp-login-modal');
  const signupModal   = document.getElementById('lp-signup-modal');

  if (!loginTrigger || !signupTrigger || !loginModal || !signupModal) return;

  const closeButtons = document.querySelectorAll('[data-auth-close]');
  const switchToSignup = document.getElementById('lp-switch-to-signup');
  const switchToLogin  = document.getElementById('lp-switch-to-login');

  function openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  loginTrigger.addEventListener('click', () => {
    closeModal(signupModal);
    openModal(loginModal);
  });

  signupTrigger.addEventListener('click', () => {
    closeModal(loginModal);
    openModal(signupModal);
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });

  if (switchToSignup) {
    switchToSignup.addEventListener('click', () => {
      closeModal(loginModal);
      openModal(signupModal);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
      closeModal(signupModal);
      openModal(loginModal);
    });
  }

  // Close on overlay click
  [loginModal, signupModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(loginModal);
      closeModal(signupModal);
    }
  });
})();
