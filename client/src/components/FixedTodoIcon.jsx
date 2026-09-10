import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckSquare, 
  ListTodo, 
  Sparkles, 
  X, 
  Plus, 
  Check, 
  Trash2, 
  ExternalLink,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { todosApi } from '../services/api';

const GLOW_INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const STORAGE_KEY = 'prep_station_todo_last_glow';

const PRIORITY_BADGES = {
  Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Medium: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Low: 'bg-slate-50 text-slate-600 border-slate-200'
};

export default function FixedTodoIcon({ activeTab, setActiveTab, onNotify }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('pending'); // 'pending' | 'all'
  const popupRef = useRef(null);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const data = await todosApi.getAll();
      setTodos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTodos();
    // Poll todos every 30s to keep badge & list updated
    const interval = setInterval(fetchTodos, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Hourly Glow Timer Logic
  useEffect(() => {
    const checkGlowStatus = () => {
      const storedLastGlow = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();

      if (!storedLastGlow) {
        // First visit: initialize to now
        localStorage.setItem(STORAGE_KEY, String(now));
        return;
      }

      const elapsed = now - Number(storedLastGlow);
      if (elapsed >= GLOW_INTERVAL_MS) {
        setIsGlowing(true);
      }
    };

    // Initial check on mount
    checkGlowStatus();

    // Check every 10 seconds if 1 hour has passed
    const glowCheckInterval = setInterval(checkGlowStatus, 10000);
    return () => clearInterval(glowCheckInterval);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAcknowledgeGlow = () => {
    setIsGlowing(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (isGlowing) {
      handleAcknowledgeGlow();
    }
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchTodos();
    }
  };

  const handleToggle = async (todo) => {
    const id = todo._id || todo.id;
    const newStatus = !todo.completed;
    try {
      await todosApi.update(id, { completed: newStatus });
      if (newStatus) {
        confetti({
          particleCount: 35,
          spread: 45,
          origin: { y: 0.6 }
        });
        onNotify?.('Task completed! 🎉');
      }
      fetchTodos();
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await todosApi.create({
        title: newTitle.trim(),
        subject: 'General',
        priority: 'Medium',
        completed: false
      });
      setNewTitle('');
      onNotify?.('Task added to checklist');
      fetchTodos();
    } catch (e) {
      onNotify?.('Failed to add task');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await todosApi.delete(id);
      fetchTodos();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingList = todos.filter((t) => !t.completed);
  const displayedTodos = filter === 'pending' ? pendingList : todos;
  const pendingCount = pendingList.length;

  return (
    <>
      {/* Fixed Left Floating Icon */}
      <div className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 group">
        {/* Outer Ping Animation when Glowing */}
        {isGlowing && (
          <span className="absolute -inset-1.5 rounded-2xl bg-indigo-500/50 animate-ping pointer-events-none" />
        )}

        {/* Main Floating Icon Button */}
        <button
          onClick={handleIconClick}
          aria-label="Quick Access To-Do List"
          className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all duration-300 transform active:scale-95 ${
            isGlowing
              ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white animate-todo-glow shadow-xl ring-4 ring-indigo-400/80 ring-offset-2'
              : isOpen
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 ring-2 ring-indigo-500 ring-offset-2 scale-105'
              : 'bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200/90 shadow-lg hover:shadow-xl hover:scale-105'
          }`}
          title="Quick To-Do Popup"
        >
          {isGlowing ? (
            <Sparkles className="w-6 h-6 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
          ) : (
            <ListTodo className="w-6 h-6" />
          )}

          {/* Pending Task Badge */}
          {pendingCount > 0 && !isGlowing && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white">
              {pendingCount > 99 ? '99+' : pendingCount}
            </span>
          )}

          {/* Glowing 1-Hour Alert Indicator Dot */}
          {isGlowing && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-white rounded-full animate-bounce shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-900" />
            </span>
          )}
        </button>

        {/* Popout Hover Tooltip (hidden when popup is open) */}
        {!isOpen && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out z-50">
            <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-2xl text-xs whitespace-nowrap flex flex-col gap-0.5 border border-slate-800">
              <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quick To-Do</span>
                {pendingCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/40 text-indigo-300 rounded-md font-mono">
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                {isGlowing ? '⏰ Hourly check-in: Review your tasks!' : 'Click to view to-dos • Glows every 1 hr'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Pop-Up Window */}
      {isOpen && (
        <div
          ref={popupRef}
          className="fixed left-4 sm:left-24 top-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[380px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-fade-in"
          style={{ maxHeight: 'calc(100vh - 4rem)' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Quick To-Dos</span>
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                      {pendingCount} left
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500">Check off tasks right here</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition"
              title="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add Bar */}
          <form onSubmit={handleQuickAdd} className="p-3 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 transition"
              />
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
                title="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between text-xs border-b border-slate-100">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  filter === 'pending'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  filter === 'all'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({todos.length})
              </button>
            </div>

            {isGlowing && (
              <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 1h Check-In
              </span>
            )}
          </div>

          {/* Scrollable Tasks List */}
          <div className="p-3 space-y-2 overflow-y-auto flex-1 max-h-[320px]">
            {displayedTodos.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-slate-400">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {filter === 'pending' ? 'All caught up! No pending tasks.' : 'No tasks created yet.'}
                </p>
                <p className="text-[11px] text-slate-400">Type above to add a task.</p>
              </div>
            ) : (
              displayedTodos.map((todo) => {
                const id = todo._id || todo.id;
                return (
                  <div
                    key={id}
                    className={`group flex items-start justify-between gap-2 p-2.5 rounded-2xl border transition-all ${
                      todo.completed
                        ? 'bg-slate-50/70 border-slate-100 text-slate-400 opacity-75'
                        : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      {/* Checkbox button */}
                      <button
                        onClick={() => handleToggle(todo)}
                        className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition shrink-0 ${
                          todo.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 hover:border-indigo-500 bg-white'
                        }`}
                        title={todo.completed ? 'Mark pending' : 'Mark complete'}
                      >
                        {todo.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-medium break-words leading-snug ${
                            todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {todo.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {todo.subject && todo.subject !== 'General' && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                              {todo.subject}
                            </span>
                          )}
                          {todo.priority && (
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
                                PRIORITY_BADGES[todo.priority] || PRIORITY_BADGES.Medium
                              }`}
                            >
                              {todo.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action: Go to full section */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Need full view & filters?</span>
            <button
              onClick={() => {
                setActiveTab('todos');
                setIsOpen(false);
              }}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold hover:underline text-xs"
            >
              Go to To-Do section
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
