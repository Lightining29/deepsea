# 🔱 AbyssX — Deep Sea Adventures & Submersible Expeditions (MERN)

A next-generation, glassmorphic full-stack MERN application for deep ocean exploration, submersible dive bookings, and bathymetric telemetry.

---

## 🌊 Key Features

- **Glassmorphism & Bioluminescent Aesthetics**: Translucent frosted panels (`backdrop-blur-2xl`, glowing cyan/teal neon borders, deep navy abyss gradients).
- **Interactive Canvas Bioluminescence**: Floating reactive micro-bubbles and deep-sea light particles that drift and respond to cursor movement.
- **Procedural Web Audio Hydrophone**: Synthesized low-frequency ocean rumble and periodic 1,150 Hz sonar pings with instant mute/unmute control.
- **Cutout Slice Effects & Angles**: Geometric polygon clip-path cards (`cutout-corner-tr`, diagonal slice previews, angled depth badges).
- **Bouncy Pop & Spring Micro-Interactions**: Spring physics modal popups for reservations and mission dossiers using Framer Motion.
- **Mobile Slide-In / Slide-Out Drawer**: Smooth slide-in sidebar on mobile view with quick depth shortcuts and active dive clearances.
- **Floating Mobile Bottom Navigation Bar**: Matches the mobile app reference layout with Home, Dives, Bookings, Wishlist, and Profile.
- **5-Field Expedition Search Bar**: Filter by destination, ocean depth zone, launch date, diver party, and submersible class.
- **Interactive 5-Layer Depth Explorer**: Real-time hydrostatic pressure (1 to 1,100 ATM), water temperature (28°C to 1.0°C), and endemic fauna across Epipelagic, Mesopelagic, Bathypelagic, Abyssopelagic, and Hadopelagic zones.
- **Full-Stack REST Backend**: Express.js server with MongoDB (Mongoose models for Expeditions and Bookings, plus built-in resilient in-memory fallback for instant setup).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# In the root folder:
npm run install-all
```

### 2. Run Full Application (Client + Server Concurrently)
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Express Backend API**: `http://localhost:5000`

---

## 📁 Project Architecture

```
deesea/
├── package.json              # Concurrently orchestrator
├── README.md
├── server/                   # Node.js + Express REST API
│   ├── package.json
│   ├── server.js             # API endpoints & DB fallback
│   ├── data/
│   │   └── expeditionsData.js # Curated deep-sea missions & specs
│   └── models/
│       ├── Expedition.js     # Mongoose Expedition Schema
│       └── Booking.js        # Mongoose Diver Booking Schema
└── client/                   # Vite + React 18 + TailwindCSS + Framer Motion
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx           # Main orchestrator & state manager
        ├── index.css         # Glassmorphism, glow & cutout styles
        └── components/
            ├── Navbar.jsx               # Top glassy header with depth meter
            ├── MobileDrawer.jsx         # Slide-in / slide-out mobile drawer
            ├── MobileBottomNav.jsx      # Sticky bottom bar for mobile
            ├── HeroSection.jsx          # Hero with 5-field search bar
            ├── ExpeditionCard.jsx       # Cutout glassmorphic dive cards
            ├── SubmersibleShowcase.jsx  # Fleet blueprint & phone app mockup
            ├── CutoutSliceBanner.jsx    # Sliced exclusive experience cards
            ├── DepthZoneExplorer.jsx    # 5-layer interactive depth gauge
            ├── BookingModal.jsx         # Bouncy spring reservation modal
            ├── ExpeditionDetailModal.jsx# Comprehensive mission dossier popup
            ├── VideoModal.jsx           # 4K Hadal descent recording preview
            ├── UserBookingsView.jsx     # Telemetry manifest & saved wishlist
            ├── StatsCounter.jsx         # 500+ Dives, 10,928m depth metrics
            ├── TestimonialsSection.jsx  # Verified diver reviews
            ├── AudioAmbience.jsx        # Web Audio ocean hydrophone & sonar
            ├── CanvasBubbles.jsx        # Interactive bioluminescent particles
            └── Footer.jsx               # Oceanographic coordinates & dispatch
```
