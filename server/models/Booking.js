import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true },
  expeditionId: { type: String, required: true },
  expeditionTitle: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  diverCount: { type: Number, default: 1 },
  diveDate: { type: String, required: true },
  submersibleClass: { type: String, default: "Standard Submersible" },
  totalAmount: { type: Number, required: true },
  addOns: [{ type: String }],
  specialRequests: { type: String },
  status: { type: String, enum: ['Confirmed', 'Pending Dive Clearance', 'Completed'], default: 'Confirmed' }
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
