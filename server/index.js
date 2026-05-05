const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/temple_db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// Helper to read settings
const readSettings = () => {
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = {
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
        { id: 1, name: 'Nitya Pooja', desc: 'Daily ritual performed for the well-being of all devotees.', price: '₹101', icon: 'ॐ' },
        { id: 2, name: 'Abishekam', desc: 'Sacred bathing ritual with milk, honey, and herbal powders.', price: '₹501', icon: '🪔' },
        { id: 3, name: 'Anna Prasadam', desc: 'Sponsoring the daily sacred meal for 50+ devotees.', price: '₹2500', icon: '🍲' },
        { id: 4, name: 'Kalyana Utsavam', desc: 'Grand ceremonial wedding ritual for the Divine Couple.', price: '₹5000', icon: '🌸' },
      ]
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
};

// Routes
app.get('/api/settings', (req, res) => {
  try {
    const settings = readSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to read settings" });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const currentSettings = readSettings();
    const updatedSettings = { ...currentSettings, ...req.body };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2));
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ message: "Failed to save settings" });
  }
});

app.get('/', (req, res) => {
  res.send('Temple API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
