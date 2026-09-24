import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { Doctor } from '../../types';
import { UserCheck, Plus, Search, Edit, Ban, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export const DoctorManagement: React.FC = () => {
  const { doctors, addDoctor, updateDoctor } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const openAddModal = () => {
    setName('');
    setQualification('');
    setSpecialization('');
    setPhone('');
    setEmail('');
    setEditingDoc(null);
    setShowModal(true);
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoc(doc);
    setName(doc.name);
    setQualification(doc.qualification);
    setSpecialization(doc.specialization);
    setPhone(doc.phone);
    setEmail(doc.email);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specialization.trim()) return;

    if (editingDoc) {
      updateDoctor(editingDoc.id, {
        name,
        qualification,
        specialization,
        phone,
        email,
      });
    } else {
      addDoctor({
        name,
        qualification,
        specialization,
        phone,
        email,
        status: 'Active',
      });
    }

    setShowModal(false);
  };

  const toggleDoctorStatus = (doc: Doctor) => {
    const newStatus = doc.status === 'Active' ? 'Disabled' : 'Active';
    updateDoctor(doc.id, { status: newStatus });
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-sky-400" />
            <span>Doctor Management Directory</span>
          </h2>
          <p className="text-xs text-slate-400">Manage dental specialists, qualifications & clinic availability</p>
        </div>

        <button
          onClick={openAddModal}
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor by name or specialization..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <span className="text-xs text-slate-400 px-3 hidden sm:inline">
          {filteredDoctors.length} Doctors Registered
        </span>
      </div>

      {/* Doctors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 text-lg">
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{doc.name}</h3>
                    <p className="text-xs text-sky-400 font-medium flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>{doc.qualification}</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    doc.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-300">{doc.specialization}</div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{doc.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{doc.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 text-xs">
              <button
                onClick={() => openEditModal(doc)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-sky-400 py-1.5 rounded-xl font-medium transition-colors flex items-center justify-center space-x-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
              <button
                onClick={() => toggleDoctorStatus(doc)}
                className={`flex-1 py-1.5 rounded-xl font-medium transition-colors flex items-center justify-center space-x-1 ${
                  doc.status === 'Active'
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {doc.status === 'Active' ? (
                  <>
                    <Ban className="w-3.5 h-3.5" />
                    <span>Disable</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Enable</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingDoc ? 'Edit Doctor Record' : 'Register New Doctor'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Samuel Green"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Qualifications</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="BDS, MDS (Orthodontics)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Orthodontics & Braces"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@clinic.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg text-white py-2.5 rounded-xl font-semibold shadow-md"
                >
                  {editingDoc ? 'Save Updates' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
