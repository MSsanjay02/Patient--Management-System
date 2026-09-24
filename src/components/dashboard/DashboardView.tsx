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
      {/* NM Clinic Top Hero Banner - Light White Theme */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-sky-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>NM Clinic Operational Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0 flex items-center space-x-2">
              <span>NM DENTAL CLINIC & HOSPITAL</span>
              <Sparkles className="w-5 h-5 text-sky-600 hidden sm:inline" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
              Welcome to NM Clinic's central management system. Track patient registrations, daily appointment queues, orthodontics, RCTs, and real-time clinic revenue.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('patients')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => onNavigate('appointments')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => onNavigate('billing')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Receipt className="w-4 h-4 text-emerald-600" />
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
          className="bg-white border border-slate-200 hover:border-sky-400 rounded-2xl p-4 shadow-xs cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{metrics.totalPatients}</div>
            <div className="text-[11px] text-sky-700 font-semibold flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Registered at NM Clinic</span>
            </div>
          </div>
        </div>

        {/* New Patients This Month */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 shadow-xs cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">New (This Month)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{metrics.newPatientsThisMonth}</div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>New patient growth</span>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-4 shadow-xs cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{metrics.todaysAppointments}</div>
            <div className="text-[11px] text-purple-700 font-semibold flex items-center space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Scheduled today</span>
            </div>
          </div>
        </div>

        {/* Active Treatment Plans */}
        <div
          onClick={() => onNavigate('treatments')}
          className="bg-white border border-slate-200 hover:border-cyan-400 rounded-2xl p-4 shadow-xs cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active Treatments</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{metrics.activeTreatmentPlans}</div>
            <div className="text-[11px] text-cyan-700 font-semibold flex items-center space-x-1 mt-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>Braces, RCT & Implants</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-xs cursor-pointer transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Pending Due</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600">
              ₹{metrics.pendingPayments.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold flex items-center space-x-1 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Outstanding balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Appointments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>NM Clinic Appointments</span>
            </h3>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs text-sky-600 hover:underline flex items-center space-x-1 font-semibold"
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
                <div key={apt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{pat?.name || 'Patient'}</span>
                    <span className="text-sky-600 font-bold">{apt.appointment_time}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                    <span>{doc?.name}</span>
                    <span className="text-slate-400">{apt.appointment_date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Treatments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>NM Clinic Dental Procedures</span>
            </h3>
            <button
              onClick={() => onNavigate('treatments')}
              className="text-xs text-emerald-600 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTreatments.map((tp) => {
              const pat = patients.find((p) => p.id === tp.patient_id);
              return (
                <div key={tp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{tp.treatment_name}</span>
                    <span className="text-emerald-700 font-bold">₹{tp.estimated_cost.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                    <span>Patient: {pat?.name}</span>
                    <span className="text-emerald-600 font-semibold">{tp.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Payments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-purple-600" />
              <span>Payments Received</span>
            </h3>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs text-purple-600 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentPayments.map((p) => {
              const pat = patients.find((pt) => pt.id === p.patient_id);
              return (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{pat?.name || 'Patient'}</span>
                    <span className="text-emerald-700 font-bold">+₹{p.amount_paid.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                    <span>Via {p.payment_method}</span>
                    <span className="text-slate-400">{p.payment_date}</span>
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
