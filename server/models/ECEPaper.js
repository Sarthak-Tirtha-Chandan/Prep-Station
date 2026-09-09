import mongoose from 'mongoose';

const ecePaperSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  title: { type: String, default: '' },
  fileName: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  fileData: { type: String, required: true }, // Base64 data URL
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ecePaperSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const ECEPaper = mongoose.models.ECEPaper || mongoose.model('ECEPaper', ecePaperSchema);
