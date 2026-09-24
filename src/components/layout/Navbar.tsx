import React from 'react';
import { useData } from '../../context/DataContext';
import type { Role } from '../../types';
import { Stethoscope, UserCheck, LogOut, Shield, ChevronDown, Activity, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { currentUser, setCurrentUser, users } = useData();

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    const targetUser = users.find((u) => u.id === selectedUserId);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const getRoleBadgeStyle = (role: Role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Doctor':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Receptionist':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-md">
      {/* Hospital Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">NM DENTAL CLINIC</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Reg: NM-DENT-2026/KA
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>Speciality Dental & Implant Center</span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="hidden lg:flex items-center space-x-1 text-emerald-400">
              <Activity className="w-3 h-3" />
              <span>3 Chairs Operating</span>
            </span>
            <span className="hidden xl:inline text-slate-600">•</span>
            <span className="hidden xl:flex items-center space-x-1 text-slate-400">
              <PhoneCall className="w-3 h-3 text-slate-500" />
              <span>Helpline: +91 80 4567 8900</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Staff Switcher & User Badge */}
      <div className="flex items-center space-x-4">
        {/* Role Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <UserCheck className="w-4 h-4 text-sky-400" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Portal User:</span>
          <div className="relative">
            <select
              value={currentUser.id}
              onChange={handleRoleSwitch}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-6 appearance-none"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Current User Card */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-white">{currentUser.name}</div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-slate-500" />
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${getRoleBadgeStyle(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Secure Staff Logout"
          className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-colors flex items-center space-x-1 text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
