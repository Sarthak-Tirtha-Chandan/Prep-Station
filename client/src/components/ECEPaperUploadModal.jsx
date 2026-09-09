import React, { useState, useEffect } from 'react';
import { X, Link, AlertCircle, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';
import { isValidDriveLink, convertToDrivePreview } from '../utils/driveUtils';

const YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i); // 2025 down to 2010

export default function ECEPaperUploadModal({ isOpen, onClose, onSave, initialYear }) {
  const [year, setYear] = useState(initialYear || 2024);
  const [title, setTitle] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (initialYear) {
      setYear(Number(initialYear));
      setTitle(`GATE ${initialYear} ECE Question Paper`);
    } else {
      setTitle(`GATE ${year} ECE Question Paper`);
    }
    setDriveLink('');
    setNotes('');
    setUploadError('');
  }, [initialYear, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driveLink.trim()) {
      setUploadError('Please provide a Google Drive link for this question paper');
      return;
    }

    onSave({
      year: Number(year),
      title: title.trim() || `GATE ${year} ECE Question Paper`,
      driveLink: driveLink.trim(),
      fileName: `GATE_ECE_${year}.pdf`,
      notes: notes.trim()
    });

    onClose();
  };

  const isLinkValid = isValidDriveLink(driveLink);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Link className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Add GATE ECE Paper via Google Drive
              </h2>
              <p className="text-[11px] text-slate-500">
                Embed full question papers of any file size smoothly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GATE Exam Year *
            </label>
            <select
              value={year}
              onChange={(e) => {
                const yr = Number(e.target.value);
                setYear(yr);
                setTitle(`GATE ${yr} ECE Question Paper`);
              }}
              className="w-full px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              {YEARS.map((yr) => (
                <option key={yr} value={yr}>GATE {yr} ECE</option>
              ))}
            </select>
          </div>

          {/* Google Drive Link Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Google Drive PDF Link *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={driveLink}
                onChange={(e) => {
                  setDriveLink(e.target.value);
                  setUploadError('');
                }}
                placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              {driveLink && (
                <div className="absolute right-2.5 top-2.5">
                  {isLinkValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              )}
            </div>

            {/* Helper Info Box */}
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span>In Google Drive, click <strong>Share</strong> &gt; set General Access to <strong>"Anyone with the link can view"</strong>, then copy and paste the link here.</span>
                {driveLink && isLinkValid && (
                  <div className="mt-1 flex items-center gap-1.5 text-indigo-700 font-medium">
                    <span>In-app preview format:</span>
                    <a
                      href={convertToDrivePreview(driveLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline inline-flex items-center gap-0.5"
                    >
                      Test Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paper Title / Display Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Optional Notes (Organizing institute, paper pattern, etc.)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. IISc Bangalore, 65 questions, includes MSQs..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!driveLink.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              Save Paper
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
