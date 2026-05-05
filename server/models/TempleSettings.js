const mongoose = require('mongoose');

const TempleSettingsSchema = new mongoose.Schema({
  name: { type: String, default: "The Sri Devikarumari Amman Dharma Sanstha" },
  email: { type: String, default: "info@devikarumari.org" },
  phone: { type: String, default: "+91 44 2680 0430" },
  address: { type: String, default: "123, Amman Koil Street, Thiruverkadu, Chennai - 600077" },
  timings: {
    morning: {
      open: { type: String, default: "06:00 AM" },
      close: { type: String, default: "12:30 PM" }
    },
    evening: {
      open: { type: String, default: "04:00 PM" },
      close: { type: String, default: "09:00 PM" }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('TempleSettings', TempleSettingsSchema);
