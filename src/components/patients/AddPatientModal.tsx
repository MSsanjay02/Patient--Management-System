import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Patient } from '../../types';
import { UserPlus, X, HeartPulse, MapPin, UserCheck } from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
  onPatientAdded?: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onPatientAdded }) => {
  const { addPatient, patients } = useData();

  const nextIdCode = `DP-${patients.length + 1001}`;

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Patient['gender']>('Male');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !age) return;

    const created = addPatient({
      name,
      age: Number(age),
      gender,
      dob: dob || new Date().toISOString().slice(0, 10),
      phone,
      address,
      city,
      blood_group: bloodGroup,
      allergies: allergies || 'None',
      medical_conditions: medicalConditions || 'None',
      notes,
    });

    if (onPatientAdded) {
      onPatientAdded(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Register New Patient</h3>
              <p className="text-xs text-slate-400">
                Auto-assigned ID:{' '}
                <span className="text-sky-400 font-bold">{nextIdCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Basic Details Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>1. Basic Personal Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    placeholder="30"
                    min="1"
                    max="120"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Patient['gender'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>2. Residential Address</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 201, Sunshine Heights, MG Road"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>3. Medical Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Known Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Latex, Aspirin"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Medical Conditions</label>
                <input
                  type="text"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  placeholder="e.g. Diabetes, Hypertension"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Clinical Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes, preferences or history..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 gradient-bg text-white py-3 rounded-xl font-semibold shadow-lg shadow-sky-500/20"
            >
              Register & Save Patient Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
