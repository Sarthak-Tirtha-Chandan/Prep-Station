import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Exam Milestone', 'Revision', 'Mock Test', 'Formula Review', 'General'], 
    default: 'Revision' 
  },
  subject: { type: String, default: 'General' },
  targetDate: { type: String, required: true }, // YYYY-MM-DD
  targetTime: { type: String, default: '09:00' }, // HH:mm
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
