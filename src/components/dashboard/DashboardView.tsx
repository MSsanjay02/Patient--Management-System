import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  UserPlus,
  Calendar,
  Activity,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { getMetrics, patients, appointments, payments, treatmentPlans, doctors } = useData();
  const metrics = getMetrics();

  const recentAppointments = appointments.slice(0, 4);
  const recentPayments = payments.slice(0, 4);
  const recentTreatments = treatmentPlans.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner & Welcome */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-teal-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dental Patient Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight m-0">
              Clinic Overview Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track patient registrations, daily appointment queues, ongoing long-term treatments, and real-time revenue collection.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('patients')}
              className="gradient-bg text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
            <button
              onClick={() => onNavigate('appointments')}
              className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('billing')}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>New Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module 9 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.totalPatients}</div>
            <div className="text-[11px] text-sky-400 font-medium flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Registered in Clinic</span>
            </div>
          </div>
        </div>

        {/* New Patients This Month */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">New (This Month)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.newPatientsThisMonth}</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>New registrations</span>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.todaysAppointments}</div>
            <div className="text-[11px] text-purple-400 font-medium flex items-center space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Scheduled today</span>
            </div>
          </div>
        </div>

        {/* Active Treatment Plans */}
        <div
          onClick={() => onNavigate('treatments')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Plans</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.activeTreatmentPlans}</div>
            <div className="text-[11px] text-cyan-400 font-medium flex items-center space-x-1 mt-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>Braces, RCT & Implants</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">
              ₹{metrics.pendingPayments.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-400 font-medium flex items-center space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Outstanding balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 9 Recent Activity Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream 1: Latest Appointments */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Latest Appointments</span>
            </h3>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-sky-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAppointments.map((apt) => {
              const pat = patients.find((p) => p.id === apt.patient_id);
              const doc = doctors.find((d) => d.id === apt.doctor_id);

              return (
                <div key={apt.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{pat?.name || 'Patient'}</span>
                    <span className="text-sky-400 font-bold">{apt.appointment_time}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>{doc?.name}</span>
                    <span className="text-slate-500">{apt.appointment_date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stream 2: Latest Treatments */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Active Treatment Procedures</span>
            </h3>
            <button
              onClick={() => onNavigate('treatments')}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTreatments.map((tp) => {
              const pat = patients.find((p) => p.id === tp.patient_id);
              return (
                <div key={tp.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{tp.treatment_name}</span>
                    <span className="text-emerald-400 font-bold">₹{tp.estimated_cost.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Patient: {pat?.name}</span>
                    <span className="text-emerald-400 font-medium">{tp.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stream 3: Latest Payments */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Recent Payments Received</span>
            </h3>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentPayments.map((p) => {
              const pat = patients.find((pt) => pt.id === p.patient_id);
              return (
                <div key={p.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{pat?.name || 'Patient'}</span>
                    <span className="text-emerald-400 font-bold">+₹{p.amount_paid.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Via {p.payment_method}</span>
                    <span className="text-slate-500">{p.payment_date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
