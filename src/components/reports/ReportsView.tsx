import React from 'react';
import { useData } from '../../context/DataContext';
import {
  FileBarChart,
  Download,
  Users,
  Calendar,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { appointments, getMetrics, exportDataToCSV } = useData();
  const metrics = getMetrics();

  const completedApts = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledApts = appointments.filter((a) => a.status === 'Cancelled').length;
  const noShowApts = appointments.filter((a) => a.status === 'No Show').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileBarChart className="w-5 h-5 text-sky-400" />
            <span>Clinic Operational Reports & Data Export</span>
          </h2>
          <p className="text-xs text-slate-400">Generate analytics for patients, appointment breakdown & revenue collection</p>
        </div>

        {/* Quick Export All buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportDataToCSV('patients')}
            className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export Patients (CSV)</span>
          </button>
          <button
            onClick={() => exportDataToCSV('appointments')}
            className="bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Appointments (CSV)</span>
          </button>
          <button
            onClick={() => exportDataToCSV('revenue')}
            className="gradient-bg text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Revenue Report (Excel / CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 10: Patient Reports */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Patient Demographics</h3>
              <p className="text-xs text-slate-400">Total & New registrations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Total Registered Patients</span>
              <span className="font-bold text-white text-sm">{metrics.totalPatients}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">New Patients (This Month)</span>
              <span className="font-bold text-emerald-400 text-sm">{metrics.newPatientsThisMonth}</span>
            </div>

            <button
              onClick={() => exportDataToCSV('patients')}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Patient Master Report</span>
            </button>
          </div>
        </div>

        {/* Module 10: Appointment Reports */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Appointment Statistics</h3>
              <p className="text-xs text-slate-400">Daily & Monthly visit breakdown</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Completed Visits</span>
              <span className="font-bold text-emerald-400 text-sm">{completedApts}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Cancelled Appointments</span>
              <span className="font-bold text-red-400 text-sm">{cancelledApts}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">No Shows</span>
              <span className="font-bold text-amber-400 text-sm">{noShowApts}</span>
            </div>

            <button
              onClick={() => exportDataToCSV('appointments')}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Appointment Logs</span>
            </button>
          </div>
        </div>

        {/* Module 10: Revenue Reports */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Revenue & Financials</h3>
              <p className="text-xs text-slate-400">Collected vs Pending Revenue</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Total Collected Revenue</span>
              <span className="font-bold text-emerald-400 text-sm">₹{metrics.totalRevenue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-medium">Pending Due Revenue</span>
              <span className="font-bold text-amber-400 text-sm">₹{metrics.pendingPayments.toLocaleString()}</span>
            </div>

            <button
              onClick={() => exportDataToCSV('revenue')}
              className="w-full mt-2 py-2.5 rounded-xl gradient-bg text-white font-semibold text-xs shadow transition-colors flex items-center justify-center space-x-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Revenue Report (CSV/Excel)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
