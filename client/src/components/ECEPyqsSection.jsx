import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Calendar, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  FolderOpen,
  RefreshCw,
  Plus
} from 'lucide-react';
import { ecePapersApi } from '../services/api';
import { convertToDrivePreview } from '../utils/driveUtils';
import ECEPaperUploadModal from './ECEPaperUploadModal';

const ALL_YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i); // 2025 down to 2010

export default function ECEPyqsSection({ onNotify }) {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [uploadedPapers, setUploadedPapers] = useState([]);
  const [currentPaper, setCurrentPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadYear, setUploadYear] = useState(2024);

  // Fetch list of uploaded papers (metadata)
  const fetchPapersList = async () => {
    try {
      const list = await ecePapersApi.getAll();
      setUploadedPapers(list);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch paper for the currently selected year
  const fetchCurrentYearPaper = async (year) => {
    setLoading(true);
    try {
      const paper = await ecePapersApi.getByYear(year);
      setCurrentPaper(paper);
    } catch (err) {
      setCurrentPaper(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapersList();
  }, []);

  useEffect(() => {
    fetchCurrentYearPaper(selectedYear);
  }, [selectedYear]);

  const handleSavePaper = async (payload) => {
    try {
      const saved = await ecePapersApi.upload(payload);
      onNotify?.(`GATE ECE ${saved.year} question paper saved successfully!`);
      await fetchPapersList();
      setSelectedYear(saved.year);
      await fetchCurrentYearPaper(saved.year);
    } catch (e) {
      onNotify?.('Error saving paper');
    }
  };

  const handleDeletePaper = async (year) => {
    if (!window.confirm(`Delete the uploaded paper for GATE ECE ${year}?`)) return;
    try {
      await ecePapersApi.delete(year);
      onNotify?.(`GATE ECE ${year} paper deleted`);
      await fetchPapersList();
      setCurrentPaper(null);
    } catch (e) {
      onNotify?.('Error deleting paper');
    }
  };

  const handleDownload = () => {
    if (currentPaper?.driveLink) {
      window.open(currentPaper.driveLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!currentPaper?.fileData) return;
    const link = document.createElement('a');
    link.href = currentPaper.fileData;
    link.download = currentPaper.fileName || `GATE_ECE_${selectedYear}.pdf`;
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

  // Set of years that have uploaded papers
  const uploadedYearSet = new Set(uploadedPapers.map(p => Number(p.year)));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">GATE ECE Previous Year Question Papers</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                2010 – 2025 Archive
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60">
                {uploadedPapers.length} Papers Uploaded
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Upload and read authentic GATE Electronics & Communication question papers year by year
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUploadYear(selectedYear);
              setIsUploadModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Paper (Drive Link)
          </button>
        </div>
      </div>

      {/* Year Selector Pills (from 2010 to 2025) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Select GATE Exam Year:
          </span>
          <span className="text-xs font-semibold text-slate-600">
            Selected: <strong className="text-indigo-700 font-bold">GATE {selectedYear} ECE</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ALL_YEARS.map((year) => {
            const isSelected = selectedYear === year;
            const isUploaded = uploadedYearSet.has(year);

            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{year}</span>
                {isUploaded && (
                  <span
                    title="Paper uploaded for this year"
                    className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Paper Content: Embedded Viewer OR Upload Prompt */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading GATE {selectedYear} paper...</p>
        </div>
      ) : currentPaper && (currentPaper.driveLink || currentPaper.fileData) ? (
        <div className="space-y-3">
          {/* Metadata Banner */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{currentPaper.title}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                    Saved in MongoDB
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {currentPaper.driveLink ? 'Google Drive PDF' : `${currentPaper.fileName} • ${formatBytes(currentPaper.fileSize)}`}
                  {currentPaper.notes && ` • ${currentPaper.notes}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUploadYear(selectedYear);
                  setIsUploadModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <Upload className="w-3.5 h-3.5" /> Edit Paper
              </button>

              {currentPaper.driveLink ? (
                <a
                  href={currentPaper.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
                </a>
              ) : (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              )}

              <button
                onClick={() => handleDeletePaper(selectedYear)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Delete Paper"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Container (supports Fullscreen) */}
          <div className={`bg-slate-900 flex flex-col transition-all duration-200 ${
            isFullscreen
              ? 'fixed inset-0 z-50 w-screen h-screen rounded-none'
              : 'rounded-2xl overflow-hidden border border-slate-800 shadow-lg h-[750px]'
          }`}>
            <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">
                  GATE {selectedYear} ECE Question Paper PDF
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>

                {currentPaper.driveLink ? (
                  <a
                    href={currentPaper.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
                  </a>
                ) : (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-100 relative">
              <iframe
                src={currentPaper.driveLink ? convertToDrivePreview(currentPaper.driveLink) : currentPaper.fileData}
                title={`GATE ECE ${selectedYear} Question Paper`}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: Prompt to upload PDF for this specific year */
        <div className="p-16 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-500 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderOpen className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No paper added for GATE ECE {selectedYear} yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provide a Google Drive sharing link for the GATE {selectedYear} Electronics & Communication Engineering question paper to read and solve it directly in-app.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setUploadYear(selectedYear);
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition"
            >
              <Plus className="w-4 h-4" />
              Add GATE ECE {selectedYear} Paper Link
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <ECEPaperUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSavePaper}
        initialYear={uploadYear}
      />
    </div>
  );
}
