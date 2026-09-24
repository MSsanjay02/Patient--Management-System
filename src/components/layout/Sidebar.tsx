import React from 'react';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Receipt,
  UserCog,
  FileBarChart,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  allowedRoles: Array<'Admin' | 'Doctor' | 'Receptionist'>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, patients, appointments, treatmentPlans, invoices } = useData();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ['Admin', 'Doctor', 'Receptionist'],
    },
    {
      id: 'patients',
      label: 'Patient Directory',
      icon: <Users className="w-4 h-4" />,
      allowedRoles: ['Admin', 'Doctor', 'Receptionist'],
      badge: patients.length,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar className="w-4 h-4" />,
      allowedRoles: ['Admin', 'Doctor', 'Receptionist'],
      badge: appointments.filter((a) => a.status === 'Scheduled').length,
    },
    {
      id: 'treatments',
      label: 'Treatment Plans',
      icon: <Activity className="w-4 h-4" />,
      allowedRoles: ['Admin', 'Doctor'],
      badge: treatmentPlans.filter((t) => t.status === 'Active').length,
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: <Receipt className="w-4 h-4" />,
      allowedRoles: ['Admin', 'Receptionist'],
      badge: invoices.filter((i) => i.status !== 'Paid').length,
    },
    {
      id: 'doctors',
      label: 'Doctors Directory',
      icon: <UserCheck className="w-4 h-4" />,
      allowedRoles: ['Admin'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <UserCog className="w-4 h-4" />,
      allowedRoles: ['Admin'],
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: <FileBarChart className="w-4 h-4" />,
      allowedRoles: ['Admin'],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5 text-sky-600" />
          <span>NM Clinic Navigation</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isAllowed = item.allowedRoles.includes(currentUser.role);
            if (!isAllowed) return null;

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-sky-700 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info card */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-800 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>NM Clinic Dental System</span>
        </div>
        <p className="text-[11px] text-slate-500">Cloud Storage & Backups Active</p>
      </div>
    </aside>
  );
};
