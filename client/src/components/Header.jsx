import React from 'react';
import { 
  FileText, 
  HelpCircle, 
  Timer, 
  CheckSquare, 
  Bell, 
  GraduationCap,
  BookOpen
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenDbModal, 
  dbStatus, 
  timerRunning, 
  timerSeconds 
}) {
  const tabs = [
    { id: 'notes', label: 'Notes (PDFs)', icon: FileText },
    { id: 'ecePyqs', label: 'GATE ECE PYQs', icon: BookOpen },
    { id: 'practice', label: 'Practice Questions', icon: HelpCircle },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'todos', label: 'To-Do List', icon: CheckSquare },
    { id: 'reminders', label: 'Reminders', icon: Bell }
  ];

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">GATE PrepStation</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200/50">
                  ECE & ENG
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Focus • Practice • Master</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.id === 'timer' && timerRunning && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Timer Pill if timer is running and not on timer tab */}
            {timerRunning && activeTab !== 'timer' && (
              <button
                onClick={() => setActiveTab('timer')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-mono font-medium animate-pulse"
              >
                <Timer className="w-3.5 h-3.5 text-rose-500" />
                {formatTimer(timerSeconds)}
              </button>
            )}

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden border-t border-slate-100 py-2 gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
