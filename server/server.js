import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { expeditionsData, submersiblesData, depthZones, statsData } from './data/expeditionsData.js';
import { Expedition } from './models/Expedition.js';
import { Booking } from './models/Booking.js';
import { User } from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deesea_db';

app.use(cors());
app.use(express.json());

// In-memory runtime fallback storage
let inMemoryExpeditions = [...expeditionsData];
let inMemoryBookings = [
  {
    bookingReference: "ABYSS-89421",
    expeditionId: "exp-1",
    expeditionTitle: "Challenger Deep Hadal Descent",
    customerName: "Captain Alex Drake",
    customerEmail: "alex.drake@oceanx.org",
    diverCount: 2,
    diveDate: "2026-09-15",
    submersibleClass: "Triton 36,000/2 (Limiting Factor)",
    totalAmount: 99000,
    addOns: ["4K VR Telemetry Recording", "Hadal Champagne Toast"],
    status: "Confirmed",
    createdAt: new Date().toISOString()
  },
  {
    bookingReference: "ABYSS-54210",
    expeditionId: "exp-2",
    expeditionTitle: "Midnight Bioluminescence Safari",
    customerName: "Dr. Elena Rostova",
    customerEmail: "explorer@oceanx.org",
    diverCount: 1,
    diveDate: "2026-10-02",
    submersibleClass: "DeepFlight Super Falcon 3S",
    totalAmount: 9550,
    addOns: ["Personalized Bathymetric Map"],
    status: "Confirmed",
    createdAt: new Date().toISOString()
  }
];

let inMemoryUsers = [
  {
    id: "usr-admin",
    name: "Admiral Marina Vance",
    email: "admin@oceanx.org",
    password: "admin",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    diverLevel: "Chief Submersible Commander",
    divesLogged: 42
  },
  {
    id: "usr-explorer",
    name: "Alex Drake",
    email: "explorer@oceanx.org",
    password: "user",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    diverLevel: "Hadal Explorer Grade 2",
    divesLogged: 6
  }
];

let isMongoConnected = false;

// Connect to MongoDB if available
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB database');

    // Seed database if empty
    const count = await Expedition.countDocuments();
    if (count === 0) {
      await Expedition.insertMany(expeditionsData);
      console.log('🌊 Seeded initial Deep Sea Expeditions data');
    }
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ Running in In-Memory Mode with full mock database');
  }
};

connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Deep Sea Adventures API operational',
    dbStatus: isMongoConnected ? 'MongoDB Connected' : 'In-Memory Store Active',
    timestamp: new Date().toISOString()
  });
});

// AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = isMongoConnected 
      ? await User.findOne({ email: email.toLowerCase() }) 
      : inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An explorer with this email is already registered.' });
    }

    const newUserPayload = {
      name,
      email: email.toLowerCase(),
      password,
      role,
      avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&w=200&q=80`,
      diverLevel: role === 'admin' ? 'Chief Submersible Commander' : 'Hadal Certified Explorer',
      divesLogged: 1
    };

    let createdUser = null;
    if (isMongoConnected) {
      const user = new User(newUserPayload);
      await user.save();
      createdUser = user.toObject();
    } else {
      createdUser = { id: `usr-${Date.now()}`, ...newUserPayload };
      inMemoryUsers.push(createdUser);
    }

    delete createdUser.password;
    res.status(201).json({
      success: true,
      message: 'Explorer registered successfully!',
      user: createdUser,
      token: `abyss_token_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AUTH: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: email.toLowerCase() }).lean();
    } else {
      user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
    }

    const safeUser = { ...user };
    delete safeUser.password;

    res.json({
      success: true,
      message: `Welcome aboard, ${safeUser.name}!`,
      user: safeUser,
      token: `abyss_token_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all expeditions (with filtering & search)
app.get('/api/expeditions', async (req, res) => {
  try {
    const { zone, search, minPrice, maxPrice, sort } = req.query;

    let results = [];
    if (isMongoConnected) {
      const filter = {};
      if (zone && zone !== 'All') {
        filter.zone = { $regex: zone, $options: 'i' };
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (minPrice || maxPrice) {
        filter.pricePerPerson = {};
        if (minPrice) filter.pricePerPerson.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerPerson.$lte = Number(maxPrice);
      }
      results = await Expedition.find(filter).lean();
    } else {
      results = inMemoryExpeditions.filter(exp => {
        let match = true;
        if (zone && zone !== 'All' && !exp.zone.toLowerCase().includes(zone.toLowerCase())) {
          match = false;
        }
        if (search) {
          const q = search.toLowerCase();
          const matchesTitle = exp.title.toLowerCase().includes(q);
          const matchesLoc = exp.location.toLowerCase().includes(q);
          const matchesDesc = exp.description.toLowerCase().includes(q);
          if (!matchesTitle && !matchesLoc && !matchesDesc) match = false;
        }
        if (minPrice && exp.pricePerPerson < Number(minPrice)) match = false;
        if (maxPrice && exp.pricePerPerson > Number(maxPrice)) match = false;
        return match;
      });
    }

    if (sort === 'price-low') {
      results.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    } else if (sort === 'depth') {
      results.sort((a, b) => b.depthMeters - a.depthMeters);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single expedition
app.get('/api/expeditions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let expedition = null;

    if (isMongoConnected) {
      expedition = await Expedition.findOne({ id }).lean();
    } else {
      expedition = inMemoryExpeditions.find(e => e.id === id);
    }

    if (!expedition) {
      return res.status(404).json({ success: false, message: 'Expedition not found' });
    }

    res.json({ success: true, data: expedition });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ADMIN: Create New Expedition
app.post('/api/expeditions', async (req, res) => {
  try {
    const { title, subtitle, location, zone, depth, depthMeters, duration, pricePerPerson, vessel, image, description } = req.body;
    
    if (!title || !location || !depth || !pricePerPerson) {
      return res.status(400).json({ success: false, message: 'Title, location, depth and price are required.' });
    }

    const newExp = {
      id: `exp-${Date.now()}`,
      title,
      subtitle: subtitle || "Deep Sea Expedition Mission",
      location,
      zone: zone || "Bathypelagic (Midnight Zone)",
      depth,
      depthMeters: Number(depthMeters) || 3000,
      duration: duration || "6 Hours",
      pricePerPerson: Number(pricePerPerson),
      rating: 5.0,
      reviewsCount: 1,
      badge: "New Mission",
      badgeColor: "from-sky-500 to-teal-500",
      vessel: vessel || "Triton Titanium Explorer",
      maxGuests: 3,
      image: image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      gallery: [image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"],
      highlights: ["Titanium pressure certified", "4K Video Telemetry", "Marine Biologist Escort"],
      description: description || "Explore the uncharted depths with our certified submersible pilots.",
      coordinates: "15°00′N 140°00′E",
      featured: true
    };

    if (isMongoConnected) {
      const expDoc = new Expedition(newExp);
      await expDoc.save();
    } else {
      inMemoryExpeditions.unshift(newExp);
    }

    res.status(201).json({ success: true, message: 'New sea adventure created successfully!', data: newExp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN: Update Expedition
app.put('/api/expeditions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected) {
      const updated = await Expedition.findOneAndUpdate({ id }, updates, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Expedition not found' });
      return res.json({ success: true, message: 'Expedition updated successfully', data: updated });
    } else {
      const idx = inMemoryExpeditions.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Expedition not found' });
      inMemoryExpeditions[idx] = { ...inMemoryExpeditions[idx], ...updates };
      return res.json({ success: true, message: 'Expedition updated successfully', data: inMemoryExpeditions[idx] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADMIN: Delete Expedition
app.delete('/api/expeditions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Expedition.findOneAndDelete({ id });
    } else {
      inMemoryExpeditions = inMemoryExpeditions.filter(e => e.id !== id);
    }
    res.json({ success: true, message: 'Expedition deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET submersibles
app.get('/api/submersibles', (req, res) => {
  res.json({ success: true, data: submersiblesData });
});

// GET depth zones
app.get('/api/depth-zones', (req, res) => {
  res.json({ success: true, data: depthZones });
});

// GET stats & metrics
app.get('/api/stats', (req, res) => {
  res.json({ success: true, data: statsData });
});

// POST a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      expeditionId,
      expeditionTitle,
      customerName,
      customerEmail,
      customerPhone,
      diverCount,
      diveDate,
      submersibleClass,
      totalAmount,
      addOns,
      specialRequests
    } = req.body;

    if (!customerName || !customerEmail || !diveDate || !expeditionId) {
      return res.status(400).json({ success: false, message: 'Missing required booking parameters' });
    }

    const reference = `ABYSS-${Math.floor(10000 + Math.random() * 90000)}`;
    const bookingPayload = {
      bookingReference: reference,
      expeditionId,
      expeditionTitle: expeditionTitle || "Deep Sea Abyss Mission",
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone: customerPhone || "",
      diverCount: diverCount || 1,
      diveDate,
      submersibleClass: submersibleClass || "Triton Titanium Class",
      totalAmount: totalAmount || 8900,
      addOns: addOns || [],
      specialRequests: specialRequests || "",
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      const newBooking = new Booking(bookingPayload);
      await newBooking.save();
    } else {
      inMemoryBookings.unshift(bookingPayload);
    }

    res.status(201).json({
      success: true,
      message: 'Deep sea expedition booked successfully! Diver clearance granted.',
      booking: bookingPayload
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all bookings (Admin or overview)
app.get('/api/bookings', async (req, res) => {
  try {
    let bookings = [];
    if (isMongoConnected) {
      bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    } else {
      bookings = inMemoryBookings;
    }
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET bookings for a specific user email
app.get('/api/bookings/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    let bookings = [];
    if (isMongoConnected) {
      bookings = await Booking.find({ customerEmail: email.toLowerCase() }).sort({ createdAt: -1 }).lean();
    } else {
      bookings = inMemoryBookings.filter(b => b.customerEmail.toLowerCase() === email.toLowerCase());
    }
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ADMIN: Update booking status
app.patch('/api/bookings/:reference/status', async (req, res) => {
  try {
    const { reference } = req.params;
    const { status } = req.body;

    if (isMongoConnected) {
      const updated = await Booking.findOneAndUpdate({ bookingReference: reference }, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
      return res.json({ success: true, message: `Status updated to ${status}`, data: updated });
    } else {
      const booking = inMemoryBookings.find(b => b.bookingReference === reference);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      booking.status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ADMIN: Delete booking
app.delete('/api/bookings/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    if (isMongoConnected) {
      await Booking.findOneAndDelete({ bookingReference: reference });
    } else {
      inMemoryBookings = inMemoryBookings.filter(b => b.bookingReference !== reference);
    }
    res.json({ success: true, message: 'Booking record removed.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve Vite client static build in production
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AbyssX Deep Sea Expeditions</title>
        <style>
          body { background: #000814; color: #38bdf8; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          .box { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.3); padding: 40px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
          h1 { color: #ffffff; font-size: 28px; margin-bottom: 12px; }
          p { color: #94a3b8; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>🔱 AbyssX Deep Sea Expeditions</h1>
          <p>Initial telemetry calibration in progress. Please refresh in a moment.</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🔱 Deep Sea Adventures Server running on http://localhost:${PORT}`);
});
