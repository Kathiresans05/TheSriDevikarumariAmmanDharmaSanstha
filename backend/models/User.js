const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false },
  phone: String,
  bookings: [{
    sevaId: Number,
    date: Date,
    time: String,
    devoteeName: String,
    gothram: String,
    transactionId: String,
    status: { type: String, default: 'Pending Verification' },
    amount: String,
    bookingDate: { type: Date, default: Date.now }
  }],
  donations: [{
    amount: String,
    cause: String,
    transactionId: String,
    receipt: String,
    status: { type: String, default: 'Pending' }, // Pending, Verified, Rejected
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
