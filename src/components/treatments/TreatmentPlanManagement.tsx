import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { TreatmentPlan, Patient } from '../../types';
import {
  Activity,
  Plus,
  Calendar,
  CheckCircle,
  User,
  Stethoscope,
  BookOpen,
} from 'lucide-react';

interface TreatmentPlanProps {
  preselectedPatient?: Patient | null;
}

export const TreatmentPlanManagement: React.FC<TreatmentPlanProps> = ({ preselectedPatient }) => {
  const {
    treatmentPlans,
    treatmentVisits,
    patients,
    doctors,
    addTreatmentPlan,
    addTreatmentVisit,
  } = useData();

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedPlanForVisit, setSelectedPlanForVisit] = useState<TreatmentPlan | null>(null);

  // New Plan form state
  const [patientId, setPatientId] = useState(preselectedPatient?.id || (patients[0]?.id || ''));
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [treatmentName, setTreatmentName] = useState('Metal Braces Orthodontic Correction');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>(45000);

  // New Visit form state
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [procedureDone, setProcedureDone] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [amountCharged, setAmountCharged] = useState<number | ''>(5000);

  const openPlanModal = () => {
    if (patients.length > 0 && !patientId) setPatientId(patients[0].id);
    if (doctors.length > 0 && !doctorId) setDoctorId(doctors[0].id);
    setShowPlanModal(true);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !treatmentName || !estimatedCost) return;

    addTreatmentPlan({
      patient_id: patientId,
      doctor_id: doctorId,
      treatment_name: treatmentName,
      description: description || `${treatmentName} for dental rehabilitation`,
      start_date: startDate,
      expected_end_date: expectedEndDate || startDate,
      estimated_cost: Number(estimatedCost),
      status: 'Active',
    });

    setShowPlanModal(false);
  };

  const openVisitModal = (tp: TreatmentPlan) => {
    setSelectedPlanForVisit(tp);
    setProcedureDone('');
    setVisitNotes('');
    setAmountCharged(5000);
    setShowVisitModal(true);
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForVisit || !procedureDone) return;

    addTreatmentVisit({
      treatment_plan_id: selectedPlanForVisit.id,
      visit_date: visitDate,
      procedure_done: procedureDone,
      notes: visitNotes,
      amount_charged: Number(amountCharged) || 0,
    });

    setShowVisitModal(false);
  };

  const activePlans = treatmentPlans.filter((t) => t.status === 'Active');
  const completedPlans = treatmentPlans.filter((t) => t.status === 'Completed');

  const predefinedTreatments = [
    'Metal Braces Orthodontic Correction',
    'Clear Aligners Therapy (Invisalign)',
    'Single / Multi Tooth Dental Implant',
    'Root Canal Treatment & Crown placement',
    'Porcelain / CAD-CAM Zirconia Crown',
    'Tooth Extraction & Bone Grafting',
    'Periodontal Scaling & Root Planing',
    'Full Mouth Dental Rehabilitation',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <span>Treatment Plans & Visit Log (Paper Book Replacement)</span>
          </h2>
          <p className="text-xs text-slate-400">Manage long-term dental procedures: Braces, Aligners, Implants & RCTs</p>
        </div>

        <button
          onClick={openPlanModal}
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Treatment Plan</span>
        </button>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Treatment Plans</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{activePlans.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Plans</div>
            <div className="text-2xl font-bold text-sky-400 mt-1">{completedPlans.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Recorded Visit Logs</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{treatmentVisits.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Treatment Plans Listing */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight">Active & Historical Treatment Plans</h3>

        {treatmentPlans.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            No treatment plans recorded yet. Click "Create Treatment Plan" to start.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {treatmentPlans.map((tp) => {
              const pat = patients.find((p) => p.id === tp.patient_id);
              const doc = doctors.find((d) => d.id === tp.doctor_id);
              const visits = treatmentVisits.filter((v) => v.treatment_plan_id === tp.id);

              return (
                <div
                  key={tp.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="text-base font-bold text-white">{tp.treatment_name}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            tp.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : tp.status === 'Completed'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}
                        >
                          {tp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{tp.description}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right text-xs">
                        <span className="text-slate-400 block">Est. Cost</span>
                        <span className="text-emerald-400 font-bold text-sm">
                          ₹{tp.estimated_cost.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => openVisitModal(tp)}
                        className="gradient-bg text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Visit Log</span>
                      </button>
                    </div>
                  </div>

                  {/* Patient & Doctor Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-sky-400" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">PATIENT</span>
                        <span className="font-semibold text-white">{pat?.name} ({pat?.patient_code})</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">SPECIALIST</span>
                        <span className="font-semibold text-white">{doc?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-slate-500 block text-[10px]">DURATION</span>
                        <span className="font-semibold text-white">
                          {tp.start_date} to {tp.expected_end_date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visit History Log Timeline (Digital Replacement for paper treatment book) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Visit Logs ({visits.length} recorded)</span>
                      </span>
                    </div>

                    {visits.length === 0 ? (
                      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-500 text-xs italic">
                        No treatment visits recorded yet. Click "Add Visit Log" above after completing a procedure.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {visits.map((vis, idx) => (
                          <div
                            key={vis.id}
                            className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-white">Visit #{idx + 1}: {vis.procedure_done}</span>
                                <span className="text-slate-500 text-[10px]">({vis.visit_date})</span>
                              </div>
                              <p className="text-slate-400 text-[11px]">{vis.notes}</p>
                            </div>
                            <div className="text-sky-400 font-bold text-xs shrink-0">
                              Fee: ₹{vis.amount_charged.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Treatment Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Dental Treatment Plan</h3>

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patient_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Attending Doctor *</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Treatment Plan Name *</label>
                <input
                  type="text"
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  placeholder="e.g. Metal Braces / Aligners / Root Canal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {predefinedTreatments.map((tr) => (
                    <button
                      key={tr}
                      type="button"
                      onClick={() => setTreatmentName(tr)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700"
                    >
                      {tr.split(' ')[0]} {tr.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Treatment Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clinical objectives, arch scope, bracket specifications..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Expected End</label>
                  <input
                    type="date"
                    value={expectedEndDate}
                    onChange={(e) => setExpectedEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    placeholder="45000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg text-white py-2.5 rounded-xl font-semibold shadow-md"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Treatment Visit Modal */}
      {showVisitModal && selectedPlanForVisit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Record Treatment Visit Log</h3>
            <p className="text-xs text-sky-400 font-medium">
              Plan: {selectedPlanForVisit.treatment_name}
            </p>

            <form onSubmit={handleAddVisit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Visit Date *</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Procedure Performed *</label>
                <input
                  type="text"
                  value={procedureDone}
                  onChange={(e) => setProcedureDone(e.target.value)}
                  placeholder="e.g. Lower arch wire change to 016 NiTi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Doctor Notes & Observations</label>
                <textarea
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="Patient oral hygiene condition, appliance comfort..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Visit Fee Charged (₹)</label>
                <input
                  type="number"
                  value={amountCharged}
                  onChange={(e) => setAmountCharged(Number(e.target.value))}
                  placeholder="5000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVisitModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg text-white py-2.5 rounded-xl font-semibold shadow-md"
                >
                  Save Visit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
