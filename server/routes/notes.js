import express from 'express';
import mongoose from 'mongoose';
import { Note } from '../models/Note.js';

export const notesRouter = express.Router();

const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'MongoDB is not connected. Please provide a connection URL in Settings.',
      isDbDisconnected: true
    });
  }
  next();
};

// GET all notes (PDF documents)
notesRouter.get('/', checkDb, async (req, res) => {
  try {
    const { subject, search } = req.query;
    let query = {};
    if (subject && subject !== 'All') {
      query.subject = subject;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single note with full PDF data
notesRouter.get('/:id', checkDb, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE / UPLOAD PDF note
notesRouter.post('/', checkDb, async (req, res) => {
  try {
    const { title, subject, fileName, fileSize, fileData, topic, description, tags } = req.body;
    if (!title || !fileData) {
      return res.status(400).json({ error: 'Title and PDF file data are required' });
    }

    const newNote = new Note({
      title,
      subject: subject || 'General',
      fileName: fileName || 'document.pdf',
      fileSize: fileSize || 0,
      fileData,
      topic: topic || 'General',
      description: description || '',
      tags: tags || []
    });

    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE note
notesRouter.put('/:id', checkDb, async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE note
notesRouter.delete('/:id', checkDb, async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true, message: 'PDF Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
