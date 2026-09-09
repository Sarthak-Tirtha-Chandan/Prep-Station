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

// CREATE / UPLOAD Note (Google Drive link or PDF)
notesRouter.post('/', checkDb, async (req, res) => {
  try {
    const { title, subject, driveLink, fileName, fileSize, fileData, topic, description, tags } = req.body;
    if (!title || (!driveLink && !fileData)) {
      return res.status(400).json({ error: 'Title and Google Drive Link are required' });
    }

    const newNote = new Note({
      title,
      subject: subject || 'General',
      driveLink: driveLink || '',
      fileName: fileName || (driveLink ? 'Google Drive Document' : 'document.pdf'),
      fileSize: fileSize || 0,
      fileData: fileData || '',
      topic: topic || 'General',
      description: description || '',
      tags: tags || [],
      isFavorite: false
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE note
notesRouter.put('/:id', checkDb, async (req, res) => {
  try {
    const { title, subject, driveLink, topic, description, tags, isFavorite } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subject !== undefined) updateData.subject = subject;
    if (driveLink !== undefined) updateData.driveLink = driveLink;
    if (topic !== undefined) updateData.topic = topic;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    updateData.updatedAt = new Date();

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
