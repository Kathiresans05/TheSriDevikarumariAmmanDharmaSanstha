const mongoose = require('mongoose');

const TempleSettingsSchema = new mongoose.Schema({
  name: { type: String, default: "The Sri Devikarumari Amman Dharma Sanstha" },
  email: { type: String, default: "info@devikarumari.org" },
  phone: { type: String, default: "+91 44 2680 0430" },
  address: { type: String, default: "123, Amman Koil Street, Thiruverkadu, Chennai - 600077" },
  officeHours: { type: String, default: "Monday - Sunday: 9:00 AM - 6:00 PM" },
  specialDays: { type: String, default: "6:00 AM - 10:00 PM" },
  timings: {
    morning: {
      open: { type: String, default: "06:00 AM" },
      close: { type: String, default: "12:30 PM" }
    },
    evening: {
      open: { type: String, default: "04:00 PM" },
      close: { type: String, default: "09:00 PM" }
    }
  },
  sevas: [{
    id: Number,
    name: String,
    desc: String,
    price: String,
    icon: String,
    isFeatured: { type: Boolean, default: false }
  }],
  gallery: [{
    id: String,
    url: String,
    title: String,
    isFeatured: { type: Boolean, default: false }
  }],
  events: [{
    id: String,
    title: String,
    date: String,
    time: String,
    desc: String,
    type: { type: String },
    attendees: String,
    image: String,
    isFeatured: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('TempleSettings', TempleSettingsSchema);
