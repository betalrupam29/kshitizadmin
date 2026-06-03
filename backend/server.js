// require('dotenv').config(); // Load variables from .env
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // 1. Connection using Environment Variable
// const mongoURI = process.env.MONGO_URI; 

// // Add this route
// app.get('/', (req, res) => {
//   res.send('🚀 API is running successfully!');
// });

// mongoose.connect(mongoURI)
//   .then(() => console.log("✅ MongoDB Connected via Environment Variable"))
//   .catch(err => console.log("❌ Connection Error:", err));

// // 2. Schema
// const Settings = mongoose.model('Settings', new mongoose.Schema({
//   whatsappLink: String,
//   livePrice: Number,
//   webinarPrice: Number,
//   isPaymentEnabled: { type: Boolean, default: true }
// }));

// // 3. Routes
// app.get('/api/settings', async (req, res) => {
//   try {
//     const settings = await Settings.findOne() || {};
//     res.json(settings);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// app.post('/api/settings', async (req, res) => {
//   try {
//     const updated = await Settings.findOneAndUpdate(
//       {}, 
//       req.body, 
//       { upsert: true, new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // 4. Start Server using PORT from .env
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Admin Server running on port ${PORT}`);
// });

require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI; 

app.get('/', (req, res) => {
  res.send('🚀 Admin Panel Handshake API is active!');
});

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected to Shared Cluster"))
  .catch(err => console.log("❌ Connection Error:", err));

// ⚡ CRITICAL: Force the collection mapping to 'settings' explicitly to match the main site
const SettingsSchema = new mongoose.Schema({
  whatsappLink: String,
  livePrice: Number,
  webinarPrice: Number,
  isPaymentEnabled: { type: Boolean, default: true }
}, { collection: 'settings' }); 

const Settings = mongoose.model('Settings', SettingsSchema);

/* ---------------------------------------
   HANDSHAKE ROUTING
--------------------------------------- */

// 1. GET Settings (Used by Admin Panel Front-end to load current data)
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || { whatsappLink: '', livePrice: 99, webinarPrice: 149, isPaymentEnabled: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2. POST Settings (Saves your weekly WhatsApp link changes)
app.post('/api/settings', async (req, res) => {
  try {
    const payload = {
      whatsappLink: req.body.whatsappLink,
      // Ensure strings from input forms are cleanly cast into numbers for DB validation
      livePrice: req.body.livePrice ? Number(req.body.livePrice) : 99,
      webinarPrice: req.body.webinarPrice ? Number(req.body.webinarPrice) : 149,
      isPaymentEnabled: req.body.isPaymentEnabled !== undefined ? req.body.isPaymentEnabled : true
    };

    // {} finds the first existing config document; upsert creates it if the database is clean
    const updated = await Settings.findOneAndUpdate(
      {}, 
      payload, 
      { upsert: true, new: true }
    );
    
    console.log("🔥 Successfully synchronized settings to main database:", updated);
    res.json(updated);
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Admin Server running on port ${PORT}`);
});
