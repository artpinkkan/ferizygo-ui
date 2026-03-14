'use strict';

// ── DOM refs ──────────────────────────────────────────────
const form          = document.getElementById('searchForm');
const searchBtn     = document.getElementById('searchBtn');
const passengerMinus = document.getElementById('passengerMinus');
const passengerPlus  = document.getElementById('passengerPlus');
const passengerCount = document.getElementById('passengerCount');
const passengersInput = document.getElementById('passengers');

const fields = {
  fromPort:      document.getElementById('fromPort'),
  toPort:        document.getElementById('toPort'),
  departureDate: document.getElementById('departureDate'),
  vehicleType:   document.getElementById('vehicleType'),
};

const errors = {
  fromPort:      document.getElementById('fromPortError'),
  toPort:        document.getElementById('toPortError'),
  departureDate: document.getElementById('departureDateError'),
  passengers:    document.getElementById('passengersError'),
  vehicleType:   document.getElementById('vehicleTypeError'),
};

// ── Set min date to today ──────────────────────────────────
const today = new Date().toISOString().split('T')[0];
fields.departureDate.min = today;

// ── Passenger counter ─────────────────────────────────────
const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 20;

let passengers = 1;

function updateCounter() {
  passengerCount.textContent = passengers;
  passengersInput.value = passengers;
  passengerMinus.disabled = passengers <= MIN_PASSENGERS;
  passengerPlus.disabled  = passengers >= MAX_PASSENGERS;
}

passengerMinus.addEventListener('click', () => {
  if (passengers > MIN_PASSENGERS) {
    passengers--;
    updateCounter();
  }
});

passengerPlus.addEventListener('click', () => {
  if (passengers < MAX_PASSENGERS) {
    passengers++;
    updateCounter();
  }
});

updateCounter();

// ── Validators ────────────────────────────────────────────
const validators = {
  fromPort(val) {
    if (!val) return 'Please select a departure port.';
    return '';
  },

  toPort(val) {
    if (!val) return 'Please select an arrival port.';
    if (val === fields.fromPort.value) return 'Arrival port must differ from departure.';
    return '';
  },

  departureDate(val) {
    if (!val) return 'Please select a departure date.';
    if (val < today) return 'Departure date cannot be in the past.';
    return '';
  },

  vehicleType(val) {
    if (!val) return 'Please select a vehicle type.';
    return '';
  },
};

// ── Field validation helper ───────────────────────────────
function validateField(name) {
  const field = fields[name];
  if (!field) return true;

  const val = field.value;
  const msg = validators[name](val);

  field.classList.toggle('is-invalid', !!msg);
  field.classList.toggle('is-valid',   !msg && val !== '');

  errors[name].textContent = msg;
  return !msg;
}

// ── Live validation on change ─────────────────────────────
Object.keys(fields).forEach(name => {
  fields[name].addEventListener('change', () => {
    validateField(name);
    // Re-validate toPort if fromPort changes
    if (name === 'fromPort' && fields.toPort.value) validateField('toPort');
  });
});

// ── Form submit ───────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fieldValid = Object.keys(fields).map(name => validateField(name)).every(Boolean);
  if (!fieldValid) return;

  // Show loader
  searchBtn.disabled = true;
  searchBtn.querySelector('.btn-text').hidden   = true;
  searchBtn.querySelector('.btn-loader').hidden = false;

  await delay(800);

  const params = new URLSearchParams({
    from:       fields.fromPort.value,
    to:         fields.toPort.value,
    date:       fields.departureDate.value,
    passengers: passengers,
    vehicle:    fields.vehicleType.value,
  });

  window.location.href = `search-routes-detail.html?${params.toString()}`;
});

// ── Util ──────────────────────────────────────────────────
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
