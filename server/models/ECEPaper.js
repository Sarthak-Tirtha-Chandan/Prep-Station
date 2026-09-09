import mongoose from 'mongoose';

const ecePaperSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  title: { type: String, default: '' },
  driveLink: { type: String, default: '' }, // Google Drive share/view link
  fileName: { type: String, default: 'Google Drive Document' },
  fileSize: { type: Number, default: 0 },
  fileData: { type: String, default: '' }, // Optional Legacy Base64
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ecePaperSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const ECEPaper = mongoose.models.ECEPaper || mongoose.model('ECEPaper', ecePaperSchema);
