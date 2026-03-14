'use strict';

// ── URL params ────────────────────────────────────────────
const params     = new URLSearchParams(window.location.search);
const fromPort   = params.get('from')       || '';
const toPort     = params.get('to')         || '';
const travelDate = params.get('date')       || '';
const passengers = parseInt(params.get('passengers') || '1', 10);
const vehicleParam = params.get('vehicle')  || '';

// ── Price table (IDR, rough values) ──────────────────────
const TICKET_PRICE    = 85_000;     // per passenger
const FEES            = 14_500;
const VEHICLE_PRICES  = {
  motorcycle: 75_000,
  car:       185_000,
  suv:       250_000,
  bus:       650_000,
  truck:     850_000,
  none:            0,
};

const VEHICLE_LABELS = {
  motorcycle: 'Motorcycle',
  car:        'Standard Car',
  suv:        'Large Car / SUV',
  bus:        'Bus / Minibus',
  truck:      'Truck',
  none:       'No vehicle',
};

// ── Populate booking summary ──────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRp(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

document.getElementById('summaryFrom').textContent       = fromPort   || '—';
document.getElementById('summaryTo').textContent         = toPort     || '—';
document.getElementById('summaryDate').textContent       = formatDate(travelDate);
document.getElementById('summaryPassengers').textContent = passengers + (passengers === 1 ? ' person' : ' persons');

const vLabel = VEHICLE_LABELS[vehicleParam] || (vehicleParam || 'No vehicle');
document.getElementById('summaryVehicle').textContent    = vLabel;

// Price calculation
const passengerTotal  = TICKET_PRICE * passengers;
const vehiclePrice    = VEHICLE_PRICES[vehicleParam] || 0;
const total           = passengerTotal + vehiclePrice + FEES;

document.getElementById('pricePassengerLabel').textContent = passengers + '× Adult Ticket';
document.getElementById('pricePassenger').textContent      = formatRp(passengerTotal);

const vehicleRow = document.getElementById('priceVehicleRow');
if (vehiclePrice > 0) {
  document.getElementById('priceVehicleLabel').textContent = '1× ' + vLabel;
  document.getElementById('priceVehicle').textContent      = formatRp(vehiclePrice);
} else {
  vehicleRow.hidden = true;
}

document.getElementById('priceFees').textContent  = formatRp(FEES);
document.getElementById('priceTotal').textContent = formatRp(total);

// ── Pre-fill vehicle type from URL ────────────────────────
const vehicleSelect = document.getElementById('vehicleType');
if (vehicleParam && vehicleParam !== 'none') {
  // map search.html values → checkout options
  const map = { motorcycle: 'motorcycle', car: 'car', bus: 'bus', truck: 'truck' };
  const mapped = map[vehicleParam.toLowerCase()];
  if (mapped) vehicleSelect.value = mapped;
}

// ── DOM refs ──────────────────────────────────────────────
const continueBtn     = document.getElementById('continueBtn');
const successOverlay  = document.getElementById('successOverlay');

const fields = {
  fullName:     document.getElementById('fullName'),
  idNumber:     document.getElementById('idNumber'),
  vehicleType:  vehicleSelect,
  licensePlate: document.getElementById('licensePlate'),
};

const errors = {
  fullName:     document.getElementById('fullNameError'),
  idNumber:     document.getElementById('idNumberError'),
  vehicleType:  document.getElementById('vehicleTypeError'),
  licensePlate: document.getElementById('licensePlateError'),
  gender:       document.getElementById('genderError'),
};

// ── Validators ────────────────────────────────────────────
const validators = {
  fullName(val) {
    if (!val.trim()) return 'Please enter the passenger\'s full name.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  idNumber(val) {
    if (!val.trim()) return 'Please enter a passport or ID number.';
    return '';
  },
  vehicleType(val) {
    // only required if passenger booked with a vehicle
    if (vehicleParam && vehicleParam !== 'none' && !val) return 'Please select a vehicle type.';
    return '';
  },
  licensePlate(val) {
    const vtype = fields.vehicleType.value;
    if (vtype && !val.trim()) return 'Please enter your license plate.';
    return '';
  },
};

function validateField(name) {
  const field = fields[name];
  if (!field || !validators[name]) return true;

  const msg = validators[name](field.value);

  if (field.classList) {
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid',   !msg && field.value !== '');
  }

  errors[name].textContent = msg;
  return !msg;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  const msg = checked ? '' : 'Please select a gender.';
  errors.gender.textContent = msg;
  return !msg;
}

// ── Live validation ───────────────────────────────────────
['fullName', 'idNumber', 'vehicleType', 'licensePlate'].forEach(name => {
  fields[name].addEventListener('blur', () => validateField(name));
});

// license plate — uppercase as user types
fields.licensePlate.addEventListener('input', () => {
  fields.licensePlate.value = fields.licensePlate.value.toUpperCase();
});

document.querySelectorAll('input[name="gender"]').forEach(r => {
  r.addEventListener('change', validateGender);
});

// ── Continue ──────────────────────────────────────────────
continueBtn.addEventListener('click', async () => {
  const ok = [
    validateField('fullName'),
    validateField('idNumber'),
    validateGender(),
    validateField('vehicleType'),
    validateField('licensePlate'),
  ].every(Boolean);

  if (!ok) return;

  // Show loader
  continueBtn.disabled = true;
  continueBtn.querySelector('.co-btn-text').hidden   = true;
  continueBtn.querySelector('.co-btn-loader').hidden = false;

  await delay(900);

  // Show success
  successOverlay.hidden = false;

  // Redirect after 2.5 s
  setTimeout(() => {
    window.location.href = 'landing.html';
  }, 2500);
});

// ── Util ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
