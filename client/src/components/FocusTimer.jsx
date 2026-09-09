import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import { playChime } from '../services/audio';

export default function FocusTimer({ 
  timerRunning, 
  setTimerRunning, 
  timerSeconds, 
  setTimerSeconds, 
  customMinutes,
  setCustomMinutes,
  totalInitialSeconds,
  setTotalInitialSeconds,
  soundEnabled,
  setSoundEnabled,
  onNotify 
}) {
  // Quick preset pills for convenience
  const presets = [15, 25, 30, 45, 60, 90, 120];

  // Set time when custom input changes
  const applyCustomMinutes = (mins) => {
    const parsed = Math.max(1, Math.min(360, Number(mins) || 1));
    setCustomMinutes(parsed);
    setTimerRunning(false);
    setTimerSeconds(parsed * 60);
    setTotalInitialSeconds(parsed * 60);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimerSeconds(customMinutes * 60);
    setTotalInitialSeconds(customMinutes * 60);
    playChime('click');
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progressPercent = totalInitialSeconds > 0 
    ? ((totalInitialSeconds - timerSeconds) / totalInitialSeconds) * 100 
    : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-slate-700">
          <Timer className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold tracking-tight">Focus Study Timer</h2>
        </div>

        {/* Custom Duration Input */}
        <div className="flex flex-col items-center gap-2.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Set Timer Duration
          </label>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              min="1"
              max="360"
              disabled={timerRunning}
              value={customMinutes}
              onChange={(e) => applyCustomMinutes(e.target.value)}
              className="w-24 text-center py-2 text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-indigo-700 font-mono"
            />
            <span className="text-sm font-semibold text-slate-600">Minutes</span>
          </div>

          {/* Quick presets */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
            {presets.map((p) => (
              <button
                key={p}
                disabled={timerRunning}
                onClick={() => applyCustomMinutes(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  customMinutes === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40'
                }`}
              >
                {p}m
              </button>
            ))}
          </div>
        </div>

        {/* Big Clean Countdown Clock */}
        <div className="py-4">
          <div className="font-mono text-7xl font-extrabold text-slate-900 tracking-tight">
            {formattedTime}
          </div>
          {/* Progress Bar */}
          <div className="w-48 mx-auto h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Simple Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleReset}
            title="Reset timer"
            className="p-3.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setTimerRunning(!timerRunning);
              playChime('click');
            }}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md transition transform active:scale-95 ${
              timerRunning
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            {timerRunning ? 'Pause' : 'Start Focus'}
          </button>
        </div>

        {/* Sound toggle */}
        <div className="pt-2 flex items-center justify-center">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-slate-500" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Chime: {soundEnabled ? 'On' : 'Muted'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
