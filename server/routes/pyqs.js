import express from 'express';
import mongoose from 'mongoose';
import { PYQ } from '../models/PYQ.js';

export const pyqsRouter = express.Router();

const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'MongoDB is not connected. Please provide a connection URL in Settings.',
      isDbDisconnected: true
    });
  }
  next();
};

// GET all PYQs with filters (subject, year, mastered, difficulty, search)
pyqsRouter.get('/', checkDb, async (req, res) => {
  try {
    const { subject, year, mastered, bookmarked, search } = req.query;
    let query = {};
    if (subject && subject !== 'All') {
      query.subject = subject;
    }
    if (year && year !== 'All') {
      query.year = Number(year);
    }
    if (mastered === 'true') {
      query.isMastered = true;
    } else if (mastered === 'false') {
      query.isMastered = false;
    }
    if (bookmarked === 'true') {
      query.isBookmarked = true;
    }
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { explanation: { $regex: search, $options: 'i' } }
      ];
    }
    const pyqs = await PYQ.find(query).sort({ year: -1, marks: -1 });
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single PYQ
pyqsRouter.get('/:id', checkDb, async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) return res.status(404).json({ error: 'PYQ not found' });
    res.json(pyq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE PYQ
pyqsRouter.post('/', checkDb, async (req, res) => {
  try {
    const newPyq = new PYQ(req.body);
    const saved = await newPyq.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE PYQ (e.g., mark as mastered, bookmark)
pyqsRouter.put('/:id', checkDb, async (req, res) => {
  try {
    const updated = await PYQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'PYQ not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE PYQ
pyqsRouter.delete('/:id', checkDb, async (req, res) => {
  try {
    const deleted = await PYQ.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'PYQ not found' });
    res.json({ success: true, message: 'PYQ deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
