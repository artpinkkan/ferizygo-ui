'use strict';

// ── URL params ────────────────────────────────────────────
const params     = new URLSearchParams(window.location.search);
const fromPort   = params.get('from')       || '';
const toPort     = params.get('to')         || '';
const travelDate = params.get('date')       || '';
const passengers = parseInt(params.get('passengers') || '1', 10);
const vehicle    = params.get('vehicle')    || 'none';

// ── Populate summary bar ──────────────────────────────────
document.getElementById('barFrom').textContent = fromPort || '—';
document.getElementById('barTo').textContent   = toPort   || '—';
document.getElementById('barDate').textContent = formatDate(travelDate);
document.getElementById('barPassengers').textContent =
  passengers + (passengers === 1 ? ' passenger' : ' passengers');
document.getElementById('barVehicle').textContent =
  vehicle === 'none' ? 'No vehicle' : capitalize(vehicle);

document.getElementById('pageSubtitle').textContent =
  fromPort && toPort
    ? `${fromPort} → ${toPort} · ${formatDate(travelDate)}`
    : 'Select a ferry schedule to continue';

// ── Mock ferry schedules ──────────────────────────────────
const SCHEDULES = [
  { vessel: 'KMP Batumandi',   dep: '05:00', arr: '08:30', duration: '3h 30m', slots: 48, operator: 'PT ASDP Indonesia Ferry', pricePerPax: 65_000, vehicleAdd: { motorcycle: 70_000, car: 180_000, suv: 240_000, bus: 620_000, truck: 820_000 }, available: true  },
  { vessel: 'KMP Nusa Bahagia',dep: '07:30', arr: '11:00', duration: '3h 30m', slots: 12, operator: 'PT ASDP Indonesia Ferry', pricePerPax: 65_000, vehicleAdd: { motorcycle: 70_000, car: 180_000, suv: 240_000, bus: 620_000, truck: 820_000 }, available: true  },
  { vessel: 'KMP Kirana III',  dep: '10:00', arr: '13:30', duration: '3h 30m', slots:  3, operator: 'PT ASDP Indonesia Ferry', pricePerPax: 65_000, vehicleAdd: { motorcycle: 70_000, car: 180_000, suv: 240_000, bus: 620_000, truck: 820_000 }, available: true  },
  { vessel: 'KMP Panorama III',dep: '13:00', arr: '16:30', duration: '3h 30m', slots: 35, operator: 'PT ASDP Indonesia Ferry', pricePerPax: 65_000, vehicleAdd: { motorcycle: 70_000, car: 180_000, suv: 240_000, bus: 620_000, truck: 820_000 }, available: true  },
  { vessel: 'KMP Wilamanda',   dep: '15:30', arr: '19:00', duration: '3h 30m', slots:  0, operator: 'PT ASDP Indonesia Ferry', pricePerPax: 65_000, vehicleAdd: { motorcycle: 70_000, car: 180_000, suv: 240_000, bus: 620_000, truck: 820_000 }, available: false },
  { vessel: 'KMP Baruna Jaya', dep: '18:00', arr: '21:30', duration: '3h 30m', slots: 60, operator: 'PT ASDP Indonesia Ferry', pricePerPax: 65_000, vehicleAdd: { motorcycle: 70_000, car: 180_000, suv: 240_000, bus: 620_000, truck: 820_000 }, available: true  },
];

// ── Render ────────────────────────────────────────────────
const list = document.getElementById('scheduleList');

SCHEDULES.forEach(s => {
  const vehiclePrice = vehicle !== 'none' ? (s.vehicleAdd[vehicle] || 0) : 0;
  const totalPrice   = s.pricePerPax * passengers + vehiclePrice + 14_500; // + fees

  const badgeHtml = !s.available
    ? `<span class="sc-badge sc-badge-orange">Fully Booked</span>`
    : s.slots <= 5
    ? `<span class="sc-badge sc-badge-orange">Only ${s.slots} left</span>`
    : `<span class="sc-badge">Available · ${s.slots} seats</span>`;

  const checkoutParams = new URLSearchParams({
    from: fromPort, to: toPort, date: travelDate,
    passengers, vehicle,
    vessel: s.vessel,
    dep: s.dep, arr: s.arr,
    price: totalPrice,
  });

  const card = document.createElement('div');
  card.className = 'sc-card';
  card.innerHTML = `
    <div class="sc-card-times">
      <div class="sc-time-block">
        <div class="sc-time">${s.dep}</div>
        <div class="sc-port">${fromPort || 'Departure'}</div>
      </div>
      <div class="sc-duration-wrap">
        <div class="sc-duration-line"></div>
        <div class="sc-duration-text">${s.duration}</div>
      </div>
      <div class="sc-time-block">
        <div class="sc-time">${s.arr}</div>
        <div class="sc-port">${toPort || 'Arrival'}</div>
      </div>
    </div>
    <div class="sc-card-info">
      <div class="sc-vessel">${s.vessel}</div>
      <div class="sc-vessel-sub">
        ${s.operator}&ensp;${badgeHtml}
      </div>
    </div>
    <div class="sc-card-price">
      <div class="sc-price">${formatRp(totalPrice)}</div>
      <div class="sc-price-label">total incl. fees</div>
    </div>
    ${s.available
      ? `<a href="checkout.html?${checkoutParams.toString()}" class="sc-choose-btn">Choose</a>`
      : `<button class="sc-choose-btn" disabled style="opacity:0.4;cursor:not-allowed;">Unavailable</button>`
    }
  `;
  list.appendChild(card);
});

// ── Helpers ───────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRp(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
