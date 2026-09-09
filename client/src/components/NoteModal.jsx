import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { GATE_SUBJECTS } from '../data/defaultData';

export default function NoteModal({ isOpen, onClose, onSave, editingNote }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Networks, Signals & Systems');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setSubject(editingNote.subject || 'Networks, Signals & Systems');
      setTopic(editingNote.topic || '');
      setDescription(editingNote.description || '');
      setTags((editingNote.tags || []).join(', '));
      setFileName(editingNote.fileName || '');
      setFileSize(editingNote.fileSize || 0);
      setPdfBase64(editingNote.fileData || '');
      setPdfFile(null);
      setUploadError('');
    } else {
      setTitle('');
      setSubject('Networks, Signals & Systems');
      setTopic('');
      setDescription('');
      setTags('');
      setPdfFile(null);
      setPdfBase64('');
      setFileName('');
      setFileSize(0);
      setUploadError('');
    }
  }, [editingNote, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadError('Please select a valid PDF file (.pdf)');
      return;
    }

    // Limit to 25MB for browser responsiveness
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB limit. Please upload a smaller PDF.');
      return;
    }

    setUploadError('');
    setPdfFile(file);
    setFileName(file.name);
    setFileSize(file.size);

    if (!title.trim()) {
      // Auto-set title from file name (without extension)
      const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPdfBase64(reader.result);
    };
    reader.onerror = () => {
      setUploadError('Error reading PDF file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a title for the note');
      return;
    }

    if (!pdfBase64) {
      setUploadError('Please select a PDF file to upload');
      return;
    }

    const payload = {
      title: title.trim(),
      subject,
      topic: topic.trim() || 'General',
      description: description.trim(),
      fileName: fileName || 'document.pdf',
      fileSize,
      fileData: pdfBase64,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    onSave(payload);
    onClose();
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {editingNote ? 'Edit PDF Note' : 'Upload PDF Study Material'}
              </h2>
              <p className="text-[11px] text-slate-400">Stores PDF securely in MongoDB</p>
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

          {/* PDF Upload Drop Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select PDF File *
            </label>
            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer bg-slate-50/60 hover:bg-indigo-50/20 transition group">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
              {pdfBase64 ? (
                <div className="flex items-center gap-3 text-left">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{fileName}</p>
                    <p className="text-xs text-slate-500">{formatBytes(fileSize)} • Ready to save</p>
                    <span className="text-[11px] text-indigo-600 font-medium group-hover:underline">Click to change file</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Click to choose a PDF or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400">PDF up to 25MB supported</p>
                  </div>
                </div>
              )}
            </label>
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
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                placeholder="e.g. Feedback Amplifiers"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                placeholder="e.g. Formulas, OpAmp, High Yield"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Summary (optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts or chapters covered in this PDF..."
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
              disabled={!pdfBase64}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {editingNote ? 'Update Note' : 'Upload & Save to MongoDB'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
