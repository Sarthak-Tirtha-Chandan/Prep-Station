import express from 'express';
import mongoose from 'mongoose';
import { Note } from '../models/Note.js';
import { PYQ } from '../models/PYQ.js';
import { Todo } from '../models/Todo.js';
import { Reminder } from '../models/Reminder.js';
import { seedNotes, seedPYQs, seedTodos, seedReminders } from '../data/seedData.js';

export const configRouter = express.Router();

// Track current connection state
let currentMongoUri = process.env.MONGODB_URI || '';
let isConnected = false;
let lastError = null;

export const connectToDatabase = async (uri) => {
  if (!uri) {
    isConnected = false;
    currentMongoUri = '';
    return { success: false, message: 'No MongoDB URI provided' };
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    currentMongoUri = uri;
    lastError = null;
    console.log('[MongoDB] Connected successfully to:', uri.replace(/:([^:@]+)@/, ':****@'));

    // Check if empty, auto-seed if requested or empty
    // Check if empty, auto-seed if needed (no dummy notes)
    const pyqCount = await PYQ.countDocuments();
    if (pyqCount === 0) {
      console.log('[MongoDB] Initializing database with seed practice questions...');
      await PYQ.insertMany(seedPYQs);
      await Todo.insertMany(seedTodos);
      await Reminder.insertMany(seedReminders);
      console.log('[MongoDB] Seeding completed.');
    }

    return { success: true, message: 'Connected to MongoDB successfully' };
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    isConnected = false;
    lastError = err.message;
    return { success: false, message: err.message };
  }
};

// Check DB Status
configRouter.get('/status', async (req, res) => {
  const readyState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateStr = states[readyState] || 'Unknown';
  
  let collectionsInfo = { notes: 0, pyqs: 0, todos: 0, reminders: 0 };
  if (readyState === 1) {
    try {
      collectionsInfo.notes = await Note.countDocuments();
      collectionsInfo.pyqs = await PYQ.countDocuments();
      collectionsInfo.todos = await Todo.countDocuments();
      collectionsInfo.reminders = await Reminder.countDocuments();
    } catch (e) {
      // ignore
    }
  }

  res.json({
    connected: readyState === 1,
    state: stateStr,
    uriMasked: currentMongoUri ? currentMongoUri.replace(/:([^:@]+)@/, ':****@') : '',
    lastError,
    counts: collectionsInfo
  });
});

// Connect to MongoDB using provided URI
configRouter.post('/connect', async (req, res) => {
  const { uri } = req.body;
  if (!uri) {
    return res.status(400).json({ success: false, message: 'URI is required' });
  }

  const result = await connectToDatabase(uri);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// Seed data
configRouter.post('/seed', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(400).json({ success: false, message: 'MongoDB is not connected' });
  }

  try {
    await Note.deleteMany({});
    await PYQ.deleteMany({});
    await Todo.deleteMany({});
    await Reminder.deleteMany({});

    await Note.insertMany(seedNotes);
    await PYQ.insertMany(seedPYQs);
    await Todo.insertMany(seedTodos);
    await Reminder.insertMany(seedReminders);

    res.json({ success: true, message: 'Sample GATE data seeded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
