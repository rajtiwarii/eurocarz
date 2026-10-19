// EuroCarz Interactive Showcase & Booking Logic

const FLEET_DATA = [
  {
    id: 1,
    name: "Porsche 911 GT3 RS",
    brand: "Porsche",
    body: "Coupe",
    tagline: "Motorsport Aerodynamics & Pure Atmospheric Flat-Six",
    price: 65000,
    priceStr: "₹65,000",
    hp: "518 HP",
    acceleration: "3.2s",
    topSpeed: "296 km/h",
    engine: "4.0L Naturally Aspirated Flat-6",
    transmission: "7-Speed PDK",
    badge: "Track Icon",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Mercedes-AMG G63",
    brand: "Mercedes-AMG",
    body: "Super SUV",
    tagline: "Iconic Rugged Prestige with Twin-Turbocharged V8 Roar",
    price: 55000,
    priceStr: "₹55,000",
    hp: "577 HP",
    acceleration: "4.5s",
    topSpeed: "240 km/h",
    engine: "4.0L Bi-Turbo Handcrafted V8",
    transmission: "AMG SPEEDSHIFT TCT 9G",
    badge: "VIP Luxury",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "BMW M8 Competition Gran Coupe",
    brand: "BMW M",
    body: "Luxury Sedan",
    tagline: "Uncompromising Executive Luxury with M xDrive Power",
    price: 48000,
    priceStr: "₹48,000",
    hp: "617 HP",
    acceleration: "3.2s",
    topSpeed: "305 km/h",
    engine: "4.4L M TwinPower Turbo V8",
    transmission: "8-Speed M Steptronic",
    badge: "Grand Tourer",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Audi RS6 Avant Performance",
    brand: "Audi RS",
    body: "Super Estate",
    tagline: "The Ultimate Super-Wagon with quattro All-Wheel Drive",
    price: 45000,
    priceStr: "₹45,000",
    hp: "621 HP",
    acceleration: "3.4s",
    topSpeed: "280 km/h",
    engine: "4.0L TFSI Twin-Turbo V8",
    transmission: "8-Speed Tiptronic",
    badge: "Stealth Beast",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Lamborghini Huracán Evo",
    brand: "Lamborghini",
    body: "Supercar",
    tagline: "Unfiltered Italian Drama with Screaming V10 Symphony",
    price: 85000,
    priceStr: "₹85,000",
    hp: "631 HP",
    acceleration: "2.9s",
    topSpeed: "325 km/h",
    engine: "5.2L Naturally Aspirated V10",
    transmission: "7-Speed Dual Clutch (LDF)",
    badge: "Exotic",
    image: "https://images.unsplash.com/photo-1519245659698-2358b16a282c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Ferrari F8 Tributo",
    brand: "Ferrari",
    body: "Supercar",
    tagline: "Tribute to the Most Celebrated V8 Engine in Maranello History",
    price: 95000,
    priceStr: "₹95,000",
    hp: "710 HP",
    acceleration: "2.9s",
    topSpeed: "340 km/h",
    engine: "3.9L Twin-Turbocharged V8",
    transmission: "7-Speed F1 Dual Clutch",
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    name: "Range Rover SV Autobiography",
    brand: "Range Rover",
    body: "Super SUV",
    tagline: "First-Class Airline Luxury on Any Terrain",
    price: 50000,
    priceStr: "₹50,000",
    hp: "523 HP",
    acceleration: "4.6s",
    topSpeed: "261 km/h",
    engine: "4.4L Twin-Turbo V8",
    transmission: "8-Speed Automatic",
    badge: "Chauffeur Choice",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    name: "Porsche Taycan Turbo S",
    brand: "Porsche",
    body: "Electric Sedan",
    tagline: "Instant Electric Torment with Unyielding Porsche Precision",
    price: 42000,
    priceStr: "₹42,000",
    hp: "750 HP",
    acceleration: "2.8s",
    topSpeed: "260 km/h",
    engine: "Dual Permanent Magnet Electric Motors",
    transmission: "2-Speed Rear / 1-Speed Front",
    badge: "All-Electric",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
  }
];

let currentFilterBrand = 'all';
let currentSearchQuery = '';
let activeSelectedCar = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderFleet();

  // Set default dates in booking modal
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const pickupEl = document.getElementById('pickupDate');
  const returnEl = document.getElementById('returnDate');
  if (pickupEl && returnEl) {
    pickupEl.value = formatDate(today);
    returnEl.value = formatDate(tomorrow);
  }
});

// Render Fleet Grid
function renderFleet() {
  const grid = document.getElementById('fleetGrid');
  if (!grid) return;

  const filtered = FLEET_DATA.filter(car => {
    const matchesBrand = (currentFilterBrand === 'all') || (car.brand.toLowerCase() === currentFilterBrand.toLowerCase());
    const matchesSearch = car.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                          car.brand.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          car.body.toLowerCase().includes(currentSearchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <p class="text-sm font-semibold text-slate-400">No vehicles match your search criteria.</p>
        <button onclick="resetFilters()" class="mt-3 px-4 py-2 rounded-xl bg-gold-400 text-black text-xs font-bold">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(car => `
    <div class="rounded-3xl glass-card border border-dark-border overflow-hidden hover:border-gold-400/50 transition duration-300 group flex flex-col justify-between">
      <div>
        <!-- Car Image & Badges -->
        <div class="relative aspect-video overflow-hidden bg-black">
          <img src="${car.image}" alt="${car.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute top-3 left-3 flex gap-2">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur text-gold-400 border border-gold-400/30">
              ${car.badge}
            </span>
          </div>
          <div class="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur text-[11px] font-bold text-white">
            ${car.body}
          </div>
        </div>

        <!-- Car Info -->
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${car.brand}</span>
            <span class="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Available Now
            </span>
          </div>

          <h3 class="text-lg font-display font-extrabold text-white group-hover:text-gold-400 transition leading-snug">
            ${car.name}
          </h3>

          <!-- Mini specs row -->
          <div class="grid grid-cols-3 gap-2 py-2 border-y border-dark-border text-center text-xs">
            <div>
              <p class="text-slate-500 text-[10px]">Power</p>
              <p class="font-bold text-white text-[11px]">${car.hp}</p>
            </div>
            <div>
              <p class="text-slate-500 text-[10px]">0-100</p>
              <p class="font-bold text-gold-400 text-[11px]">${car.acceleration}</p>
            </div>
            <div>
              <p class="text-slate-500 text-[10px]">Top Speed</p>
              <p class="font-bold text-white text-[11px]">${car.topSpeed}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="px-5 pb-5 pt-1 flex items-center justify-between gap-3">
        <div>
          <span class="text-[10px] text-slate-500 block">Daily Rental</span>
          <span class="text-base font-display font-black text-white">${car.priceStr}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="openCarDetailModal(${car.id})" class="px-3 py-2 rounded-xl bg-dark-base border border-dark-border hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition">
            Details
          </button>
          <button onclick="openBookingModal(${car.id})" class="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-black font-extrabold text-xs transition">
            Book
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter handlers
function setFilter(brand, btn) {
  currentFilterBrand = brand;
  document.querySelectorAll('.filter-chip').forEach(b => {
    b.className = 'filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition bg-dark-base border border-dark-border text-slate-300 hover:text-white hover:border-slate-700';
  });
  if (btn) {
    btn.className = 'filter-chip active-filter px-4 py-2 rounded-xl text-xs font-bold transition bg-gold-400 text-black shadow-md';
  }
  renderFleet();
}

function filterCars() {
  const input = document.getElementById('carSearch');
  currentSearchQuery = input ? input.value : '';
  renderFleet();
}

function resetFilters() {
  currentFilterBrand = 'all';
  currentSearchQuery = '';
  const searchInput = document.getElementById('carSearch');
  if (searchInput) searchInput.value = '';
  setFilter('all', document.querySelector('.filter-chip'));
}

// Car Detail Modal Handlers (Matching 'Car Detail — EuroCarz')
function openCarDetailModal(carId) {
  const car = FLEET_DATA.find(c => c.id === carId);
  if (!car) return;
  activeSelectedCar = car;

  document.getElementById('detailBadge').innerText = car.brand;
  document.getElementById('detailTitle').innerText = car.name;
  document.getElementById('detailTagline').innerText = car.tagline;
  document.getElementById('detailImage').src = car.image;
  document.getElementById('detailHp').innerText = car.hp;
  document.getElementById('detail0100').innerText = car.acceleration;
  document.getElementById('detailTopSpeed').innerText = car.topSpeed;
  document.getElementById('detailEngine').innerText = car.engine;
  document.getElementById('detailPrice').innerText = car.priceStr;

  document.getElementById('detailBookBtn').onclick = () => {
    closeCarDetailModal();
    openBookingModal(car.id);
  };

  const modal = document.getElementById('carDetailModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCarDetailModal() {
  const modal = document.getElementById('carDetailModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Booking Modal Handlers
function openBookingModal(carId) {
  const car = FLEET_DATA.find(c => c.id === carId) || FLEET_DATA[0];
  activeSelectedCar = car;

  document.getElementById('bookingCarTitle').innerText = `Reserve ${car.name}`;
  document.getElementById('bookingDailyRate').innerText = car.priceStr;
  document.getElementById('bookingEstimatedTotal').innerText = car.priceStr;

  const modal = document.getElementById('bookingModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function handleReservationSubmit(e) {
  e.preventDefault();
  closeBookingModal();

  // Show Toast
  const toast = document.getElementById('toast');
  const carName = activeSelectedCar ? activeSelectedCar.name : 'Supercar';
  document.getElementById('toastTitle').innerText = `${carName} Reserved!`;
  document.getElementById('toastDesc').innerText = 'Our VIP concierge will call within 15 minutes to coordinate delivery.';

  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}

// Mobile menu toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}
