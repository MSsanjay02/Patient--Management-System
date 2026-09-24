import React, { useState } from 'react';
import type { ToothCondition } from '../../types';
import { Activity, CheckCircle, Info, Sparkles } from 'lucide-react';

interface DentalOdontogramProps {
  teethConditions: Record<number, ToothCondition>;
  onUpdateTooth?: (toothNum: number, condition: ToothCondition) => void;
  readOnly?: boolean;
}

// Universal Tooth Numbering (1-32)
// Upper Arch: 1 to 16 (1-8 Right, 9-16 Left)
// Lower Arch: 32 down to 17 (32-25 Right, 24-17 Left)
const upperRightQuadrant = [1, 2, 3, 4, 5, 6, 7, 8];
const upperLeftQuadrant = [9, 10, 11, 12, 13, 14, 15, 16];
const lowerLeftQuadrant = [17, 18, 19, 20, 21, 22, 23, 24];
const lowerRightQuadrant = [25, 26, 27, 28, 29, 30, 31, 32];

const conditionStyles: Record<
  ToothCondition['status'],
  { bg: string; text: string; border: string; label: string }
> = {
  Healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Healthy' },
  Decayed: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/40', label: 'Caries / Decayed' },
  Filled: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/40', label: 'Composite / Amalgam Fill' },
  Missing: { bg: 'bg-slate-800', text: 'text-slate-500', border: 'border-slate-700', label: 'Missing / Extracted' },
  Crown: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', label: 'Zirconia Crown' },
  RootCanal: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', label: 'Endodontic RCT' },
  Implant: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/40', label: 'Dental Implant' },
};

export const DentalOdontogram: React.FC<DentalOdontogramProps> = ({
  teethConditions,
  onUpdateTooth,
  readOnly = false,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [status, setStatus] = useState<ToothCondition['status']>('Decayed');
  const [notes, setNotes] = useState('');

  const handleToothClick = (toothNum: number) => {
    setSelectedTooth(toothNum);
    const existing = teethConditions[toothNum];
    if (existing) {
      setStatus(existing.status);
      setNotes(existing.notes || '');
    } else {
      setStatus('Decayed');
      setNotes('');
    }
  };

  const handleSaveCondition = () => {
    if (selectedTooth && onUpdateTooth) {
      onUpdateTooth(selectedTooth, {
        toothNumber: selectedTooth,
        status,
        notes,
      });
      setSelectedTooth(null);
    }
  };

  const renderToothCard = (toothNum: number) => {
    const condition = teethConditions[toothNum] || { toothNumber: toothNum, status: 'Healthy' };
    const style = conditionStyles[condition.status];

    return (
      <button
        key={toothNum}
        type="button"
        onClick={() => handleToothClick(toothNum)}
        className={`w-11 h-16 rounded-xl border flex flex-col items-center justify-between p-1.5 transition-all ${style.bg} ${style.border} hover:border-sky-400 hover:scale-105 shadow-sm relative group`}
        title={`Tooth #${toothNum}: ${style.label} ${condition.notes ? `\nNotes: ${condition.notes}` : ''}`}
      >
        <span className="text-[10px] font-bold text-slate-400">#{toothNum}</span>

        {/* Anatomical Tooth SVG Representation */}
        <div className="w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 ${style.text}`}>
            <path
              d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V9C17 12 19 14 19 17C19 20 17.5 22 15 22C13.5 22 12.5 20.5 12 19.5C11.5 20.5 10.5 22 9 22C6.5 22 5 20 5 17C5 14 7 12 7 9V4Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className={`text-[8px] font-bold tracking-tighter truncate w-full text-center ${style.text}`}>
          {condition.status}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      {/* Charting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <span>Clinical Odontogram & Tooth Charting System</span>
          </h4>
          <p className="text-xs text-slate-400">Universal Numbering System (Teeth 1-32) • Real-time clinical condition logging</p>
        </div>
        {!readOnly && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center space-x-1.5 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Chart Active</span>
          </span>
        )}
      </div>

      {/* Clinical Condition Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(Object.keys(conditionStyles) as Array<ToothCondition['status']>).map((st) => (
          <div
            key={st}
            className={`px-3 py-1 rounded-lg border flex items-center space-x-1.5 text-xs font-semibold ${conditionStyles[st].bg} ${conditionStyles[st].border} ${conditionStyles[st].text}`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{conditionStyles[st].label}</span>
          </div>
        ))}
      </div>

      {/* Anatomical Quadrants Grid */}
      <div className="space-y-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
        {/* Upper Arch */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center space-x-2">
            <span>Upper Right Quadrant</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400 font-extrabold">MAXILLARY ARCH (Teeth 1 - 16)</span>
            <span className="text-slate-600">|</span>
            <span>Upper Left Quadrant</span>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            <div className="flex gap-1.5 border-r border-slate-800 pr-3">{upperRightQuadrant.map(renderToothCard)}</div>
            <div className="flex gap-1.5 pl-3">{upperLeftQuadrant.map(renderToothCard)}</div>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-800 my-4" />

        {/* Lower Arch */}
        <div className="space-y-2">
          <div className="flex justify-center gap-2 flex-wrap">
            <div className="flex gap-1.5 border-r border-slate-800 pr-3">{lowerRightQuadrant.map(renderToothCard)}</div>
            <div className="flex gap-1.5 pl-3">{lowerLeftQuadrant.map(renderToothCard)}</div>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center space-x-2 pt-2">
            <span>Lower Right Quadrant</span>
            <span className="text-slate-600">|</span>
            <span className="text-teal-400 font-extrabold">MANDIBULAR ARCH (Teeth 17 - 32)</span>
            <span className="text-slate-600">|</span>
            <span>Lower Left Quadrant</span>
          </div>
        </div>
      </div>

      {/* Interactive Tooth Editor Drawer */}
      {selectedTooth && !readOnly && (
        <div className="p-5 bg-slate-950 border border-slate-700 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h5 className="text-sm font-bold text-white flex items-center space-x-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Record Clinical Findings for Tooth #{selectedTooth}</span>
            </h5>
            <button
              onClick={() => setSelectedTooth(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(conditionStyles) as Array<ToothCondition['status']>).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  status === st
                    ? `${conditionStyles[st].bg} ${conditionStyles[st].border} ${conditionStyles[st].text} ring-2 ring-sky-400 font-bold`
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detailed clinical notes (e.g. Occlusal pit caries, composite restoration recommended)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <button
            onClick={handleSaveCondition}
            className="clinic-btn-primary text-white font-bold text-xs flex items-center justify-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save Clinical Status for Tooth #{selectedTooth}</span>
          </button>
        </div>
      )}
    </div>
  );
};
