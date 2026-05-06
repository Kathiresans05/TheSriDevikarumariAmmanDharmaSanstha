const mongoose = require('mongoose');
require('dotenv').config({ path: '../server/.env' });

const TempleSettings = require('../server/models/TempleSettings');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const settings = await TempleSettings.findOne();
    console.log("Current Gallery Settings:");
    settings.gallery.forEach(item => {
      console.log(`ID: ${item.id}, Title: ${item.title}, Featured: ${item.isFeatured}, URL: ${item.url}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
