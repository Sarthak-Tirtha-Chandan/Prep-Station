import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

const YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i); // 2025 down to 2010

export default function ECEPaperUploadModal({ isOpen, onClose, onSave, initialYear }) {
  const [year, setYear] = useState(initialYear || 2024);
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [notes, setNotes] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (initialYear) {
      setYear(Number(initialYear));
      setTitle(`GATE ${initialYear} ECE Question Paper`);
    } else {
      setTitle(`GATE ${year} ECE Question Paper`);
    }
    setPdfFile(null);
    setPdfBase64('');
    setFileName('');
    setFileSize(0);
    setNotes('');
    setUploadError('');
  }, [initialYear, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setUploadError('Please choose a valid PDF file (.pdf)');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB limit. Please upload a smaller PDF.');
      return;
    }

    setUploadError('');
    setPdfFile(file);
    setFileName(file.name);
    setFileSize(file.size);

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
    if (!pdfBase64) {
      setUploadError('Please select a PDF file to upload');
      return;
    }

    onSave({
      year: Number(year),
      title: title.trim() || `GATE ${year} ECE Question Paper`,
      fileName: fileName || `GATE_ECE_${year}.pdf`,
      fileSize,
      fileData: pdfBase64,
      notes: notes.trim()
    });

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
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Upload GATE ECE Question Paper PDF
              </h2>
              <p className="text-[11px] text-slate-500">
                Saves PDF in MongoDB Atlas for the selected year
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

          {/* PDF Drop Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Question Paper PDF *
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
                    <p className="text-xs text-slate-500">{formatBytes(fileSize)} • Ready to upload</p>
                    <span className="text-[11px] text-indigo-600 font-medium group-hover:underline">
                      Click to choose another file
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Choose PDF for GATE {year} ECE
                    </p>
                    <p className="text-[11px] text-slate-400">PDF up to 25MB supported</p>
                  </div>
                </div>
              )}
            </label>
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
              placeholder="e.g. Set 1, 65 questions, includes MSQs..."
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
              Upload & Save to MongoDB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
