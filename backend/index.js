const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      /\.vercel\.app$/,      // Allow any Vercel deployment
      /\.onrender\.com$/     // Allow any Render domain
    ];
    
    const isAllowed = allowed.some(pattern => 
      typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, true); // Allow all for now — tighten later
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*all', cors(corsOptions)); // Handle preflight requests
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

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
app.post('/api/upload', (req, res, next) => {
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

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

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

// Auth Middleware
const auth = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database is still connecting. Please wait..." });
  }
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, 'temple_secret_key');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

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
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, 'temple_secret_key', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'temple_secret_key', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
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
    res.status(500).send('Server Error');
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
    res.status(500).send('Server Error');
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
        gallery: [],
        events: [
          { id: '1', title: 'Navaratri Festival', date: 'Oct 15 - Oct 24, 2026', time: 'Full Day', desc: 'Grand 10-day celebration of Goddess Durga.', type: 'Festival', attendees: '50,000+', isFeatured: true },
          { id: '2', title: 'Deepavali Special Pooja', date: 'Nov 01, 2026', time: '6:00 PM', desc: 'Auspicious Lakshmi Pooja and lighting of 1008 lamps.', type: 'Festival', attendees: '15,000+', isFeatured: true },
        ]
      });
    } else if (!settings.events || settings.events.length === 0) {
      // Seed default events if missing
      settings.events = [
        { id: '1', title: 'Navaratri Festival', date: 'Oct 15, 2026', time: 'Full Day', desc: 'Grand 10-day celebration of Goddess Durga.', type: 'Festival', attendees: '50,000+', isFeatured: true },
        { id: '2', title: 'Deepavali Special Pooja', date: 'Nov 01, 2026', time: '6:00 PM', desc: 'Auspicious Lakshmi Pooja and lighting of 1008 lamps.', type: 'Festival', attendees: '15,000+', isFeatured: true },
      ];
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch settings from database" });
  }
});

app.post('/api/settings', async (req, res) => {
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
      settings = await TempleSettings.create(req.body);
    }
    console.log('[Server] Settings updated successfully');
    res.json(settings);
  } catch (err) {
    console.error('[Server] Settings update failed:', err);
    res.status(500).json({ message: "Failed to save settings to database", error: err.message });
  }
});

app.get('/api/admin/bookings', async (req, res) => {
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

app.patch('/api/admin/bookings/:userId/:bookingId', async (req, res) => {
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

app.get('/api/admin/donations', async (req, res) => {
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

app.patch('/api/admin/donations/:userId/:donationId', async (req, res) => {
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
