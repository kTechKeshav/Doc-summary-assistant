import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  text: String,
  summary: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Document', docSchema);
