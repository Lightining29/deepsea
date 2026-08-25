import mongoose from 'mongoose';

const expeditionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  location: { type: String, required: true },
  zone: { type: String, required: true },
  depth: { type: String, required: true },
  depthMeters: { type: Number, required: true },
  duration: { type: String, required: true },
  pricePerPerson: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  badge: { type: String },
  badgeColor: { type: String },
  vessel: { type: String, required: true },
  maxGuests: { type: Number, default: 2 },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  highlights: [{ type: String }],
  description: { type: String },
  coordinates: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export const Expedition = mongoose.models.Expedition || mongoose.model('Expedition', expeditionSchema);
