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
  Building2,
  Sparkles,
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
      {/* NM Clinic Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>NM Clinic Operational Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0 flex items-center space-x-2">
              <span>NM DENTAL CLINIC & HOSPITAL</span>
              <Sparkles className="w-5 h-5 text-cyan-400 hidden sm:inline" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Welcome to NM Clinic's central management system. Track patient registrations, daily appointment queues, orthodontics, RCTs, and real-time clinic revenue.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('patients')}
              className="nm-gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => onNavigate('appointments')}
              className="bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('billing')}
              className="bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>New Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{metrics.totalPatients}</div>
            <div className="text-[11px] text-cyan-400 font-semibold flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Registered at NM Clinic</span>
            </div>
          </div>
        </div>

        {/* New Patients This Month */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">New (This Month)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{metrics.newPatientsThisMonth}</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>New patient growth</span>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{metrics.todaysAppointments}</div>
            <div className="text-[11px] text-purple-400 font-semibold flex items-center space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Scheduled today</span>
            </div>
          </div>
        </div>

        {/* Active Treatment Plans */}
        <div
          onClick={() => onNavigate('treatments')}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Treatments</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{metrics.activeTreatmentPlans}</div>
            <div className="text-[11px] text-cyan-400 font-semibold flex items-center space-x-1 mt-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>Braces, RCT & Implants</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pending Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-400">
              ₹{metrics.pendingPayments.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Outstanding balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Appointments */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>NM Clinic Appointments</span>
            </h3>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
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
                <div key={apt.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{pat?.name || 'Patient'}</span>
                    <span className="text-cyan-400 font-bold">{apt.appointment_time}</span>
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

        {/* Active Treatments */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>NM Clinic Dental Procedures</span>
            </h3>
            <button
              onClick={() => onNavigate('treatments')}
              className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTreatments.map((tp) => {
              const pat = patients.find((p) => p.id === tp.patient_id);
              return (
                <div key={tp.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{tp.treatment_name}</span>
                    <span className="text-emerald-400 font-bold">₹{tp.estimated_cost.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Patient: {pat?.name}</span>
                    <span className="text-emerald-400 font-semibold">{tp.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Payments */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-purple-400" />
              <span>Payments Received</span>
            </h3>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs text-purple-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentPayments.map((p) => {
              const pat = patients.find((pt) => pt.id === p.patient_id);
              return (
                <div key={p.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
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
