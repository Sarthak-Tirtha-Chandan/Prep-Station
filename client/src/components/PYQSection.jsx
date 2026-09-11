import React, { useState } from 'react';
import { 
  Globe, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  BookOpen,
  Sparkles
} from 'lucide-react';

const EXAMSIDE_TOPIC_URL = 'https://questions.examside.com/past-years/gate/gate-ece';
const PRACTICE_PAPER_TOPIC_URL = 'https://practicepaper.in/gate-ec/topic-wise-practice-of-gate-ec-previous-year-papers';

const EXAMSIDE_SUBJECTS = [
  { label: 'All Subjects (Overview)', url: 'https://questions.examside.com/past-years/gate/gate-ece' },
  { label: 'Network Theory', url: 'https://questions.examside.com/past-years/gate/gate-ece/network-theory' },
  { label: 'Signals & Systems', url: 'https://questions.examside.com/past-years/gate/gate-ece/signals-and-systems' },
  { label: 'Electronic Devices & VLSI', url: 'https://questions.examside.com/past-years/gate/gate-ece/electronic-devices-and-vlsi' },
  { label: 'Analog Circuits', url: 'https://questions.examside.com/past-years/gate/gate-ece/analog-circuits' },
  { label: 'Digital Circuits', url: 'https://questions.examside.com/past-years/gate/gate-ece/digital-circuits' },
  { label: 'Control Systems', url: 'https://questions.examside.com/past-years/gate/gate-ece/control-systems' },
  { label: 'Communications', url: 'https://questions.examside.com/past-years/gate/gate-ece/communications' },
  { label: 'Electromagnetics', url: 'https://questions.examside.com/past-years/gate/gate-ece/electromagnetics' },
  { label: 'Engineering Mathematics', url: 'https://questions.examside.com/past-years/gate/gate-ece/engineering-mathematics' },
  { label: 'General Aptitude', url: 'https://questions.examside.com/past-years/gate/gate-ece/general-aptitude' }
];

const PRACTICE_PAPER_SUBJECTS = [
  { label: 'All Subjects (Overview)', url: 'https://practicepaper.in/gate-ec/gate-ec-subject-wise-questions' },
  { label: 'Network Theory', url: 'https://practicepaper.in/gate-ec/network-theory' },
  { label: 'Signals & Systems', url: 'https://practicepaper.in/gate-ec/signals-and-systems' },
  { label: 'Electronic Devices', url: 'https://practicepaper.in/gate-ec/electronic-devices' },
  { label: 'Analog Circuits', url: 'https://practicepaper.in/gate-ec/analog-circuits' },
  { label: 'Digital Circuits', url: 'https://practicepaper.in/gate-ec/digital-circuits' },
  { label: 'Control Systems', url: 'https://practicepaper.in/gate-ec/control-systems' },
  { label: 'Communication Systems', url: 'https://practicepaper.in/gate-ec/communication-systems' },
  { label: 'Electromagnetics', url: 'https://practicepaper.in/gate-ec/electromagnetics' },
  { label: 'Engineering Mathematics', url: 'https://practicepaper.in/gate-ec/engineering-mathematics' }
];

export default function PYQSection() {
  const [provider, setProvider] = useState('examside'); // 'examside' or 'practicepaper'
  const [mode, setMode] = useState('topic'); // 'topic' or 'subject'
  const [selectedExamsideSubject, setSelectedExamsideSubject] = useState(EXAMSIDE_SUBJECTS[0].url);
  const [selectedPracticePaperSubject, setSelectedPracticePaperSubject] = useState(PRACTICE_PAPER_SUBJECTS[0].url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const getUrl = (prov, mod, examSub, practSub) => {
    if (prov === 'examside') {
      return mod === 'topic' ? EXAMSIDE_TOPIC_URL : examSub;
    } else {
      return mod === 'topic' ? PRACTICE_PAPER_TOPIC_URL : practSub;
    }
  };

  const activeUrl = getUrl(provider, mode, selectedExamsideSubject, selectedPracticePaperSubject);

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleSubjectSelect = (url) => {
    if (provider === 'examside') {
      setSelectedExamsideSubject(url);
    } else {
      setSelectedPracticePaperSubject(url);
    }
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const currentSubjects = provider === 'examside' ? EXAMSIDE_SUBJECTS : PRACTICE_PAPER_SUBJECTS;
  const currentSubjectValue = provider === 'examside' ? selectedExamsideSubject : selectedPracticePaperSubject;

  return (
    <div className="space-y-4">
      {/* Top Controls Card (hidden when in fullscreen) */}
      {!isFullscreen && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900">GATE ECE Practice Portal</h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                    {provider === 'examside' ? 'ExamSIDE' : 'PracticePaper'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {provider === 'examside'
                    ? 'Explore Chapter-wise and Topic-wise GATE ECE questions with detailed explanations from ExamSIDE'
                    : 'Interactive mock questions and subject-wise practice tests from PracticePaper.in'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition"
              >
                <Maximize2 className="w-4 h-4" />
                Open Fullscreen
              </button>

              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                New Tab
              </a>
            </div>
          </div>

          {/* Provider Selection & Mode Filter Controls */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 1. Platform / Source Selection Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => handleProviderChange('examside')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    provider === 'examside'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  ExamSIDE
                </button>

                <button
                  type="button"
                  onClick={() => handleProviderChange('practicepaper')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    provider === 'practicepaper'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  Practice Paper
                </button>
              </div>
            </div>

            {/* 2. Format: Topic-Wise vs Subject-Wise */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => handleModeChange('topic')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'topic'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Topic-Wise
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('subject')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    mode === 'subject'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Subject-Wise
                </button>
              </div>

              {/* Subject Selector Dropdown (shown when Subject-Wise is selected) */}
              {mode === 'subject' && (
                <div className="flex items-center gap-2">
                  <select
                    value={currentSubjectValue}
                    onChange={(e) => handleSubjectSelect(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {currentSubjects.map((sub) => (
                      <option key={sub.url} value={sub.url}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Website Container (Normal View or Fullscreen View) */}
      <div className={`bg-slate-900 flex flex-col transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none'
          : 'rounded-3xl overflow-hidden border border-slate-300 shadow-xl h-[820px]'
      }`}>
        {/* Top Floating Browser Navigation Bar */}
        <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono text-slate-300 truncate text-[11px]">
              {activeUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Switch in Fullscreen */}
            {isFullscreen && (
              <div className="flex items-center gap-2 mr-2">
                {/* Fullscreen Provider Buttons */}
                <div className="flex items-center gap-1 bg-slate-700/80 p-0.5 rounded-lg">
                  <button
                    onClick={() => handleProviderChange('examside')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      provider === 'examside' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    ExamSIDE
                  </button>
                  <button
                    onClick={() => handleProviderChange('practicepaper')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      provider === 'practicepaper' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    PracticePaper
                  </button>
                </div>

                {/* Fullscreen Mode Buttons */}
                <div className="flex items-center gap-1 bg-slate-700/80 p-0.5 rounded-lg">
                  <button
                    onClick={() => handleModeChange('topic')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      mode === 'topic' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Topic-Wise
                  </button>
                  <button
                    onClick={() => handleModeChange('subject')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      mode === 'subject' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Subject-Wise
                  </button>
                </div>

                {mode === 'subject' && (
                  <select
                    value={currentSubjectValue}
                    onChange={(e) => handleSubjectSelect(e.target.value)}
                    className="px-2 py-1 bg-slate-700 border border-slate-600 rounded-md text-[11px] font-medium text-slate-200 focus:outline-none cursor-pointer max-w-[160px]"
                  >
                    {currentSubjects.map((sub) => (
                      <option key={sub.url} value={sub.url}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
              title="Reload Page"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            {/* Open in New Tab */}
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>
          </div>
        </div>

        {/* Embedded Iframe with Loading Overlay */}
        <div className="flex-1 w-full bg-white relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 text-white gap-3 transition-opacity">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <p className="text-xs text-slate-300 font-medium tracking-wide">
                Loading {provider === 'examside' ? 'ExamSIDE' : 'PracticePaper'} Portal...
              </p>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={activeUrl}
            title="GATE Practice Paper"
            className="w-full h-full border-0"
            allow="fullscreen"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}

