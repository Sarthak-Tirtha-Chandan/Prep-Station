import React, { useState, useEffect } from 'react';
import { X, Link, CheckCircle2, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { GATE_SUBJECTS } from '../data/defaultData';
import { isValidDriveLink, convertToDrivePreview } from '../utils/driveUtils';

export default function NoteModal({ isOpen, onClose, onSave, editingNote }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Networks, Signals & Systems');
  const [driveLink, setDriveLink] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setSubject(editingNote.subject || 'Networks, Signals & Systems');
      setDriveLink(editingNote.driveLink || editingNote.fileData || '');
      setTopic(editingNote.topic || '');
      setDescription(editingNote.description || '');
      setTags((editingNote.tags || []).join(', '));
      setUploadError('');
    } else {
      setTitle('');
      setSubject('Networks, Signals & Systems');
      setDriveLink('');
      setTopic('');
      setDescription('');
      setTags('');
      setUploadError('');
    }
  }, [editingNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a title for the note');
      return;
    }

    if (!driveLink.trim()) {
      setUploadError('Please provide a Google Drive link');
      return;
    }

    const payload = {
      title: title.trim(),
      subject,
      driveLink: driveLink.trim(),
      fileName: `${title.trim()}.pdf`,
      topic: topic.trim() || 'General',
      description: description.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    onSave(payload);
    onClose();
  };

  const isLinkValid = isValidDriveLink(driveLink);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {editingNote ? 'Edit Study Note' : 'Add Note via Google Drive Link'}
              </h2>
              <p className="text-[11px] text-slate-400">Embed any size PDF directly from your Google Drive</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Analog Circuits Short Notes"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {GATE_SUBJECTS.filter(s => s !== 'All').map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topic / Chapter
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Feedback Amplifiers, Op-Amp"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Formulas, High Yield, PYQ Reference"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Remarks (optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts or chapters covered in this document..."
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
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              {editingNote ? 'Update Note' : 'Save Note to Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
