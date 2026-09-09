import express from 'express';
import mongoose from 'mongoose';
import { ECEPaper } from '../models/ECEPaper.js';

export const ecePapersRouter = express.Router();

const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'MongoDB is not connected.',
      isDbDisconnected: true
    });
  }
  next();
};

// GET all uploaded ECE papers metadata
ecePapersRouter.get('/', checkDb, async (req, res) => {
  try {
    const papers = await ECEPaper.find({}, { fileData: 0 }).sort({ year: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET paper by year with full PDF data
ecePapersRouter.get('/:year', checkDb, async (req, res) => {
  try {
    const year = Number(req.params.year);
    const paper = await ECEPaper.findOne({ year });
    if (!paper) return res.status(404).json({ error: `No paper uploaded for GATE ECE ${year}` });
    res.json(paper);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPLOAD or REPLACE paper for a year
ecePapersRouter.post('/', checkDb, async (req, res) => {
  try {
    const { year, title, fileName, fileSize, fileData, notes } = req.body;
    if (!year || !fileData) {
      return res.status(400).json({ error: 'Year and PDF fileData are required' });
    }

    const numYear = Number(year);
    const docTitle = title || `GATE ${numYear} ECE Question Paper`;

    const paper = await ECEPaper.findOneAndUpdate(
      { year: numYear },
      {
        year: numYear,
        title: docTitle,
        fileName: fileName || `GATE_ECE_${numYear}.pdf`,
        fileSize: fileSize || 0,
        fileData,
        notes: notes || '',
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(201).json(paper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE paper for a year
ecePapersRouter.delete('/:year', checkDb, async (req, res) => {
  try {
    const year = Number(req.params.year);
    const deleted = await ECEPaper.findOneAndDelete({ year });
    if (!deleted) return res.status(404).json({ error: 'Paper not found' });
    res.json({ success: true, message: `GATE ECE ${year} paper removed` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
