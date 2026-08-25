import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  diverLevel: { type: String, default: 'Hadal Explorer Grade 2' },
  divesLogged: { type: Number, default: 0 }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
