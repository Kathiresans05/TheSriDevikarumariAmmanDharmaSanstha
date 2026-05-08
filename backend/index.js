const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      /\.vercel\.app$/,
      /\.onrender\.com$/
    ];
    
    const isAllowed = allowed.some(pattern => 
      typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
};

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register attempts per hour
  message: { message: "Too many authentication attempts, please try again after an hour" }
});

app.use(helmet()); // Set security HTTP headers
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body, with limit
// app.use(mongoSanitize()); // Disabled due to Express 5 compatibility issues

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Global Request Logger (Simplified for security)
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Auth Middleware
const auth = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database is still connecting. Please wait..." });
  }
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_me');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin Middleware
const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (!user.isAdmin && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Authorization error' });
  }
};

// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'temple_gallery',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov']
  }
});

const upload = multer({ storage: storage });

// Upload Route (Moved up for priority)
app.post('/api/upload', auth, (req, res, next) => {
  console.log('>>> [Server] UPLOAD ROUTE HIT <<<');
  next();
}, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ url: req.file.path, id: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
});


// MongoDB Connection
mongoose.set('bufferCommands', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully [v2.1]'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toLocaleTimeString() });
});


const TempleSettings = require('./models/TempleSettings');

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    if (email === process.env.ADMIN_EMAIL) {
      user.isAdmin = true;
      user.role = 'admin';
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const isAdmin = user.isAdmin;
    const token = jwt.sign(
      { id: user._id, isAdmin }, 
      process.env.JWT_SECRET || 'fallback_secret_change_me', 
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const isAdmin = user.isAdmin || user.role === 'admin' || user.email === process.env.ADMIN_EMAIL;
    const token = jwt.sign(
      { id: user._id, isAdmin }, 
      process.env.JWT_SECRET || 'fallback_secret_change_me', 
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin } });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Protected Booking Route
app.post('/api/bookings', auth, async (req, res) => {
  const { sevaId, date, time, amount, devoteeName, gothram, transactionId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    console.log(`Booking Request from ${user.name}:`, req.body);
    
    user.bookings.push({ 
      sevaId, 
      date, 
      time, 
      amount, 
      devoteeName, 
      gothram, 
      transactionId,
      status: 'Pending Verification'
    });
    
    user.markModified('bookings');
    await user.save();
    console.log(`Booking saved for ${user.name} (Transaction: ${transactionId}).`);
    res.json(user.bookings);
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Protected Donation Route
app.post('/api/donations', auth, async (req, res) => {
  const { amount, cause, transactionId, receipt } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.donations.push({ amount, cause, transactionId, receipt });
    await user.save();
    res.json(user.donations);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Routes
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await TempleSettings.findOne();
    if (!settings) {
      // Seed initial data if none exists
      settings = await TempleSettings.create({
        name: "The Sri Devikarumari Amman Dharma Sanstha",
        email: "info@devikarumari.org",
        phone: "+91 44 2680 0430",
        address: "123, Amman Koil Street, Thiruverkadu, Chennai - 600077",
        officeHours: "Monday - Sunday: 9:00 AM - 6:00 PM",
        specialDays: "6:00 AM - 10:00 PM",
        timings: {
          morning: { open: "06:00 AM", close: "12:30 PM" },
          evening: { open: "04:00 PM", close: "09:00 PM" }
        },
        sevas: [
          { id: 1, name: 'Nitya Pooja', desc: 'Daily ritual performed for the well-being of all devotees.', price: '₹101', icon: 'ॐ', isFeatured: true },
          { id: 2, name: 'Abishekam', desc: 'Sacred bathing ritual with milk, honey, and herbal powders.', price: '₹501', icon: '🪔', isFeatured: true },
          { id: 3, name: 'Anna Prasadam', desc: 'Sponsoring the daily sacred meal for 50+ devotees.', price: '₹2500', icon: '🍲', isFeatured: true },
          { id: 4, name: 'Kalyana Utsavam', desc: 'Grand ceremonial wedding ritual for the Divine Couple.', price: '₹5000', icon: '🌸', isFeatured: true },
        ],
        gallery: [
          { id: 'g1', url: 'https://images.unsplash.com/photo-1602353620107-578bc77b7bc2?auto=format&fit=crop&q=80', title: 'Main Gopuram', type: 'photo', isFeatured: true },
          { id: 'g2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', title: 'Sacred Sanctum', type: 'photo', isFeatured: true },
          { id: 'g3', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80', title: 'Temple Architecture', type: 'photo', isFeatured: true },
          { id: 'g4', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80', title: 'Evening Deepam', type: 'photo', isFeatured: true },
          { id: 'g5', url: 'https://images.unsplash.com/photo-1524492459585-1250f878f681?auto=format&fit=crop&q=80', title: 'Grand Utsavam', type: 'photo', isFeatured: false },
          { id: 'g6', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80', title: 'Morning Rituals', type: 'photo', isFeatured: false },
        ],
        events: [
          { id: '1', title: 'Navaratri Festival', date: 'Oct 15 - Oct 24, 2026', time: 'Full Day', desc: 'Grand 10-day celebration of Goddess Durga.', type: 'Festival', attendees: '50,000+', isFeatured: true },
          { id: '2', title: 'Deepavali Special Pooja', date: 'Nov 01, 2026', time: '6:00 PM', desc: 'Auspicious Lakshmi Pooja and lighting of 1008 lamps.', type: 'Festival', attendees: '15,000+', isFeatured: true },
        ]
      });
    } else {
      let needsSave = false;
      if (!settings.events || settings.events.length === 0) {
        settings.events = [
          { id: '1', title: 'Navaratri Festival', date: 'Oct 15, 2026', time: 'Full Day', desc: 'Grand 10-day celebration of Goddess Durga.', type: 'Festival', attendees: '50,000+', isFeatured: true },
          { id: '2', title: 'Deepavali Special Pooja', date: 'Nov 01, 2026', time: '6:00 PM', desc: 'Auspicious Lakshmi Pooja and lighting of 1008 lamps.', type: 'Festival', attendees: '15,000+', isFeatured: true },
        ];
        needsSave = true;
      }
      if (!settings.gallery || settings.gallery.length === 0) {
        settings.gallery = [
          { id: 'g1', url: 'https://images.unsplash.com/photo-1602353620107-578bc77b7bc2?auto=format&fit=crop&q=80', title: 'Main Gopuram', type: 'photo', isFeatured: true },
          { id: 'g2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80', title: 'Sacred Sanctum', type: 'photo', isFeatured: true },
          { id: 'g3', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80', title: 'Temple Architecture', type: 'photo', isFeatured: true },
          { id: 'g4', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80', title: 'Evening Deepam', type: 'photo', isFeatured: true },
          { id: 'g5', url: 'https://images.unsplash.com/photo-1524492459585-1250f878f681?auto=format&fit=crop&q=80', title: 'Grand Utsavam', type: 'photo', isFeatured: false },
          { id: 'g6', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80', title: 'Morning Rituals', type: 'photo', isFeatured: false },
        ];
        needsSave = true;
      }
      if (needsSave) await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch settings from database" });
  }
});

app.post('/api/settings', auth, admin, async (req, res) => {
  try {
    let settings = await TempleSettings.findOne();
    if (settings) {
      // Explicitly update fields to ensure deep nesting and arrays are handled
      const updateData = req.body;
      
      // Top level fields
      ['name', 'email', 'phone', 'address', 'officeHours', 'specialDays'].forEach(key => {
        if (updateData[key] !== undefined) settings[key] = updateData[key];
      });

      // Nested timings
      if (updateData.timings) {
        settings.timings = {
          morning: { ...settings.timings.morning, ...updateData.timings.morning },
          evening: { ...settings.timings.evening, ...updateData.timings.evening }
        };
        settings.markModified('timings');
      }

      // Arrays
      if (updateData.sevas) { settings.sevas = updateData.sevas; settings.markModified('sevas'); }
      if (updateData.gallery) { settings.gallery = updateData.gallery; settings.markModified('gallery'); }
      if (updateData.events) { settings.events = updateData.events; settings.markModified('events'); }

      await settings.save();
    } else {
      const { name, email, phone, address, officeHours, specialDays, timings, sevas, gallery, events } = req.body;
      settings = await TempleSettings.create({ name, email, phone, address, officeHours, specialDays, timings, sevas, gallery, events });
    }
    console.log('[Server] Settings updated successfully');
    res.json(settings);
  } catch (err) {
    console.error('[Server] Settings update failed:', err);
    res.status(500).json({ message: "Failed to save settings to database", error: err.message });
  }
});

app.get('/api/admin/bookings', auth, admin, async (req, res) => {
  console.log('>>> Admin Bookings Request Received at ' + new Date().toLocaleTimeString() + ' <<<');
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database not connected yet", error: "Connection state is " + mongoose.connection.readyState });
  }
  try {
    const users = await User.find().maxTimeMS(5000).lean();
    console.log(`[Admin] Fetching all bookings. Total users found: ${users.length}`);
    
    let allBookings = [];
    users.forEach(user => {
      if (user.bookings && user.bookings.length > 0) {
        user.bookings.forEach(booking => {
          allBookings.push({
            bookingId: booking._id,
            userId: user._id,
            devoteeName: user.name,
            pooja: booking.sevaId,
            date: booking.date,
            time: booking.time,
            status: booking.status,
            amount: booking.amount
          });
        });
      }
    });
    
    console.log(`[Admin] Total bookings aggregated: ${allBookings.length}`);
    res.json(allBookings);
  } catch (err) {
    console.error('[Admin] Fetch error:', err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});

app.patch('/api/admin/bookings/:userId/:bookingId', auth, admin, async (req, res) => {
  try {
    const { userId, bookingId } = req.params;
    const { status } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const booking = user.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    booking.status = status;
    await user.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});

app.get('/api/admin/donations', auth, admin, async (req, res) => {
  try {
    const users = await User.find({}, 'donations name');
    let allDonations = [];
    users.forEach(user => {
      if (user.donations) {
        user.donations.forEach(donation => {
          allDonations.push({
            id: donation._id,
            userId: user._id,
            devoteeName: user.name,
            amount: donation.amount,
            cause: donation.cause,
            transactionId: donation.transactionId,
            receipt: donation.receipt,
            status: donation.status,
            date: donation.date
          });
        });
      }
    });
    // Sort by date descending
    allDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(allDonations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

app.patch('/api/admin/donations/:userId/:donationId', auth, admin, async (req, res) => {
  try {
    const { userId, donationId } = req.params;
    const { status } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const donation = user.donations.id(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    
    donation.status = status;
    await user.save();
    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update donation status" });
  }
});

app.get('/', (req, res) => {
  res.send('Temple API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
