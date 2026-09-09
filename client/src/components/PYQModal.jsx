import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { GATE_SUBJECTS } from '../data/defaultData';

export default function PYQModal({ isOpen, onClose, onSave }) {
  const [year, setYear] = useState(2024);
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [marks, setMarks] = useState(2);
  const [difficulty, setDifficulty] = useState('Medium');
  const [question, setQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !correctAnswer.trim() || !explanation.trim()) return;

    let options = [];
    if (questionType === 'MCQ' || questionType === 'MSQ') {
      if (optA.trim()) options.push({ label: 'A', text: optA.trim() });
      if (optB.trim()) options.push({ label: 'B', text: optB.trim() });
      if (optC.trim()) options.push({ label: 'C', text: optC.trim() });
      if (optD.trim()) options.push({ label: 'D', text: optD.trim() });
    }

    const payload = {
      year: Number(year),
      subject,
      topic: topic.trim() || 'General',
      questionType,
      marks: Number(marks),
      difficulty,
      question: question.trim(),
      options,
      correctAnswer: correctAnswer.trim().toUpperCase(),
      explanation: explanation.trim()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">Add GATE PYQ</h2>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GATE Year *</label>
              <input
                type="number"
                required
                min="1990"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="MCQ">MCQ</option>
                <option value="NAT">NAT (Numerical)</option>
                <option value="MSQ">MSQ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marks *</label>
              <select
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1 Mark</option>
                <option value="2">2 Marks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Concept</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Asymptotic Complexity"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Question Statement *</label>
            <textarea
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="State the exact GATE question problem statement..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {questionType === 'MCQ' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Options</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Option A text"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Option B text"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Option C text"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Option D text"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correct Answer * {questionType === 'MCQ' ? '(e.g. B)' : '(e.g. 62 or 5 to 6)'}
            </label>
            <input
              type="text"
              required
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder={questionType === 'MCQ' ? 'B' : 'Exact value or range'}
              className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Step-by-Step Solution & Explanation *
            </label>
            <textarea
              required
              rows={5}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the step-by-step logic, formula used, and derivation..."
              className="w-full px-3 py-2 text-xs font-sans bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
