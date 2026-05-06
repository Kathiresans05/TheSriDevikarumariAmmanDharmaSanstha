const mongoose = require('mongoose');
require('dotenv').config();
const TempleSettings = require('./models/TempleSettings');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  let settings = await TempleSettings.findOne();
  try {
    settings.events = [{ id: '1', title: 'Test', type: 'Event' }];
    await settings.save();
    console.log("Direct assign worked");
  } catch (err) {
    console.error("Direct assign failed:", err.message);
  }

  try {
    let settings1 = await TempleSettings.findOne();
    Object.assign(settings1, { events: [{ id: '1', title: 'Test', type: 'Event' }] });
    await settings1.save();
    console.log("Object.assign worked");
  } catch (err) {
    console.error("Object.assign failed:", err.message);
  }
  process.exit(0);
});
