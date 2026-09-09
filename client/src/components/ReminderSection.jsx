import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Flag,
  BookOpen,
  Trophy,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { remindersApi } from '../services/api';
import ReminderModal from './ReminderModal';

const CATEGORY_ICONS = {
  'Exam Milestone': Trophy,
  'Revision': BookOpen,
  'Mock Test': Sparkles,
  'Formula Review': Flag,
  'General': Bell
};

export default function ReminderSection({ onNotify }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await remindersApi.getAll(selectedCategory);
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [selectedCategory]);

  const handleToggle = async (reminder) => {
    const id = reminder._id || reminder.id;
    const newStatus = !reminder.isCompleted;
    try {
      await remindersApi.update(id, { isCompleted: newStatus });
      if (newStatus) {
        confetti({
          particleCount: 35,
          spread: 45,
          origin: { y: 0.6 }
        });
        onNotify?.('Reminder completed!');
      }
      fetchReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remindersApi.delete(id);
      onNotify?.('Reminder removed');
      fetchReminders();
    } catch (e) {
      onNotify?.('Error deleting reminder');
    }
  };

  const handleSave = async (payload) => {
    try {
      await remindersApi.create(payload);
      onNotify?.('Reminder scheduled successfully');
      fetchReminders();
    } catch (e) {
      onNotify?.('Error creating reminder');
    }
  };

  // Helper to compute date status
  const getDateStatus = (targetDate) => {
    if (!targetDate) return { label: 'Scheduled', style: 'bg-slate-100 text-slate-600' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = targetDate.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `${Math.abs(diffDays)}d overdue`, style: 'bg-rose-50 text-rose-700 border-rose-200' };
    } else if (diffDays === 0) {
      return { label: 'Today', style: 'bg-amber-50 text-amber-800 border-amber-300 font-bold animate-pulse' };
    } else if (diffDays === 1) {
      return { label: 'Tomorrow', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    } else {
      return { label: `In ${diffDays} days`, style: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Study Reminders & Milestone Schedule</h1>
            <p className="text-xs text-slate-500">Track revision cycles, mock exam dates, and crucial deadlines</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {'Notification' in window && Notification.permission !== 'granted' && (
            <button
              onClick={async () => {
                const res = await Notification.requestPermission();
                if (res === 'granted') {
                  onNotify?.('Browser alerts enabled! You will receive reminder notifications.');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              Enable Browser Alerts
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Set Reminder
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Revision', 'Mock Test', 'Exam Milestone', 'Formula Review', 'General'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Reminders List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <span>Active Reminders</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px]">
            {pendingReminders.length}
          </span>
        </h2>

        {pendingReminders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">No active reminders scheduled</p>
          </div>
        ) : (
          pendingReminders.map((rem) => {
            const id = rem._id || rem.id;
            const Icon = CATEGORY_ICONS[rem.category] || Bell;
            const status = getDateStatus(rem.targetDate);

            return (
              <div
                key={id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm transition"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {rem.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${status.style}`}>
                        {status.label}
                      </span>
                    </div>

                    {rem.description && (
                      <p className="text-xs text-slate-500">
                        {rem.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {rem.targetDate}
                      </span>
                      {rem.targetTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {rem.targetTime}
                        </span>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-slate-600">{rem.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleToggle(rem)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark Done
                  </button>

                  <button
                    onClick={() => handleDelete(id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-2.5 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Completed Reminders ({completedReminders.length})
          </h2>
          <div className="space-y-2">
            {completedReminders.map((rem) => {
              const id = rem._id || rem.id;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-slate-200/60 opacity-60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="line-through font-medium text-slate-700">{rem.title}</span>
                    <span className="text-slate-400 text-[11px]">({rem.category})</span>
                  </div>
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
