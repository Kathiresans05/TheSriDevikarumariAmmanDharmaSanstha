const mongoose = require('mongoose');
require('dotenv').config();

const donationSchema = new mongoose.Schema({
  donations: [{
    amount: String,
    cause: String,
    transactionId: String,
    receipt: String,
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  donations: [new mongoose.Schema({
    amount: String,
    cause: String,
    transactionId: String,
    receipt: String,
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
  })]
}));

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({ 'donations.0': { $exists: true } });
  users.forEach(u => {
    console.log(`User: ${u.name}`);
    u.donations.forEach(d => {
      console.log(`  Donation: ${d.amount}, Cause: ${d.cause}, ID: ${d.transactionId}, Receipt: ${d.receipt}`);
    });
  });
  await mongoose.connection.close();
}

check();
