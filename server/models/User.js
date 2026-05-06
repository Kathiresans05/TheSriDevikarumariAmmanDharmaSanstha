const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  bookings: [{
    sevaId: Number,
    date: Date,
    time: String,
    status: { type: String, default: 'Pending' },
    amount: String
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
