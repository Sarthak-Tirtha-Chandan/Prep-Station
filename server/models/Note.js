import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true }, // e.g. "Networks & Systems", "Electromagnetics", etc.
  driveLink: { type: String, default: '' }, // Google Drive share/view link
  fileName: { type: String, default: 'Google Drive Document' },
  fileSize: { type: Number, default: 0 }, // in bytes
  fileData: { type: String, default: '' }, // Legacy Base64 or fallback
  topic: { type: String, default: 'General' },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
