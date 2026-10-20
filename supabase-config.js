// ============================================
// EuroCarz — Supabase & Storage Configuration
// ============================================
// Replace with your actual Supabase project URL and anon key
// from: https://supabase.com/dashboard > Project Settings > API

const SUPABASE_URL = 'https://nzgbjdtgjwzczynkqeag.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MxiLmy5jv1uz1HmYWjP4jg_uO222kFp';

// Initialize Supabase client ONLY if valid credentials exist
let supabase = null;
if (
  SUPABASE_URL && 
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
  SUPABASE_URL.startsWith('https://') && 
  typeof window.supabase !== 'undefined'
) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected');
  } catch (e) {
    console.warn('⚠️ Supabase init error:', e);
    supabase = null;
  }
} else {
  supabase = null;
  console.log('ℹ️ LocalStorage mode active — Bookings & Admin portal are fully functional locally.');
}

// ============================================
// DATABASE & FLEET HELPERS
// ============================================

/**
 * Get custom cars added by Admin from LocalStorage
 */
function getLocalCustomCars() {
  try {
    return JSON.parse(localStorage.getItem('eurocarz_custom_cars') || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Get list of unavailable car IDs from LocalStorage
 */
function getUnavailableCarIds() {
  try {
    return JSON.parse(localStorage.getItem('eurocarz_unavailable_cars') || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Fetch cars (local default + admin added custom cars).
 * @param {boolean} includeUnavailable - whether to include unavailable cars (for admin view)
 */
async function dbGetCars(includeUnavailable = false) {
  let carsList = [...CARS_DATA];
  
  // Merge custom cars
  const customCars = getLocalCustomCars();
  if (customCars.length > 0) {
    carsList = [...carsList, ...customCars];
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('id');
      if (!error && data && data.length > 0) {
        // Create map of Supabase cars by ID
        const dbCarMap = new Map();
        data.forEach(c => dbCarMap.set(c.id, c));

        // Start with CARS_DATA (local definitions take precedence for price and details)
        const mergedList = CARS_DATA.map(localCar => {
          if (dbCarMap.has(localCar.id)) {
            const dbCar = dbCarMap.get(localCar.id);
            dbCarMap.delete(localCar.id);
            return { ...dbCar, ...localCar };
          }
          return localCar;
        });

        // Add any remaining cars that were only in Supabase
        dbCarMap.forEach(dbCar => mergedList.push(dbCar));
        carsList = mergedList;
      }
    } catch (e) {
      console.warn('Supabase getCars error, using local fleet:', e);
    }
  }

  const unavailableIds = getUnavailableCarIds();

  // Mark availability state
  carsList = carsList.map(c => {
    const isUnavail = unavailableIds.includes(c.id) || c.available === false;
    return { ...c, available: !isUnavail };
  });

  if (!includeUnavailable) {
    carsList = carsList.filter(c => c.available);
  }

  return { data: carsList, error: null };
}

/**
 * Fetch a single car by ID.
 */
async function dbGetCarById(id) {
  const { data: allCars } = await dbGetCars(true);
  const targetId = parseInt(id, 10);
  const car = allCars.find(c => c.id == targetId || c.id == id) || allCars[0];
  return { data: car, error: null };
}

/**
 * Admin: Add a new vehicle to the fleet
 */
async function dbAddCar(carData) {
  const newCar = {
    id: Date.now(),
    name:          carData.name,
    color:         carData.color || 'Standard',
    fuel:          carData.fuel || 'petrol',
    transmission:  carData.transmission || 'manual',
    seats:         parseInt(carData.seats || '5'),
    price_day:     parseInt(carData.price_day || '2000'),
    price_12hr:    parseInt(carData.price_12hr || '1200'),
    price_6hr:     parseInt(carData.price_6hr || '700'),
    km:            parseInt(carData.km || '300'),
    cities:        carData.cities || ['Jalandhar', 'Phagwara'],
    image:         carData.image || 'images/roxx.jpg',
    image_url:     carData.image || 'images/roxx.jpg',
    rating:        4.8,
    reviews:       1,
    host:          'EuroCarz Fleet',
    badge:         'New Fleet',
    features:      carData.features || ['AC', 'Power Steering'],
    available:     true
  };

  // Save locally
  try {
    const customCars = getLocalCustomCars();
    customCars.push(newCar);
    localStorage.setItem('eurocarz_custom_cars', JSON.stringify(customCars));
    console.log('✅ Added new car to local storage:', newCar);
  } catch (e) {
    console.error('Save custom car error:', e);
  }

  // Save to Supabase if connected
  if (supabase) {
    try {
      await supabase.from('cars').insert([{
        name:          newCar.name,
        color:         newCar.color,
        fuel:          newCar.fuel,
        transmission:  newCar.transmission,
        seats:         newCar.seats,
        price_day:     newCar.price_day,
        price_12hr:    newCar.price_12hr,
        price_6hr:     newCar.price_6hr,
        cities:        newCar.cities,
        image_url:     newCar.image_url,
        features:      JSON.stringify(newCar.features),
        badge:         newCar.badge,
        available:     true
      }]);
    } catch (err) {
      console.warn('Supabase car insert error:', err);
    }
  }

  return { data: newCar, error: null };
}

/**
 * Admin: Toggle car availability (Available / Unavailable)
 */
async function dbToggleCarAvailability(carId, isAvailable) {
  try {
    let unavailableIds = getUnavailableCarIds();
    if (!isAvailable) {
      if (!unavailableIds.includes(carId)) unavailableIds.push(carId);
    } else {
      unavailableIds = unavailableIds.filter(id => id != carId);
    }
    localStorage.setItem('eurocarz_unavailable_cars', JSON.stringify(unavailableIds));
  } catch (e) {
    console.error('Toggle availability error:', e);
  }

  if (supabase) {
    try {
      await supabase.from('cars').update({ available: isAvailable }).eq('id', carId);
    } catch (err) {
      console.warn('Supabase toggle error:', err);
    }
  }

  return { success: true };
}

/**
 * Submit a booking to Supabase and LocalStorage.
 * @param {Object} booking - Booking details
 */
async function dbCreateBooking(booking) {
  // 1. Resolve carId into valid integer for foreign key constraint
  const parsedId = parseInt(booking.carId, 10);
  const carIdFinal = (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 6) ? parsedId : 1;

  // 2. Sanitize pickup_time to standard TIME format for PostgreSQL ("10:00:00")
  let cleanTime = '10:00:00';
  if (booking.pickupTime) {
    const raw = booking.pickupTime.split(' ')[0]; // e.g. "10:00"
    cleanTime = raw.includes(':') ? (raw.split(':').length === 2 ? raw + ':00' : raw) : '10:00:00';
  }

  const newBooking = {
    id: 'EC-' + Math.floor(100000 + Math.random() * 900000),
    car_id:          carIdFinal,
    car_name:        booking.carName || 'Mahindra XUV 7XO',
    customer_name:   booking.customerName,
    customer_email:  booking.customerEmail,
    customer_phone:  booking.customerPhone,
    pickup_date:     booking.pickupDate,
    pickup_time:     booking.pickupTime || '10:00 AM',
    dropoff_date:    booking.dropoffDate || booking.pickupDate,
    duration:        booking.duration || 'day',
    duration_label:  booking.durationLabel || 'Full Day',
    units:           parseInt(booking.units || '1', 10),
    city:            booking.city,
    total_price:     parseInt(booking.totalPrice || '0', 10),
    advance_amount:  0,
    status:          'pending',
    notes:           booking.carName || 'Vehicle Booking',
    created_at:      new Date().toISOString()
  };

  // Always save to LocalStorage for instant Admin panel access
  try {
    const existing = JSON.parse(localStorage.getItem('eurocarz_bookings') || '[]');
    existing.unshift(newBooking);
    localStorage.setItem('eurocarz_bookings', JSON.stringify(existing));
    console.log('✅ Saved new booking to LocalStorage:', newBooking);
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  // Attempt Supabase sync if enabled
  if (supabase) {
    try {
      const payload = {
        car_id:          carIdFinal,
        customer_name:   booking.customerName,
        customer_email:  booking.customerEmail,
        customer_phone:  booking.customerPhone,
        pickup_date:     booking.pickupDate,
        pickup_time:     cleanTime,
        dropoff_date:    booking.dropoffDate || booking.pickupDate,
        duration:        booking.duration || 'day',
        duration_label:  booking.durationLabel || 'Full Day',
        units:           parseInt(booking.units || '1', 10),
        city:            booking.city,
        total_price:     newBooking.total_price,
        status:          'pending',
        notes:           booking.carName || 'Vehicle Booking',
        created_at:      new Date().toISOString()
      };

      console.log('📤 Sending booking payload to Supabase:', payload);

      const { data, error } = await supabase
        .from('bookings')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        data.car_name = booking.carName;
        console.log('🎉 Successfully saved booking to Supabase DB:', data);
        return { data, error: null };
      } else if (error) {
        console.warn('⚠️ Supabase insert warning:', error);
      }
    } catch (err) {
      console.warn('⚠️ Supabase insert exception:', err);
    }
  }

  return { data: newBooking, error: null };
}

/**
 * Fetch all bookings (for Admin Dashboard).
 * Merges Supabase bookings and LocalStorage bookings so nothing is ever missed!
 */
async function dbGetBookings() {
  let supabaseBookings = [];
  let localBookings    = [];

  // 1. Fetch from LocalStorage
  try {
    localBookings = JSON.parse(localStorage.getItem('eurocarz_bookings') || '[]');
  } catch (e) {
    localBookings = [];
  }

  // 2. Fetch from Supabase
  if (supabase) {
    try {
      let { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !data) {
        console.warn('Supabase fetch query warning:', error);
      } else {
        supabaseBookings = data;
      }
    } catch (e) {
      console.warn('Supabase fetch error, fallback to LocalStorage:', e);
    }
  }

  // Combine and deduplicate
  const combinedMap = new Map();

  // Add local bookings first
  localBookings.forEach(b => {
    if (b && b.id) combinedMap.set(String(b.id), b);
  });

  // Add/merge Supabase bookings
  supabaseBookings.forEach(sb => {
    const carNameResolved = (sb.cars ? sb.cars.name : null) || sb.notes || sb.car_name || 'Vehicle';
    const normalized = {
      ...sb,
      car_name: carNameResolved,
      id: sb.id || ('SB-' + Math.floor(Math.random() * 10000))
    };
    combinedMap.set(String(normalized.id), normalized);
  });

  const finalBookings = Array.from(combinedMap.values());
  finalBookings.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

  return { data: finalBookings, error: null };
}

/**
 * Update Booking Status (Pending -> Accepted / Rejected / Completed / Cancelled)
 */
async function dbUpdateBookingStatus(bookingId, newStatus, advanceAmount = 0) {
  // Update LocalStorage first
  try {
    const localData = JSON.parse(localStorage.getItem('eurocarz_bookings') || '[]');
    const idx = localData.findIndex(b => b.id == bookingId || String(b.id) === String(bookingId));
    if (idx !== -1) {
      localData[idx].status = newStatus;
      if (advanceAmount > 0) {
        localData[idx].advance_amount = advanceAmount;
      }
      localStorage.setItem('eurocarz_bookings', JSON.stringify(localData));
    }
  } catch (e) {
    console.error('LocalStorage update error:', e);
  }

  if (supabase) {
    try {
      const payload = { status: newStatus };
      if (advanceAmount > 0) payload.notes = `Advance Taken: ₹${advanceAmount}`;
      await supabase
        .from('bookings')
        .update(payload)
        .eq('id', bookingId);
    } catch (e) {
      console.warn('Supabase update status error:', e);
    }
  }

  return { data: { success: true }, error: null };
}

/**
 * Submit a host listing request to Supabase.
 */
async function dbCreateHostListing(listing) {
  if (!supabase) {
    console.warn('Supabase not configured — listing not saved to DB');
    return { data: { id: 'demo-' + Date.now() }, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('host_listings')
      .insert([{
        ...listing,
        status:     'pending_review',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    return { data, error };
  } catch (e) {
    return { data: { id: 'demo-' + Date.now() }, error: e };
  }
}
