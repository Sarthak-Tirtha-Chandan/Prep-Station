import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Filter, 
  Sparkles,
  ListTodo
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { todosApi } from '../services/api';
import { GATE_SUBJECTS } from '../data/defaultData';
import TodoModal from './TodoModal';

const PRIORITY_COLORS = {
  Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Medium: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200'
};

export default function TodoSection({ onNotify }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, pending, completed
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todosApi.getAll({
        subject: selectedSubject,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [selectedSubject, selectedStatus]);

  const handleToggle = async (todo) => {
    const id = todo._id || todo.id;
    const newStatus = !todo.completed;
    try {
      await todosApi.update(id, { completed: newStatus });
      if (newStatus) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
        onNotify?.('Task completed!');
      }
      fetchTodos();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todosApi.delete(id);
      onNotify?.('Task deleted');
      fetchTodos();
    } catch (e) {
      onNotify?.('Error deleting task');
    }
  };

  const handleSave = async (payload) => {
    try {
      await todosApi.create(payload);
      onNotify?.('Task added to checklist');
      fetchTodos();
    } catch (e) {
      onNotify?.('Error creating task');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">Study Tasks & Daily Goals</h1>
              <p className="text-xs text-slate-500">Plan your syllabus coverage and practice checklist</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Checklist Progress</span>
            <span className="font-medium text-slate-500">
              {completedCount} of {todos.length} tasks completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              selectedStatus === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              selectedStatus === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Subject Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            {GATE_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {todos.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <ListTodo className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">No tasks in this list</p>
            <p className="text-xs text-slate-400 mt-1">Add tasks to keep your GATE prep on track</p>
          </div>
        ) : (
          todos.map((todo) => {
            const id = todo._id || todo.id;
            return (
              <div
                key={id}
                className={`group flex items-center justify-between p-4 bg-white rounded-2xl border transition-all ${
                  todo.completed
                    ? 'bg-slate-50/50 border-slate-200/60 opacity-75'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Custom Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(todo)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      todo.completed
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 hover:border-indigo-500 bg-white'
                    }`}
                  >
                    {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Task details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className={`text-sm font-medium leading-snug truncate ${
                      todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {todo.title}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {todo.subject}
                      </span>

                      <span className={`px-2 py-0.5 rounded-md border font-semibold ${PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.Medium}`}>
                        {todo.priority}
                      </span>

                      {todo.dueDate && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {todo.dueDate}
                        </span>
                      )}

                      {todo.estimatedMinutes && (
                        <span>~{todo.estimatedMinutes} min</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete action */}
                <button
                  onClick={() => handleDelete(id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition ml-2"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal form */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
