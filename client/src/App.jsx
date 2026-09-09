import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import NotesSection from './components/NotesSection';
import ECEPyqsSection from './components/ECEPyqsSection';
import PYQSection from './components/PYQSection';
import FocusTimer from './components/FocusTimer';
import TodoSection from './components/TodoSection';
import ReminderSection from './components/ReminderSection';
import ReminderAlertModal from './components/ReminderAlertModal';
import { dbService, remindersApi } from './services/api';
import { playChime } from './services/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('notes');
  const [dbStatus, setDbStatus] = useState(null);
  const [notification, setNotification] = useState(null);

  // Active Reminder Alert state
  const [activeAlertReminder, setActiveAlertReminder] = useState(null);
  const alertedIdsRef = useRef(new Set());

  // Persistent Global Focus Timer state (runs continuously across all sections)
  const [timerRunning, setTimerRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [totalInitialSeconds, setTotalInitialSeconds] = useState(25 * 60);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerSoundEnabled, setTimerSoundEnabled] = useState(true);

  // Global Timer Countdown Effect (Never unmounts, runs anywhere in the website)
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            if (timerSoundEnabled) {
              playChime('complete');
            }
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
            showNotification(`🎉 Focus session of ${customMinutes} minutes completed! Well done.`);

            // Send desktop notification if tab is in background
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('🎉 Focus Session Completed!', {
                  body: `Your ${customMinutes}-minute focus study session has finished! Time for a break.`,
                  icon: '/favicon.svg'
                });
              } catch (e) {
                console.warn(e);
              }
            }
            return customMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, customMinutes, timerSoundEnabled]);

  // Check DB status on startup
  const checkDbStatus = async () => {
    try {
      const status = await dbService.getStatus();
      setDbStatus(status);
    } catch (e) {
      setDbStatus({ connected: false, state: 'Offline' });
    }
  };

  useEffect(() => {
    checkDbStatus();
  }, []);

  // Real-Time Reminder Alert Checker (checks every 10 seconds)
  useEffect(() => {
    const checkReminders = async () => {
      try {
        const allReminders = await remindersApi.getAll('All');
        const pending = allReminders.filter(r => !r.isCompleted);
        const now = new Date();

        for (const rem of pending) {
          const id = rem._id || rem.id;
          if (!id || alertedIdsRef.current.has(id)) continue;

          if (!rem.targetDate) continue;
          const [year, month, day] = rem.targetDate.split('-').map(Number);
          const [hour, minute] = (rem.targetTime || '00:00').split(':').map(Number);

          const remTime = new Date(year, month - 1, day, hour, minute, 0, 0);

          // If current time reached or passed the reminder scheduled time
          if (now.getTime() >= remTime.getTime()) {
            alertedIdsRef.current.add(id);

            // Play audible chime alert
            playChime('complete');

            // Send native browser notification if supported and granted
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(`⏰ Reminder: ${rem.title}`, {
                  body: `${rem.subject || 'General'} • ${rem.category || 'Study Target'}\n${rem.description || ''}`,
                  icon: '/favicon.svg'
                });
              } catch (err) {
                console.warn('Desktop notification error:', err);
              }
            }

            // Show interactive alert modal on screen
            setActiveAlertReminder(rem);
            break;
          }
        }
      } catch (err) {
        // silent check error
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteReminder = async (rem) => {
    const id = rem._id || rem.id;
    try {
      await remindersApi.update(id, { isCompleted: true });
      showNotification('Reminder marked as completed!');
    } catch (e) {
      console.error(e);
    }
    setActiveAlertReminder(null);
  };

  const handleSnoozeReminder = async (rem, mins = 10) => {
    const id = rem._id || rem.id;
    try {
      const now = new Date();
      now.setMinutes(now.getMinutes() + mins);
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const yyyy = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');

      await remindersApi.update(id, {
        targetDate: `${yyyy}-${month}-${dd}`,
        targetTime: `${hh}:${mm}`
      });

      alertedIdsRef.current.delete(id);
      showNotification(`Reminder snoozed for ${mins} minutes (until ${hh}:${mm})`);
    } catch (e) {
      console.error(e);
    }
    setActiveAlertReminder(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-2xl shadow-xl border border-slate-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:text-slate-300 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with live ticking timer pill */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        timerRunning={timerRunning}
        timerSeconds={timerSeconds}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'notes' && <NotesSection onNotify={showNotification} />}
        {activeTab === 'ecePyqs' && <ECEPyqsSection onNotify={showNotification} />}
        {activeTab === 'practice' && <PYQSection onNotify={showNotification} />}
        
        {/* Focus Timer remains mounted so state & interval never reset across sections */}
        <div className={activeTab === 'timer' ? 'block' : 'hidden'}>
          <FocusTimer
            timerRunning={timerRunning}
            setTimerRunning={setTimerRunning}
            timerSeconds={timerSeconds}
            setTimerSeconds={setTimerSeconds}
            customMinutes={customMinutes}
            setCustomMinutes={setCustomMinutes}
            totalInitialSeconds={totalInitialSeconds}
            setTotalInitialSeconds={setTotalInitialSeconds}
            soundEnabled={timerSoundEnabled}
            setSoundEnabled={setTimerSoundEnabled}
            onNotify={showNotification}
          />
        </div>

        {activeTab === 'todos' && <TodoSection onNotify={showNotification} />}
        {activeTab === 'reminders' && <ReminderSection onNotify={showNotification} />}
      </main>

      {/* Minimalist Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GATE PrepStation • ECE & Engineering Study Companion</span>
          <span className="text-slate-400">GATE 2025/2026</span>
        </div>
      </footer>

      {/* Real-time Reminder Alert Modal */}
      <ReminderAlertModal
        reminder={activeAlertReminder}
        onClose={() => setActiveAlertReminder(null)}
        onComplete={handleCompleteReminder}
        onSnooze={handleSnoozeReminder}
      />
    </div>
  );
}
