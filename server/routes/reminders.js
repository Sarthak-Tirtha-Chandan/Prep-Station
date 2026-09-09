import express from 'express';
import mongoose from 'mongoose';
import { Reminder } from '../models/Reminder.js';

export const remindersRouter = express.Router();

const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'MongoDB is not connected. Please provide a connection URL in Settings.',
      isDbDisconnected: true
    });
  }
  next();
};

// GET all reminders
remindersRouter.get('/', checkDb, async (req, res) => {
  try {
    const { category, isCompleted } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (isCompleted !== undefined) query.isCompleted = isCompleted === 'true';

    const reminders = await Reminder.find(query).sort({ targetDate: 1, targetTime: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE reminder
remindersRouter.post('/', checkDb, async (req, res) => {
  try {
    const newReminder = new Reminder(req.body);
    const saved = await newReminder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE reminder
remindersRouter.put('/:id', checkDb, async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Reminder not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE reminder
remindersRouter.delete('/:id', checkDb, async (req, res) => {
  try {
    const deleted = await Reminder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
