import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { Patient } from '../../types';
import { AddPatientModal } from './AddPatientModal';
import { PatientProfile } from './PatientProfile';
import { Users, UserPlus, Search, Phone, MapPin, Eye, Filter } from 'lucide-react';

interface PatientManagementProps {
  onBookAppointment?: (patient: Patient) => void;
  onCreateTreatmentPlan?: (patient: Patient) => void;
  onCreateInvoice?: (patient: Patient) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  onBookAppointment,
  onCreateTreatmentPlan,
  onCreateInvoice,
}) => {
  const { patients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Search by Patient ID, Mobile Number, or Patient Name (PRD Module 4)
  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.patient_code.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      p.city.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-sky-400" />
            <span>Patient Management Directory</span>
          </h2>
          <p className="text-xs text-slate-400">Search patient records, medical history & tooth conditions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Real-time Patient Search Bar (PRD Module 4 Requirement) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient Code (e.g. DP-1001), Full Name, or Phone Number..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Total Records: <strong className="text-white">{filteredPatients.length}</strong></span>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Patient Code</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Age / Gender</th>
                <th className="px-5 py-3.5">Contact Phone</th>
                <th className="px-5 py-3.5">Blood / Allergies</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No matching patient records found. Try adjusting your search keyword.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-sky-400">{pat.patient_code}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{pat.name}</div>
                      <div className="text-[11px] text-slate-400">{pat.address}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-300">
                      {pat.age} yrs • {pat.gender}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1 text-slate-300 font-medium">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{pat.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[10px]">
                          {pat.blood_group}
                        </span>
                        {pat.allergies && pat.allergies !== 'None' && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                            {pat.allergies}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{pat.city}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedPatient(pat)}
                        className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddPatientModal onClose={() => setShowAddModal(false)} />}

      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onBookAppointment={onBookAppointment}
          onCreateTreatmentPlan={onCreateTreatmentPlan}
          onCreateInvoice={onCreateInvoice}
        />
      )}
    </div>
  );
};
