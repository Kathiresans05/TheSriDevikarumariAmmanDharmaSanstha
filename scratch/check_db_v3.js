const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config({ path: './server/.env' });

async function checkBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({ 'bookings.0': { $exists: true } });
    console.log(`Found ${users.length} users with bookings`);
    
    users.forEach(user => {
      console.log(`User: ${user.name}, Email: ${user.email}`);
      console.log('Bookings:', JSON.stringify(user.bookings, null, 2));
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkBookings();
