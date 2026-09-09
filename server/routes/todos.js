import express from 'express';
import mongoose from 'mongoose';
import { Todo } from '../models/Todo.js';

export const todosRouter = express.Router();

const checkDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'MongoDB is not connected. Please provide a connection URL in Settings.',
      isDbDisconnected: true
    });
  }
  next();
};

// GET all todos
todosRouter.get('/', checkDb, async (req, res) => {
  try {
    const { status, subject, priority } = req.query;
    let query = {};
    if (status === 'completed') query.completed = true;
    if (status === 'pending') query.completed = false;
    if (subject && subject !== 'All') query.subject = subject;
    if (priority && priority !== 'All') query.priority = priority;

    const todos = await Todo.find(query).sort({ completed: 1, createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE todo
todosRouter.post('/', checkDb, async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE todo (e.g. toggle completed)
todosRouter.put('/:id', checkDb, async (req, res) => {
  try {
    if (req.body.completed !== undefined) {
      req.body.completedAt = req.body.completed ? new Date() : null;
    }
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Todo not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE todo
todosRouter.delete('/:id', checkDb, async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    res.json({ success: true, message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
