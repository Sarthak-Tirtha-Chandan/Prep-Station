import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  X, 
  ExternalLink, 
  Maximize2,
  Minimize2,
  Calendar,
  Layers,
  FolderOpen
} from 'lucide-react';
import { notesApi } from '../services/api';
import { GATE_SUBJECTS } from '../data/defaultData';
import NoteModal from './NoteModal';

export default function NotesSection({ onNotify }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingPdfNote, setViewingPdfNote] = useState(null);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await notesApi.getAll(selectedSubject, searchQuery);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject, searchQuery]);

  const handleSaveNote = async (payload) => {
    try {
      await notesApi.create(payload);
      onNotify?.('PDF note uploaded and stored successfully!');
      fetchNotes();
    } catch (e) {
      onNotify?.('Error uploading note');
    }
  };

  const handleDeleteNote = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this PDF note?')) return;
    try {
      await notesApi.delete(id);
      onNotify?.('Note deleted');
      if (viewingPdfNote && (viewingPdfNote._id === id || viewingPdfNote.id === id)) {
        setViewingPdfNote(null);
      }
      fetchNotes();
    } catch (e) {
      onNotify?.('Error deleting note');
    }
  };

  const handleDownload = (note, e) => {
    e?.stopPropagation();
    if (!note.fileData) return;
    const link = document.createElement('a');
    link.href = note.fileData;
    link.download = note.fileName || `${note.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-800">Study Notes & PDFs</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                {notes.length} {notes.length === 1 ? 'Document' : 'Documents'}
              </span>
            </div>
            <p className="text-xs text-slate-500">Upload, organize by subject, and read your GATE study materials</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF notes, topics..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {GATE_SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub;
          return (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* PDF Notes Cards Grid */}
      {notes.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">No PDF notes uploaded yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Upload your handwritten formula sheets or reference PDFs</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Upload className="w-4 h-4" />
            Upload Your First PDF Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => {
            const id = note._id || note.id;
            return (
              <div
                key={id}
                onClick={() => setViewingPdfNote(note)}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {note.subject}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDownload(note, e)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteNote(id, e)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {note.topic}
                      </p>
                    </div>
                  </div>

                  {note.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {note.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>{formatBytes(note.fileSize)} • PDF</span>
                  <span className="flex items-center gap-1 text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <Eye className="w-3.5 h-3.5" /> Read PDF
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <NoteModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveNote}
      />

      {/* In-App PDF Reader Modal */}
      {viewingPdfNote && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in ${
          isPdfFullscreen ? 'p-0' : 'p-2 sm:p-4'
        }`}>
          <div className={`relative bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isPdfFullscreen
              ? 'w-screen h-screen rounded-none border-0'
              : 'w-full max-w-5xl h-[90vh] rounded-2xl border border-slate-100'
          }`}>
            {/* Modal Top Bar */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    {viewingPdfNote.title}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">
                    {viewingPdfNote.subject} • {viewingPdfNote.fileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Fullscreen toggle button */}
                <button
                  onClick={() => setIsPdfFullscreen(!isPdfFullscreen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  title={isPdfFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
                >
                  {isPdfFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isPdfFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>

                <button
                  onClick={() => handleDownload(viewingPdfNote)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>

                <button
                  onClick={() => {
                    setViewingPdfNote(null);
                    setIsPdfFullscreen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 bg-slate-800 relative">
              {viewingPdfNote.fileData ? (
                <iframe
                  src={viewingPdfNote.fileData}
                  title={viewingPdfNote.title}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                  PDF preview not available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
