import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import type { AppointmentStatus, Patient } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AppointmentManagementProps {
  preselectedPatient?: Patient | null;
}

export const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ preselectedPatient }) => {
  const { appointments, patients, doctors, addAppointment, updateAppointmentStatus } = useData();

  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [filterDoctorId, setFilterDoctorId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [showModal, setShowModal] = useState(false);

  // New appointment form state
  const [patientId, setPatientId] = useState(preselectedPatient?.id || (patients[0]?.id || ''));
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [aptDate, setAptDate] = useState(new Date().toISOString().slice(0, 10));
  const [aptTime, setAptTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  const openBookingModal = () => {
    if (patients.length > 0 && !patientId) setPatientId(patients[0].id);
    if (doctors.length > 0 && !doctorId) setDoctorId(doctors[0].id);
    setShowModal(true);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !aptDate || !aptTime) return;

    addAppointment({
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: aptDate,
      appointment_time: aptTime,
      status: 'Scheduled',
      notes,
    });

    setShowModal(false);
    setNotes('');
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (filterDoctorId !== 'all' && apt.doctor_id !== filterDoctorId) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;

    if (calendarView === 'daily') {
      return apt.appointment_date === selectedDate;
    } else if (calendarView === 'weekly') {
      const selected = new Date(selectedDate);
      const startOfWeek = new Date(selected);
      startOfWeek.setDate(selected.getDate() - selected.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const target = new Date(apt.appointment_date);
      return target >= startOfWeek && target <= endOfWeek;
    } else {
      // Monthly view
      return apt.appointment_date.slice(0, 7) === selectedDate.slice(0, 7);
    }
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'No Show':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <span>Appointment Scheduling Calendar</span>
          </h2>
          <p className="text-xs text-slate-400">Book, reschedule & track clinic visits in daily, weekly, or monthly view</p>
        </div>

        <button
          onClick={openBookingModal}
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Calendar Controls & Filters Bar */}
      <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* View Switcher (Daily, Weekly, Monthly) */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 self-start">
            {(['daily', 'weekly', 'monthly'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  calendarView === view
                    ? 'gradient-bg text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {view} View
              </button>
            ))}
          </div>

          {/* Date Picker & Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => changeDateByDays(1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-xs text-sky-400 hover:bg-slate-700 font-semibold"
            >
              Today
            </button>
          </div>

          {/* Doctor & Status Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={filterDoctorId}
                onChange={(e) => setFilterDoctorId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Cards List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Appointments for {calendarView === 'daily' ? selectedDate : calendarView === 'weekly' ? 'Selected Week' : 'Selected Month'}:
          </span>
          <span className="font-semibold text-white">{filteredAppointments.length} Appointments Found</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-slate-300 font-semibold text-sm">No Appointments Scheduled</h4>
            <p className="text-xs text-slate-500">There are no clinic visits recorded for this view selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => {
              const pat = patients.find((p) => p.id === apt.patient_id);
              const doc = doctors.find((d) => d.id === apt.doctor_id);

              return (
                <div
                  key={apt.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Time & Status header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-sky-400 font-bold text-xs bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{apt.appointment_time}</span>
                        <span className="text-slate-500 ml-1">({apt.appointment_date})</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>

                    {/* Patient info */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-sky-400" />
                        <span className="font-bold text-white text-sm">{pat?.name || 'Patient'}</span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                          {pat?.patient_code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center space-x-2 pl-6">
                        <span>Phone: {pat?.phone}</span>
                      </div>
                    </div>

                    {/* Doctor info */}
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Stethoscope className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium">{doc?.name || 'Assigned Doctor'}</span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 bg-slate-800/40 p-2 rounded-lg italic">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>

                  {/* Quick Action Status Change Buttons (PRD Module 5) */}
                  <div className="pt-2 border-t border-slate-800 flex items-center space-x-1 text-[10px]">
                    <span className="text-slate-500 font-medium mr-1">Status:</span>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                      className="flex-1 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-center"
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                      className="flex-1 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium text-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'No Show')}
                      className="flex-1 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium text-center"
                    >
                      No Show
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Appointment</h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patient_code}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Doctor *</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Time *</label>
                  <input
                    type="time"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Appointment Purpose & Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Consult for dental braces, crown fitment..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
