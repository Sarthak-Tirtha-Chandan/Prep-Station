import mongoose from 'mongoose';

const pyqSchema = new mongoose.Schema({
  year: { type: Number, required: true }, // e.g., 2024, 2023, 2022
  subject: { type: String, required: true },
  topic: { type: String, default: 'General' },
  questionType: { type: String, enum: ['MCQ', 'NAT', 'MSQ'], default: 'MCQ' },
  marks: { type: Number, default: 1 }, // 1 or 2 Marks
  question: { type: String, required: true },
  options: [{
    label: { type: String }, // e.g. "A", "B", "C", "D"
    text: { type: String }
  }],
  correctAnswer: { type: String, required: true }, // e.g. "B" or numerical range for NAT
  explanation: { type: String, required: true }, // Step by step solution
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  isMastered: { type: Boolean, default: false },
  isBookmarked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const PYQ = mongoose.models.PYQ || mongoose.model('PYQ', pyqSchema);
