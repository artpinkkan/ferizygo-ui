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
  window.location.href = `search.html?${params.toString()}`;
});
