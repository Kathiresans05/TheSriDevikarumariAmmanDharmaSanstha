const mongoose = require('mongoose');
require('dotenv').config({ path: '../server/.env' });

const TempleSettingsSchema = new mongoose.Schema({
  name: String,
  gallery: [{
    id: String,
    url: String,
    title: String,
    isFeatured: Boolean
  }]
});

const TempleSettings = mongoose.model('TempleSettings', TempleSettingsSchema);

async function checkData() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    const settings = await TempleSettings.findOne();
    if (!settings) {
      console.log("No settings found in DB");
    } else {
      console.log("Current Gallery Settings:");
      settings.gallery.forEach(item => {
        console.log(`ID: ${item.id}, Title: ${item.title}, Featured: ${item.isFeatured} (${typeof item.isFeatured}), URL: ${item.url}`);
      });
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
