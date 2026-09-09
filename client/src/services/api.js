import { defaultNotes, defaultPYQs, defaultTodos, defaultReminders } from '../data/defaultData';

const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') + '/api';
  }
  return '/api';
};

const BASE_URL = getApiBase();

// Helper to get local data or fallback to defaults
const getLocal = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(`gate_prep_${key}`);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(`gate_prep_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage error', e);
  }
};

// Initialize localStorage and clear any old dummy notes
if (!localStorage.getItem('gate_prep_notes_cleaned_v2')) {
  setLocal('notes', []);
  localStorage.setItem('gate_prep_notes_cleaned_v2', 'true');
}
if (!localStorage.getItem('gate_prep_pyqs')) setLocal('pyqs', defaultPYQs);
if (!localStorage.getItem('gate_prep_todos')) setLocal('todos', defaultTodos);
if (!localStorage.getItem('gate_prep_reminders')) setLocal('reminders', defaultReminders);

// DB Config Service
export const dbService = {
  async getStatus() {
    try {
      const res = await fetch(`${BASE_URL}/config/status`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Server not ready');
      return await res.json();
    } catch (e) {
      return {
        connected: false,
        state: 'Offline',
        uriMasked: '',
        lastError: 'Backend server not responding or offline'
      };
    }
  },

  async connect(uri) {
    try {
      const res = await fetch(`${BASE_URL}/config/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Connection failed');
      return data;
    } catch (e) {
      throw e;
    }
  },

  async seedData() {
    try {
      const res = await fetch(`${BASE_URL}/config/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (e) {
      // Local fallback seed
      setLocal('notes', defaultNotes);
      setLocal('pyqs', defaultPYQs);
      setLocal('todos', defaultTodos);
      setLocal('reminders', defaultReminders);
      return { success: true, message: 'Reset to default GATE dataset locally' };
    }
  }
};

// Notes API
export const notesApi = {
  async getAll(subject = 'All', search = '') {
    try {
      const query = new URLSearchParams();
      if (subject && subject !== 'All') query.append('subject', subject);
      if (search) query.append('search', search);

      const res = await fetch(`${BASE_URL}/notes?${query.toString()}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch from DB');
      return await res.json();
    } catch (err) {
      // Local fallback
      let items = getLocal('notes', defaultNotes);
      if (subject && subject !== 'All') {
        items = items.filter(n => n.subject === subject);
      }
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(n => 
          n.title?.toLowerCase().includes(s) || 
          n.topic?.toLowerCase().includes(s) || 
          n.content?.toLowerCase().includes(s)
        );
      }
      return items;
    }
  },

  async create(noteData) {
    try {
      const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });
      if (!res.ok) throw new Error('Create failed on DB');
      return await res.json();
    } catch (err) {
      const items = getLocal('notes', defaultNotes);
      const newNote = {
        ...noteData,
        _id: 'note-' + Date.now(),
        id: 'note-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      items.unshift(newNote);
      setLocal('notes', items);
      return newNote;
    }
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update failed on DB');
      return await res.json();
    } catch (err) {
      const items = getLocal('notes', defaultNotes);
      const index = items.findIndex(n => (n._id === id || n.id === id));
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        setLocal('notes', items);
        return items[index];
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed on DB');
      return await res.json();
    } catch (err) {
      let items = getLocal('notes', defaultNotes);
      items = items.filter(n => (n._id !== id && n.id !== id));
      setLocal('notes', items);
      return { success: true };
    }
  }
};

// PYQ API
export const pyqsApi = {
  async getAll(filters = {}) {
    try {
      const query = new URLSearchParams();
      if (filters.subject && filters.subject !== 'All') query.append('subject', filters.subject);
      if (filters.year && filters.year !== 'All') query.append('year', filters.year);
      if (filters.search) query.append('search', filters.search);

      const res = await fetch(`${BASE_URL}/pyqs?${query.toString()}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch from DB');
      return await res.json();
    } catch (err) {
      let items = getLocal('pyqs', defaultPYQs);
      if (filters.subject && filters.subject !== 'All') {
        items = items.filter(p => p.subject === filters.subject);
      }
      if (filters.year && filters.year !== 'All') {
        items = items.filter(p => String(p.year) === String(filters.year));
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        items = items.filter(p => 
          p.question?.toLowerCase().includes(s) || 
          p.topic?.toLowerCase().includes(s)
        );
      }
      return items;
    }
  },

  async create(pyqData) {
    try {
      const res = await fetch(`${BASE_URL}/pyqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pyqData)
      });
      if (!res.ok) throw new Error('Create failed');
      return await res.json();
    } catch (err) {
      const items = getLocal('pyqs', defaultPYQs);
      const newPyq = {
        ...pyqData,
        _id: 'pyq-' + Date.now(),
        id: 'pyq-' + Date.now(),
        isMastered: false,
        isBookmarked: false,
        createdAt: new Date().toISOString()
      };
      items.unshift(newPyq);
      setLocal('pyqs', items);
      return newPyq;
    }
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${BASE_URL}/pyqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update failed');
      return await res.json();
    } catch (err) {
      const items = getLocal('pyqs', defaultPYQs);
      const index = items.findIndex(p => (p._id === id || p.id === id));
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        setLocal('pyqs', items);
        return items[index];
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${BASE_URL}/pyqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return await res.json();
    } catch (err) {
      let items = getLocal('pyqs', defaultPYQs);
      items = items.filter(p => (p._id !== id && p.id !== id));
      setLocal('pyqs', items);
      return { success: true };
    }
  }
};

// Todos API
export const todosApi = {
  async getAll(filters = {}) {
    try {
      const query = new URLSearchParams();
      if (filters.subject && filters.subject !== 'All') query.append('subject', filters.subject);
      if (filters.status) query.append('status', filters.status);

      const res = await fetch(`${BASE_URL}/todos?${query.toString()}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch from DB');
      return await res.json();
    } catch (err) {
      let items = getLocal('todos', defaultTodos);
      if (filters.subject && filters.subject !== 'All') {
        items = items.filter(t => t.subject === filters.subject);
      }
      if (filters.status === 'completed') {
        items = items.filter(t => t.completed);
      } else if (filters.status === 'pending') {
        items = items.filter(t => !t.completed);
      }
      return items;
    }
  },

  async create(todoData) {
    try {
      const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      });
      if (!res.ok) throw new Error('Create failed');
      return await res.json();
    } catch (err) {
      const items = getLocal('todos', defaultTodos);
      const newTodo = {
        ...todoData,
        _id: 'todo-' + Date.now(),
        id: 'todo-' + Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      items.unshift(newTodo);
      setLocal('todos', items);
      return newTodo;
    }
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update failed');
      return await res.json();
    } catch (err) {
      const items = getLocal('todos', defaultTodos);
      const index = items.findIndex(t => (t._id === id || t.id === id));
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        setLocal('todos', items);
        return items[index];
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return await res.json();
    } catch (err) {
      let items = getLocal('todos', defaultTodos);
      items = items.filter(t => (t._id !== id && t.id !== id));
      setLocal('todos', items);
      return { success: true };
    }
  }
};

// Reminders API
export const remindersApi = {
  async getAll(category = 'All') {
    try {
      const query = new URLSearchParams();
      if (category && category !== 'All') query.append('category', category);

      const res = await fetch(`${BASE_URL}/reminders?${query.toString()}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch from DB');
      return await res.json();
    } catch (err) {
      let items = getLocal('reminders', defaultReminders);
      if (category && category !== 'All') {
        items = items.filter(r => r.category === category);
      }
      return items;
    }
  },

  async create(reminderData) {
    try {
      const res = await fetch(`${BASE_URL}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData)
      });
      if (!res.ok) throw new Error('Create failed');
      return await res.json();
    } catch (err) {
      const items = getLocal('reminders', defaultReminders);
      const newRem = {
        ...reminderData,
        _id: 'rem-' + Date.now(),
        id: 'rem-' + Date.now(),
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
      items.push(newRem);
      setLocal('reminders', items);
      return newRem;
    }
  },

  async update(id, updates) {
    try {
      const res = await fetch(`${BASE_URL}/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update failed');
      return await res.json();
    } catch (err) {
      const items = getLocal('reminders', defaultReminders);
      const index = items.findIndex(r => (r._id === id || r.id === id));
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        setLocal('reminders', items);
        return items[index];
      }
      throw err;
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${BASE_URL}/reminders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return await res.json();
    } catch (err) {
      let items = getLocal('reminders', defaultReminders);
      items = items.filter(r => (r._id !== id && r.id !== id));
      setLocal('reminders', items);
      return { success: true };
    }
  }
};

// ECE Question Papers API (yearly PDF papers stored in MongoDB)
export const ecePapersApi = {
  async getAll() {
    try {
      const res = await fetch(`${BASE_URL}/ece-papers`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch ECE papers');
      return await res.json();
    } catch (err) {
      return getLocal('ece_papers', []);
    }
  },

  async getByYear(year) {
    try {
      const res = await fetch(`${BASE_URL}/ece-papers/${year}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Paper not found in DB');
      return await res.json();
    } catch (err) {
      const papers = getLocal('ece_papers', []);
      return papers.find(p => Number(p.year) === Number(year)) || null;
    }
  },

  async upload(paperData) {
    try {
      const res = await fetch(`${BASE_URL}/ece-papers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paperData)
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch (err) {
      const papers = getLocal('ece_papers', []);
      const index = papers.findIndex(p => Number(p.year) === Number(paperData.year));
      const doc = {
        ...paperData,
        _id: 'ece-' + paperData.year,
        updatedAt: new Date().toISOString()
      };
      if (index !== -1) {
        papers[index] = doc;
      } else {
        papers.push(doc);
      }
      setLocal('ece_papers', papers);
      return doc;
    }
  },

  async delete(year) {
    try {
      const res = await fetch(`${BASE_URL}/ece-papers/${year}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      return await res.json();
    } catch (err) {
      let papers = getLocal('ece_papers', []);
      papers = papers.filter(p => Number(p.year) !== Number(year));
      setLocal('ece_papers', papers);
      return { success: true };
    }
  }
};
