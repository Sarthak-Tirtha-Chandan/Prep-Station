import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, default: 'General' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  dueDate: { type: String, default: '' }, // ISO date string or formatted date
  estimatedMinutes: { type: Number, default: 45 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
