import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { Patient } from '../../types';
import { DentalOdontogram } from './DentalOdontogram';
import {
  User,
  Calendar,
  Activity,
  Receipt,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  FileText,
  X,
  CreditCard,
  Plus,
} from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
  onBookAppointment?: (patient: Patient) => void;
  onCreateTreatmentPlan?: (patient: Patient) => void;
  onCreateInvoice?: (patient: Patient) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onClose,
  onBookAppointment,
  onCreateTreatmentPlan,
  onCreateInvoice,
}) => {
  const {
    appointments,
    doctors,
    treatmentPlans,
    treatmentVisits,
    getPatientLedger,
    updatePatientTooth,
  } = useData();

  const [activeTab, setActiveTab] = useState<'info' | 'odontogram' | 'appointments' | 'treatments' | 'ledger'>(
    'info'
  );

  const patientAppointments = appointments.filter((a) => a.patient_id === patient.id);
  const patientTreatmentPlans = treatmentPlans.filter((tp) => tp.patient_id === patient.id);
  const ledgerEntries = getPatientLedger(patient.id);
  const totalBalance = ledgerEntries.length > 0 ? ledgerEntries[ledgerEntries.length - 1].balance : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Profile Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-sky-500/20">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white">{patient.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold">
                  {patient.patient_code}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{patient.age} yrs • {patient.gender}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{patient.phone}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{patient.city}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Action buttons */}
            {onBookAppointment && (
              <button
                onClick={() => onBookAppointment(patient)}
                className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors flex items-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appt</span>
              </button>
            )}
            {onCreateTreatmentPlan && (
              <button
                onClick={() => onCreateTreatmentPlan(patient)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Plan</span>
              </button>
            )}
            {onCreateInvoice && (
              <button
                onClick={() => onCreateInvoice(patient)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center space-x-1"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6 shrink-0 overflow-x-auto">
          {[
            { id: 'info', label: 'Personal Information', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'odontogram', label: 'Dental Charting (Odontogram)', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'appointments', label: `Appointments (${patientAppointments.length})`, icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'treatments', label: `Treatment Plans (${patientTreatmentPlans.length})`, icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'ledger', label: `Payment Ledger (₹${totalBalance.toLocaleString()})`, icon: <CreditCard className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic & Contact Info Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Personal Details & Contact
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Full Name</span>
                    <span className="font-semibold text-slate-200">{patient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Patient ID</span>
                    <span className="font-semibold text-sky-400">{patient.patient_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Age & Gender</span>
                    <span className="font-semibold text-slate-200">{patient.age} yrs • {patient.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth</span>
                    <span className="font-semibold text-slate-200">{patient.dob || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mobile Phone</span>
                    <span className="font-semibold text-slate-200">{patient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City</span>
                    <span className="font-semibold text-slate-200">{patient.city}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Address</span>
                    <span className="font-semibold text-slate-200">{patient.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Medical Information Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Medical Record & Alerts
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-slate-400">Blood Group</span>
                    </div>
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {patient.blood_group}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Known Allergies:</span>
                    </div>
                    <p className="text-slate-300">{patient.allergies || 'None reported'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Medical Conditions:</span>
                    </div>
                    <p className="text-slate-300">{patient.medical_conditions || 'None reported'}</p>
                  </div>

                  {patient.notes && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-semibold block">Staff Notes:</span>
                      <p className="text-slate-300">{patient.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'odontogram' && (
            <DentalOdontogram
              teethConditions={patient.teeth_conditions || {}}
              onUpdateTooth={(toothNum, cond) => updatePatientTooth(patient.id, toothNum, cond)}
            />
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-3">
              {patientAppointments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No appointment records found for this patient.</div>
              ) : (
                patientAppointments.map((apt) => {
                  const doc = doctors.find((d) => d.id === apt.doctor_id);
                  return (
                    <div
                      key={apt.id}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{apt.appointment_date} at {apt.appointment_time}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              apt.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : apt.status === 'Scheduled'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="text-slate-400">Doctor: {doc?.name || 'Assigned Specialist'}</div>
                        <div className="text-slate-400 text-[11px]">{apt.notes}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'treatments' && (
            <div className="space-y-4">
              {patientTreatmentPlans.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No active or historical treatment plans.</div>
              ) : (
                patientTreatmentPlans.map((tp) => {
                  const visits = treatmentVisits.filter((v) => v.treatment_plan_id === tp.id);
                  return (
                    <div key={tp.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{tp.treatment_name}</h4>
                          <p className="text-slate-400">{tp.description}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          {tp.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-500 block">Start Date</span>
                          <span className="text-white font-medium">{tp.start_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Expected End</span>
                          <span className="text-white font-medium">{tp.expected_end_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Est. Total Cost</span>
                          <span className="text-emerald-400 font-bold">₹{tp.estimated_cost.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Visit Log Timeline */}
                      <div className="space-y-2 pt-2">
                        <div className="font-bold text-slate-300 text-xs flex items-center justify-between">
                          <span>Treatment Visit Logs ({visits.length})</span>
                        </div>
                        {visits.length === 0 ? (
                          <p className="text-slate-500 italic">No visit logs recorded yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {visits.map((vis) => (
                              <div key={vis.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                                <div className="flex justify-between font-semibold text-white">
                                  <span>{vis.procedure_done}</span>
                                  <span className="text-sky-400">₹{vis.amount_charged}</span>
                                </div>
                                <div className="text-slate-400 text-[11px] flex justify-between mt-1">
                                  <span>{vis.notes}</span>
                                  <span className="text-slate-500">{vis.visit_date}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-xs">Current Outstanding Balance</div>
                  <div className="text-xl font-bold text-amber-400">
                    ₹{totalBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              {ledgerEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No ledger transaction entries found.</div>
              ) : (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right">Debit (Charge)</th>
                        <th className="px-4 py-3 text-right">Credit (Paid)</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {ledgerEntries.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-900/50">
                          <td className="px-4 py-3 text-slate-400">{l.date}</td>
                          <td className="px-4 py-3 font-medium text-white">{l.description}</td>
                          <td className="px-4 py-3 text-right text-red-400 font-medium">
                            {l.debit > 0 ? `₹${l.debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                            {l.credit > 0 ? `₹${l.credit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-sky-400">
                            ₹{l.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
