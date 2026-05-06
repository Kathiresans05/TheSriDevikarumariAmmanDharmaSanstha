const mongoose = require('mongoose');
const TempleSettings = require('./models/TempleSettings');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/temple_db')
  .then(async () => {
    const settings = await TempleSettings.findOne();
    console.log(JSON.stringify(settings, null, 2));
    process.exit();
  });
