import React, { useState } from 'react';
import { 
  Globe, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  BookOpen
} from 'lucide-react';

const TOPIC_WISE_URL = 'https://practicepaper.in/gate-ec/topic-wise-practice-of-gate-ec-previous-year-papers';
const SUBJECT_WISE_URL = 'https://practicepaper.in/gate-ec/gate-ec-subject-wise-questions';

const SUBJECT_OPTIONS = [
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

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') 
  : '';

const getProxyUrl = (url) => `${API_BASE}/api/practice-proxy?url=${encodeURIComponent(url)}`;

export default function PYQSection() {
  const [activeMode, setActiveMode] = useState('topic'); // 'topic' or 'subject'
  const [activeUrl, setActiveUrl] = useState(TOPIC_WISE_URL);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0].url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [useProxy, setUseProxy] = useState(true);

  // Auto-detect if backend proxy is alive. If not (e.g. static Vercel host without backend), fallback to direct embed
  React.useEffect(() => {
    const checkProxySupport = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2000) });
        if (!res.ok) {
          setUseProxy(false);
        } else {
          setUseProxy(true);
        }
      } catch (e) {
        setUseProxy(false);
      }
    };
    checkProxySupport();
  }, []);

  const handleSwitchMode = (mode) => {
    setActiveMode(mode);
    if (mode === 'topic') {
      setActiveUrl(TOPIC_WISE_URL);
    } else {
      setActiveUrl(selectedSubject || SUBJECT_WISE_URL);
    }
    setIframeKey(prev => prev + 1);
  };

  const handleSubjectChange = (url) => {
    setSelectedSubject(url);
    setActiveUrl(url);
    setIframeKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Card (hidden in fullscreen mode) */}
      {!isFullscreen && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900">GATE EC Practice Portal</h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    Live Practice
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Interactive problem sets from practicepaper.in with instant solution evaluation
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

          {/* Mode Selector Tabs: Topic-Wise vs Subject-Wise */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl gap-1">
              <button
                onClick={() => handleSwitchMode('topic')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'topic'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Topic-Wise Practice
              </button>

              <button
                onClick={() => handleSwitchMode('subject')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'subject'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Subject-Wise Practice
              </button>
            </div>

            {activeMode === 'subject' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub.url} value={sub.url}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded Website Container (Normal View or 100% Fullscreen View) */}
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
                <div className="flex items-center gap-1 bg-slate-700/80 p-0.5 rounded-lg">
                  <button
                    onClick={() => handleSwitchMode('topic')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                      activeMode === 'topic' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Topic-Wise
                  </button>
                  <button
                    onClick={() => handleSwitchMode('subject')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                      activeMode === 'subject' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Subject-Wise
                  </button>
                </div>

                {activeMode === 'subject' && (
                  <select
                    value={selectedSubject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="px-2 py-1 bg-slate-700 border border-slate-600 rounded-md text-[11px] font-medium text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
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
              title="Reload Practice Paper"
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

        {/* Embedded Iframe */}
        <div className="flex-1 w-full bg-white relative">
          <iframe
            key={`${iframeKey}-${useProxy ? 'proxy' : 'direct'}`}
            src={useProxy ? getProxyUrl(activeUrl) : activeUrl}
            title="GATE Practice Paper"
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}

