import React, { useState } from 'react';
import { ToothCondition } from '../../types';
import { Activity, CheckCircle, Info } from 'lucide-react';

interface DentalOdontogramProps {
  teethConditions: Record<number, ToothCondition>;
  onUpdateTooth?: (toothNum: number, condition: ToothCondition) => void;
  readOnly?: boolean;
}

// Standard FDI / Universal Numbering 1 to 32
// Upper Arch: 1 to 16
// Lower Arch: 32 down to 17
const upperArchTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
const lowerArchTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

const conditionColors: Record<ToothCondition['status'], { bg: string; text: string; border: string }> = {
  Healthy: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  Decayed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40' },
  Filled: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40' },
  Missing: { bg: 'bg-slate-700/60', text: 'text-slate-400', border: 'border-slate-600' },
  Crown: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' },
  RootCanal: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
  Implant: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40' },
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

  const renderToothPill = (toothNum: number) => {
    const condition = teethConditions[toothNum] || { toothNumber: toothNum, status: 'Healthy' };
    const colors = conditionColors[condition.status];

    return (
      <button
        key={toothNum}
        type="button"
        onClick={() => handleToothClick(toothNum)}
        className={`w-10 h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all ${colors.bg} ${colors.border} hover:scale-105 shadow-sm relative group`}
        title={`Tooth #${toothNum}: ${condition.status}`}
      >
        <span className="text-[10px] font-bold text-slate-400">#{toothNum}</span>
        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[9px] font-bold">
          {condition.status.charAt(0)}
        </div>
        <span className={`text-[8px] font-semibold tracking-tighter truncate w-full text-center ${colors.text}`}>
          {condition.status}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Interactive Dental Odontogram (Tooth Charting)</span>
          </h4>
          <p className="text-xs text-slate-400">Click any tooth to view or record tooth status</p>
        </div>
        {!readOnly && (
          <span className="text-[11px] text-sky-400 font-medium bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-full">
            Clinical Editor Active
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(Object.keys(conditionColors) as Array<ToothCondition['status']>).map((st) => (
          <div
            key={st}
            className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1 text-[11px] font-semibold ${conditionColors[st].bg} ${conditionColors[st].border} ${conditionColors[st].text}`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{st}</span>
          </div>
        ))}
      </div>

      {/* Arch Grid */}
      <div className="space-y-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        {/* Upper Arch */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase text-center">
            Upper Dental Arch (Teeth 1 - 16)
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {upperArchTeeth.map(renderToothPill)}
          </div>
        </div>

        <div className="border-t border-dashed border-slate-800 my-2" />

        {/* Lower Arch */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase text-center">
            Lower Dental Arch (Teeth 17 - 32)
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {lowerArchTeeth.map(renderToothPill)}
          </div>
        </div>
      </div>

      {/* Edit Tooth Condition Modal / Popup */}
      {selectedTooth && !readOnly && (
        <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-white flex items-center space-x-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Tooth #{selectedTooth} Condition Editor</span>
            </h5>
            <button
              onClick={() => setSelectedTooth(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(conditionColors) as Array<ToothCondition['status']>).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  status === st
                    ? `${conditionColors[st].bg} ${conditionColors[st].border} ${conditionColors[st].text} ring-1 ring-sky-400 font-bold`
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
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
            placeholder="Clinical notes (e.g. Deep occlusal caries, requires composite resin filling)"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <button
            onClick={handleSaveCondition}
            className="gradient-bg text-white font-semibold px-4 py-2 rounded-lg text-xs shadow flex items-center space-x-1"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Save Tooth #{selectedTooth} Status</span>
          </button>
        </div>
      )}
    </div>
  );
};
