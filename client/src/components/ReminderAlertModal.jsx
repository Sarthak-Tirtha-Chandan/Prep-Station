import React from 'react';
import { Bell, CheckCircle2, Clock, X, RotateCcw } from 'lucide-react';

export default function ReminderAlertModal({ reminder, onClose, onComplete, onSnooze }) {
  if (!reminder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden ring-4 ring-indigo-500/20">
        {/* Glowing Top Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl animate-bounce">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                Scheduled Reminder Alert
              </span>
              <h2 className="text-lg font-extrabold leading-tight">Time for Your Study Task!</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                {reminder.subject || 'General'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                {reminder.category || 'Study Target'}
              </span>
              {reminder.targetTime && (
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {reminder.targetTime}
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 pt-1">
              {reminder.title}
            </h3>

            {reminder.description && (
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {reminder.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onComplete(reminder)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Task as Completed
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSnooze(reminder, 10)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Snooze 10 Mins
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-medium rounded-xl transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
