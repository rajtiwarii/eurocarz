// ============================================
// EuroCarz — Main JavaScript
// ============================================

// ====== CITIES ======
const CITIES = ['Phagwara', 'Jalandhar', 'Mohali', 'Chandigarh'];

// ====== LOCAL CAR DATA ======
// pricing: price_day / price_12hr / price_6hr
// cities: all cars available in Jalandhar + Phagwara
// transmission: ALL cars are manual EXCEPT Mahindra XUV 7XO (automatic)
const CARS_DATA = [
  {
    id: 1,
    name: 'Mahindra Thar Roxx',
    color: 'Glossy Black',
    fuel: 'diesel',
    transmission: 'manual',
    seats: 7,
    price_day:  4000,
    price_12hr: 2200,
    price_6hr:  1200,
    rating: 4.8,
    reviews: 24,
    image: 'images/roxx.jpg',
    host: 'EuroCarz Fleet',
    badge: 'New',
    cities: ['Jalandhar', 'Phagwara'],
    km: 300,
    features: ['7 Seater', 'Panoramic sunroof', 'ADAS safety suite', 'Wireless Apple CarPlay', '6 airbags', '360° camera']
  },
  {
    id: 2,
    name: 'Mahindra XUV 7XO',
    color: 'Champagne Gold',
    fuel: 'diesel',
    transmission: 'automatic',
    seats: 7,
    price_day:  4500,
    price_12hr: 2500,
    price_6hr:  1500,
    rating: 4.9,
    reviews: 18,
    image: 'images/xuv7xo.jpg',
    host: 'EuroCarz Fleet',
    badge: 'Premium',
    cities: ['Jalandhar', 'Phagwara'],
    km: 300,
    features: ['7 Seater', 'Level 2 ADAS', '12.3" dual screens', 'Harman Kardon audio', 'Panoramic sunroof', 'Ventilated seats']
  },
  {
    id: 3,
    name: 'Mahindra Scorpio N',
    color: 'Glossy Black',
    fuel: 'diesel',
    transmission: 'manual',
    seats: 7,
    price_day:  4000,
    price_12hr: 2300,
    price_6hr:  1300,
    rating: 4.7,
    reviews: 42,
    image: 'images/scorpion.jpg',
    host: 'EuroCarz Fleet',
    badge: null,
    cities: ['Jalandhar', 'Phagwara'],
    km: 350,
    features: ['7 Seater', '4WD option', 'Sony audio system', '6 airbags', 'Wireless charging', 'Cruise control']
  },
  {
    id: 4,
    name: 'Kia Sonet Petrol',
    color: 'Midnight Black',
    fuel: 'petrol',
    transmission: 'manual',
    seats: 5,
    price_day:  2200,
    price_12hr: 1200,
    price_6hr:   800,
    rating: 4.6,
    reviews: 56,
    image: 'images/sonet.jpg',
    host: 'EuroCarz Fleet',
    badge: null,
    cities: ['Jalandhar', 'Phagwara'],
    km: 300,
    features: ['Sunroof', '10.25" infotainment', 'Bose audio', 'ADAS', 'Wireless charging', 'Ventilated seats']
  },
  {
    id: 5,
    name: 'Kia Sonet Diesel',
    color: 'Midnight Black',
    fuel: 'diesel',
    transmission: 'manual',
    seats: 5,
    price_day:  2500,
    price_12hr: 1400,
    price_6hr:   900,
    rating: 4.5,
    reviews: 38,
    image: 'images/sonet.jpg',
    host: 'EuroCarz Fleet',
    badge: 'Value Pick',
    cities: ['Jalandhar', 'Phagwara'],
    km: 350,
    features: ['Sunroof', '10.25" infotainment', 'ADAS safety', 'Rear camera', 'Auto climate control', 'Cruise control']
  },
  {
    id: 6,
    name: 'Tata Punch Petrol',
    color: 'Pearl White',
    fuel: 'petrol',
    transmission: 'manual',
    seats: 5,
    price_day:  1800,
    price_12hr: 1000,
    price_6hr:   700,
    rating: 4.6,
    reviews: 61,
    image: 'images/punch.jpg',
    host: 'EuroCarz Fleet',
    badge: 'Best Value',
    cities: ['Jalandhar', 'Phagwara'],
    km: 300,
    features: ['Micro SUV', '10.25" touchscreen', 'Wireless CarPlay', 'iRA connected tech', 'Auto headlights', '6 airbags']
  },
  {
    id: 7,
    name: 'Toyota Fortuner',
    color: 'Glossy Black',
    fuel: 'diesel',
    transmission: 'automatic',
    seats: 7,
    price_day:  5500,   // ← CONFIGURE: Set your actual rental rate here
    price_12hr: 3200,   // ← CONFIGURE: Set your actual 12-hour rate here
    price_6hr:  2000,   // ← CONFIGURE: Set your actual 6-hour rate here
    rating: 4.9,
    reviews: 12,
    image: 'images/fortuner.jpg',
    cities: ['Jalandhar', 'Phagwara'],
    km: 300,
    description: 'Travel in comfort and style with the Toyota Fortuner, a premium SUV offering a spacious interior, commanding road presence, and a comfortable experience for family trips, business travel, and outstation journeys.',
    features: ['7 Seater', 'Premium SUV', '9\" touchscreen', 'Wireless CarPlay', 'Leather seats', '8 airbags', 'Cruise control', 'Rear AC vents']
  }
];

// ====== WHATSAPP CONFIGURATION ======
// Business WhatsApp number in international format (no + or spaces)
const WHATSAPP_NUMBER = '919855505912'; // +91 9855505912


// Build and send a WhatsApp booking enquiry
function sendWhatsAppEnquiry(data) {
  const timeLabel = data.pickupTime || '';
  const daysText  = data.units > 1 ? `${data.units} days` : (data.durationLabel || 'Full Day');

  const lines = [
    'Hello! I would like to enquire about a car rental.',
    '',
    '*Booking Details*',
    `• Name: ${data.customerName}`,
    `• Mobile: ${data.customerPhone}`,
    `• Car: ${data.carName}`,
    `• Pickup Location: ${data.city}`,
    `• Pickup Date: ${data.pickupDate}`,
    `• Pickup Time: ${timeLabel}`,
    `• Duration: ${daysText}`,
    `• Passengers: ${data.passengers || 'Not specified'}`,
    `• Trip Type: ${data.tripType || 'Not specified'}`,
  ];

  if (data.destination) lines.push(`• Destination: ${data.destination}`);
  if (data.additionalReqs) lines.push(`• Additional Requirements: ${data.additionalReqs}`);

  lines.push('', 'Please share the availability and rental price. Thank you!');

  const message = lines.join('\n');
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Try opening WhatsApp
  const win = window.open(url, '_blank');
  if (!win) {
    // Popup blocked — return false so caller can show fallback
    return false;
  }
  return true;
}

const DURATIONS = {
  '6hr':  { label: '6 Hours',   key: 'price_6hr'  },
  '12hr': { label: '12 Hours',  key: 'price_12hr' },
  'day':  { label: 'Full Day',  key: 'price_day'  }
};

// ====== NAVBAR ======
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ====== HAMBURGER MENU ======
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ====== SCROLL FADE-IN ======
function initFadeObserver() {
  const fadeEls = document.querySelectorAll('.fade-in-up');
  if (!fadeEls.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => obs.observe(el));
}
initFadeObserver();

function reObserveFadeEls(container) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  container.querySelectorAll('.fade-in-up').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
    obs.observe(el);
  });
}

// ====== HERO SEARCH ======
const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const city    = document.getElementById('search-city')?.value || '';
    const pickup  = document.getElementById('search-pickup')?.value || '';
    const dropoff = document.getElementById('search-dropoff')?.value || '';
    const params  = new URLSearchParams({ city, pickup, dropoff });
    window.location.href = `cars.html?${params.toString()}`;
  });
}

// ====== RENDER CAR CARD ======
function renderCarCard(car) {
  const fuelIcon   = car.fuel === 'petrol' ? '⛽' : '🛢️';
  const badge      = car.badge ? `<span class="badge badge-white car-card-badge">${car.badge}</span>` : '';
  const price6hr   = car.price_6hr  || car.price_per_6hr  || 0;
  const price12hr  = car.price_12hr || car.price_per_12hr || 0;
  const priceDay   = car.price_day  || car.price_per_day  || 0;
  const cityList   = Array.isArray(car.cities) ? car.cities.join(' · ') : (car.city || '');

  return `
    <div class="car-card fade-in-up" onclick="window.location.href='car-detail.html?id=${car.id}'" role="button" tabindex="0">
      <div class="car-card-image-wrap">
        ${badge}
        <img class="car-card-image" src="${car.image || car.image_url}" alt="${car.name}" loading="lazy" />
      </div>
      <div class="car-card-body">
        <div class="car-card-meta">
          <span class="car-card-name">${car.name}</span>
          <span class="badge badge-outline" style="font-size:0.7rem">${cityList}</span>
        </div>
        <p class="car-card-host" style="font-size:0.8rem;color:var(--text-tertiary)">${car.color || ''} · EuroCarz Fleet</p>
        <div class="car-card-specs">
          <span class="car-card-spec">${fuelIcon} ${car.fuel.charAt(0).toUpperCase() + car.fuel.slice(1)}</span>
          <span class="car-card-spec">⚙️ ${car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}</span>
          <span class="car-card-spec">👤 ${car.seats} seats</span>
        </div>
        <!-- Pricing tiers -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px;padding-top:12px;border-top:1px solid var(--border-subtle)">
          <div style="text-align:center;padding:8px 4px;background:var(--bg-surface);border-radius:var(--radius-sm)">
            <div style="font-size:0.65rem;color:var(--text-tertiary);margin-bottom:2px">6 HRS</div>
            <div style="font-size:0.875rem;font-weight:800">₹${price6hr.toLocaleString('en-IN')}</div>
          </div>
          <div style="text-align:center;padding:8px 4px;background:var(--bg-surface);border-radius:var(--radius-sm)">
            <div style="font-size:0.65rem;color:var(--text-tertiary);margin-bottom:2px">12 HRS</div>
            <div style="font-size:0.875rem;font-weight:800">₹${price12hr.toLocaleString('en-IN')}</div>
          </div>
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,0.07);border:1px solid var(--border-default);border-radius:var(--radius-sm)">
            <div style="font-size:0.65rem;color:var(--text-tertiary);margin-bottom:2px">FULL DAY</div>
            <div style="font-size:0.875rem;font-weight:800">₹${priceDay.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div class="car-card-footer">
          <span style="font-size:0.8125rem;color:var(--text-tertiary)">From <strong style="color:var(--text-primary)">₹${price6hr.toLocaleString('en-IN')}</strong></span>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="color:#ffd60a;font-size:13px">★</span>
            <span class="rating-text">${car.rating} (${car.reviews || car.review_count || 0})</span>
          </div>
        </div>
      </div>
    </div>`;
}

// ====== HOMEPAGE: FEATURED CARS ======
const featuredGrid = document.getElementById('featured-cars-grid');
if (featuredGrid) {
  const initFeatured = async () => {
    let cars = CARS_DATA;
    if (typeof dbGetCars === 'function') {
      try {
        const { data, error } = await dbGetCars();
        if (data && !error && data.length > 0) cars = data;
      } catch (err) {
        console.warn('Error fetching cars:', err);
      }
    }
    featuredGrid.innerHTML = cars.map(c => renderCarCard(c)).join('');
    reObserveFadeEls(featuredGrid);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatured);
  } else {
    initFeatured();
  }
}

// ====== CARS PAGE ======
const carsGrid = document.getElementById('cars-grid');
if (carsGrid) {
  let allCars = [];
  let filtered = [];

  async function loadCars() {
    allCars = CARS_DATA;
    if (typeof dbGetCars === 'function') {
      try {
        const { data, error } = await dbGetCars();
        if (data && !error && data.length > 0) allCars = data;
      } catch (err) {
        console.warn('Error fetching cars:', err);
      }
    }
    const urlCity = new URLSearchParams(window.location.search).get('city');
    if (urlCity) {
      const cityInput = document.getElementById('filter-city');
      if (cityInput) cityInput.value = urlCity;
    }
    applyFilters();
  }

  function applyFilters() {
    const transmission = [...document.querySelectorAll('.filter-trans:checked')].map(e => e.value);
    const fuel         = [...document.querySelectorAll('.filter-fuel:checked')].map(e => e.value);
    const maxPrice     = parseInt(document.getElementById('price-range')?.value || 10000);
    const cityVal      = document.getElementById('filter-city')?.value || '';
    const sortBy       = document.getElementById('sort-by')?.value || 'rating';

    filtered = allCars.filter(car => {
      const priceDay   = car.price_day  || car.price_per_day || 0;
      const carCities  = Array.isArray(car.cities) ? car.cities : [car.city || ''];
      const matchTrans = transmission.length === 0 || transmission.includes(car.transmission);
      const matchFuel  = fuel.length === 0 || fuel.includes(car.fuel);
      const matchPrice = priceDay <= maxPrice;
      const matchCity  = cityVal === '' || carCities.some(c => c.toLowerCase().includes(cityVal.toLowerCase()));
      return matchTrans && matchFuel && matchPrice && matchCity;
    });

    if (sortBy === 'price-asc')  filtered.sort((a, b) => (a.price_day || a.price_per_day || 0) - (b.price_day || b.price_per_day || 0));
    else if (sortBy === 'price-desc') filtered.sort((a, b) => (b.price_day || b.price_per_day || 0) - (a.price_day || a.price_per_day || 0));
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    renderCarsGrid();
  }

  function renderCarsGrid() {
    const countEl = document.getElementById('cars-count');
    if (countEl) countEl.textContent = `${filtered.length} car${filtered.length !== 1 ? 's' : ''} found`;

    if (filtered.length === 0) {
      carsGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-tertiary)">
          <div style="font-size:3rem;margin-bottom:16px">🚗</div>
          <p style="font-size:1.125rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px">No cars found</p>
          <p>Try adjusting your filters.</p>
        </div>`;
      return;
    }
    carsGrid.innerHTML = filtered.map(c => renderCarCard(c)).join('');
    reObserveFadeEls(carsGrid);
  }

  document.querySelectorAll('.filter-trans, .filter-fuel').forEach(el => el.addEventListener('change', applyFilters));
  document.getElementById('price-range')?.addEventListener('input', (e) => {
    const d = document.getElementById('price-display');
    if (d) d.textContent = `₹${parseInt(e.target.value).toLocaleString('en-IN')}`;
    applyFilters();
  });
  document.getElementById('filter-city')?.addEventListener('change', applyFilters);
  document.getElementById('sort-by')?.addEventListener('change', applyFilters);

  loadCars();
}

// ====== CAR DETAIL PAGE ======
const detailRoot = document.getElementById('car-detail-root');
if (detailRoot) {
  const initDetail = async () => {
    const params = new URLSearchParams(window.location.search);
    const carId  = parseInt(params.get('id') || '1');
    let selectedDuration = 'day'; // default

    let car = CARS_DATA.find(c => c.id === carId) || CARS_DATA[0];
    if (typeof dbGetCarById === 'function') {
      try {
        const { data, error } = await dbGetCarById(carId);
        if (data && !error) car = data;
      } catch (err) {
        console.warn('Error fetching car by id:', err);
      }
    }

    const prices = {
      '6hr':  car.price_6hr  || car.price_per_6hr  || 0,
      '12hr': car.price_12hr || car.price_per_12hr || 0,
      'day':  car.price_day  || car.price_per_day  || 0
    };
    const carImage  = car.image || car.image_url;
    const carFeats  = car.features || [];
    const carCities = Array.isArray(car.cities) ? car.cities : [car.city || ''];

    // Populate duration button prices
    const p6  = document.getElementById('dur-price-6hr');
    const p12 = document.getElementById('dur-price-12hr');
    const pd  = document.getElementById('dur-price-day');
    if (p6)  p6.textContent  = `₹${prices['6hr'].toLocaleString('en-IN')}`;
    if (p12) p12.textContent = `₹${prices['12hr'].toLocaleString('en-IN')}`;
    if (pd)  pd.textContent  = `₹${prices['day'].toLocaleString('en-IN')}`;

    // Gallery
    document.getElementById('gallery-main-img').src = carImage;
    document.getElementById('gallery-main-img').alt = car.name;
    document.querySelectorAll('.gallery-thumb img').forEach(img => {
      img.src = carImage; img.alt = car.name;
    });

    // Car info
    document.getElementById('detail-car-name').textContent    = car.name;
    document.getElementById('detail-car-name-h1').textContent = car.name;
    document.getElementById('detail-color').textContent       = car.color || '—';
    document.getElementById('detail-cities').textContent      = carCities.join(' & ');
    document.getElementById('detail-rating').textContent      = `★ ${car.rating} (${car.reviews || car.review_count || 0} reviews)`;
    document.getElementById('detail-rating-small').textContent= `${car.rating} (${car.reviews || car.review_count || 0} reviews)`;
    document.getElementById('detail-transmission').textContent= car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);
    document.getElementById('detail-fuel').textContent        = car.fuel.charAt(0).toUpperCase() + car.fuel.slice(1);
    document.getElementById('detail-seats').textContent       = car.seats;
    document.getElementById('detail-km').textContent         = `${car.km || car.km_per_day || 300} km/day`;

    // Features
    const featureList = document.getElementById('detail-features');
    if (featureList) {
      const feats = Array.isArray(carFeats) ? carFeats : JSON.parse(carFeats || '[]');
      featureList.innerHTML = feats.map(f => `
        <li style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);font-size:0.9375rem;color:var(--text-secondary)">
          <span style="color:var(--text-primary);font-weight:700">✓</span> ${f}
        </li>`).join('');
    }

    // Similar cars
    const similarGrid = document.getElementById('similar-cars-grid');
    if (similarGrid) {
      const similar = CARS_DATA.filter(c => c.id !== carId).slice(0, 3);
      similarGrid.innerHTML = similar.map(c => renderCarCard(c)).join('');
      reObserveFadeEls(similarGrid);
    }

    // ── Setup Date & Time constraints ──
    const pickupInput = document.getElementById('booking-pickup');
    const timeSelect = document.getElementById('booking-time');
    const todayStr = new Date().toISOString().split('T')[0];

    if (pickupInput) {
      pickupInput.min = todayStr;
      if (!pickupInput.value || pickupInput.value < todayStr) {
        pickupInput.value = todayStr;
      }
    }

    function updateTimePickerOptions() {
      if (!timeSelect || !pickupInput) return;
      const selectedDate = pickupInput.value;
      const now = new Date();
      const isToday = (selectedDate === todayStr);
      const currentHour = now.getHours();

      let firstValidValue = '';
      Array.from(timeSelect.options).forEach(opt => {
        if (!opt.value) return;
        const hour = parseInt(opt.value.split(':')[0], 10);
        if (isToday && hour <= currentHour) {
          opt.disabled = true;
          opt.style.display = 'none';
        } else {
          opt.disabled = false;
          opt.style.display = 'block';
          if (!firstValidValue) firstValidValue = opt.value;
        }
      });

      if (timeSelect.options[timeSelect.selectedIndex]?.disabled) {
        timeSelect.value = firstValidValue;
      } else if (!timeSelect.value && firstValidValue) {
        timeSelect.value = firstValidValue;
      }
    }

    if (pickupInput) {
      pickupInput.addEventListener('change', () => {
        if (pickupInput.value < todayStr) pickupInput.value = todayStr;
        updateTimePickerOptions();
        calcBooking();
      });
      pickupInput.addEventListener('input', () => {
        updateTimePickerOptions();
        calcBooking();
      });
    }
    updateTimePickerOptions();

    // ── Duration selector ──
    function updateDurationUI() {
      document.querySelectorAll('.dur-btn').forEach(btn => {
        const active = btn.dataset.dur === selectedDuration;
        btn.style.background  = active ? 'var(--accent-white)' : 'var(--bg-surface)';
        btn.style.color       = active ? 'var(--text-inverse)' : 'var(--text-secondary)';
        btn.style.borderColor = active ? 'var(--accent-white)' : 'var(--border-default)';
        btn.style.fontWeight  = active ? '700' : '500';
      });

      // Show/hide number of days row (only for full day)
      const daysRow = document.getElementById('days-row');
      if (daysRow) daysRow.style.display = selectedDuration === 'day' ? 'block' : 'none';

      // Update booking price label
      const p = prices[selectedDuration];
      const label = DURATIONS[selectedDuration]?.label || '';
      document.getElementById('detail-price').textContent         = `₹${p.toLocaleString('en-IN')}`;
      document.getElementById('booking-price-label').textContent  = label;
      document.getElementById('booking-base-price').textContent   = `₹${p.toLocaleString('en-IN')}/${label}`;

      calcBooking();
    }

    document.querySelectorAll('.dur-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDuration = btn.dataset.dur;
        updateDurationUI();
      });
    });
    updateDurationUI();

    // ── Booking Calculator ──
    function calcBooking() {
      const pickupDate = document.getElementById('booking-pickup')?.value;
      const pickupTime = document.getElementById('booking-time')?.value;
      if (!pickupDate || !pickupTime) {
        document.getElementById('booking-breakdown').style.display = 'none';
        return;
      }

      let units = 1;
      let unitLabel = DURATIONS[selectedDuration]?.label || '';

      if (selectedDuration === 'day') {
        const numDays = parseInt(document.getElementById('booking-days-select')?.value || '1', 10);
        units = numDays;
        unitLabel = numDays === 1 ? '1 day' : `${numDays} days`;
      }

      const pricePerUnit = prices[selectedDuration];
      const base      = pricePerUnit * units;
      const total     = base;

      document.getElementById('booking-units').textContent       = unitLabel;
      document.getElementById('booking-base-total').textContent  = `₹${base.toLocaleString('en-IN')}`;
      document.getElementById('booking-total').textContent       = `₹${total.toLocaleString('en-IN')}`;
      document.getElementById('booking-breakdown').style.display = 'block';

      // Auto dropoff date
      const d = new Date(pickupDate);
      d.setDate(d.getDate() + units);
      const calculatedDropoff = d.toISOString().split('T')[0];

      window._bookingData = { 
        carId, 
        carName: car.name, 
        units, 
        totalPrice: total, 
        base, 
        duration: selectedDuration, 
        durationLabel: unitLabel,
        dropoffDate: calculatedDropoff
      };
    }

    document.getElementById('booking-days-select')?.addEventListener('change', calcBooking);
    document.getElementById('booking-time')?.addEventListener('change', calcBooking);

    // ── Book Now → WhatsApp Enquiry ──
    document.getElementById('book-now-btn')?.addEventListener('click', () => {
      const pickupDate    = document.getElementById('booking-pickup')?.value;
      const pickupTime    = document.getElementById('booking-time')?.value;
      const city          = document.getElementById('booking-city')?.value;
      const name          = document.getElementById('booking-name')?.value?.trim();
      const phone         = document.getElementById('booking-phone')?.value?.trim();
      const tripType      = document.getElementById('booking-trip-type')?.value || '';
      const passengers    = document.getElementById('booking-passengers')?.value || '';
      const destination   = document.getElementById('booking-destination')?.value?.trim() || '';
      const additionalReqs = document.getElementById('booking-additional')?.value?.trim() || '';

      if (!pickupDate) { alert('Please select a pick-up date.'); return; }
      if (!pickupTime) { alert('Please select a pick-up time.'); return; }
      if (!city)       { alert('Please select a pickup city.'); return; }
      if (!name)       { alert('Please enter your full name.'); return; }
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        alert('Please enter a valid 10-digit mobile number.'); return;
      }

      calcBooking();
      const bd = window._bookingData || {};

      const btn = document.getElementById('book-now-btn');
      btn.textContent = 'Opening WhatsApp...';
      btn.disabled = true;

      const success = sendWhatsAppEnquiry({
        carName:       car.name,
        customerName:  name,
        customerPhone: phone,
        pickupDate,
        pickupTime,
        city,
        destination,
        tripType,
        passengers,
        additionalReqs,
        durationLabel: bd.durationLabel || DURATIONS[selectedDuration]?.label || 'Full Day',
        units:         bd.units || 1
      });

      // Show result modal
      const modalIcon  = document.querySelector('#booking-modal .modal-icon');
      const modalTitle = document.querySelector('#booking-modal .modal-title');
      const modalDesc  = document.querySelector('#booking-modal .modal-desc');

      if (success) {
        if (modalIcon)  modalIcon.textContent  = '💬';
        if (modalTitle) modalTitle.textContent  = 'WhatsApp Opened!';
        if (modalDesc)  modalDesc.textContent   = 'WhatsApp has opened with your enquiry pre-filled. Please press Send in WhatsApp to complete your booking enquiry. This is not a confirmation — we will confirm once we review your request.';
      } else {
        if (modalIcon)  modalIcon.textContent  = '⚠️';
        if (modalTitle) modalTitle.textContent  = 'Could not open WhatsApp';
        if (modalDesc)  modalDesc.innerHTML    = `WhatsApp could not be opened automatically. Please contact us directly:<br><br><strong>📱 WhatsApp: <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" style="color:var(--accent-white)">+${WHATSAPP_NUMBER}</a></strong>`;
      }
      document.getElementById('booking-modal')?.classList.add('open');

      btn.textContent = 'Enquire on WhatsApp';
      btn.disabled = false;
    });

    document.getElementById('modal-close')?.addEventListener('click', () => {
      document.getElementById('booking-modal')?.classList.remove('open');
    });
    document.getElementById('booking-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetail);
  } else {
    initDetail();
  }
}

// ====== BECOME HOST FORM ======
const hostForm = document.getElementById('host-form');
if (hostForm) {
  let currentStep = 1;
  const totalSteps = 4;

  function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step-${step}`)?.classList.remove('hidden');
    document.querySelectorAll('.step-indicator').forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i + 1 < step)        el.classList.add('done');
      else if (i + 1 === step) el.classList.add('active');
    });
    const prevBtn   = document.getElementById('step-prev');
    const nextBtn   = document.getElementById('step-next');
    const submitBtn = document.getElementById('step-submit');
    if (prevBtn)   prevBtn.style.display   = step === 1          ? 'none' : 'inline-flex';
    if (nextBtn)   nextBtn.style.display   = step === totalSteps ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
    const progressBar = document.getElementById('form-progress');
    if (progressBar) progressBar.style.width = `${(step / totalSteps) * 100}%`;
  }

  document.getElementById('step-next')?.addEventListener('click', () => {
    if (currentStep < totalSteps) { currentStep++; showStep(currentStep); }
  });
  document.getElementById('step-prev')?.addEventListener('click', () => {
    if (currentStep > 1) { currentStep--; showStep(currentStep); }
  });
  document.getElementById('step-submit')?.addEventListener('click', async () => {
    const btn = document.getElementById('step-submit');
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    await dbCreateHostListing({ car_make: 'N/A', host_name: 'N/A', host_email: 'N/A', host_phone: 'N/A' });
    btn.textContent = '🚀 Submit Listing';
    btn.disabled = false;
    document.getElementById('success-modal')?.classList.add('open');
  });
  document.getElementById('success-modal-close')?.addEventListener('click', () => {
    document.getElementById('success-modal')?.classList.remove('open');
    window.location.href = 'index.html';
  });

  showStep(1);
}
