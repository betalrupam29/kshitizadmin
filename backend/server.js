require('dotenv').config(); // Load variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Connection using Environment Variable
const mongoURI = process.env.MONGO_URI; 

// Add this route
app.get('/', (req, res) => {
  res.send('🚀 API is running successfully!');
});

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected via Environment Variable"))
  .catch(err => console.log("❌ Connection Error:", err));

// 2. Schema
const Settings = mongoose.model('Settings', new mongoose.Schema({
  whatsappLink: String,
  livePrice: Number,
  webinarPrice: Number,
  isPaymentEnabled: { type: Boolean, default: true }
}));

// 3. Routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne() || {};
    res.json(settings);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      {}, 
      req.body, 
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 4. Start Server using PORT from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Admin Server running on port ${PORT}`);
});
