import React from 'react';
import { useData } from '../../context/DataContext';
import type { Role } from '../../types';
import { Stethoscope, UserCheck, LogOut, Shield, ChevronDown, Sparkles } from 'lucide-react';

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

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Doctor':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Receptionist':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 flex items-center justify-between">
      {/* NM Clinic Brand Logo & Title */}
      <div className="flex items-center space-x-3.5">
        <div className="w-11 h-11 rounded-2xl nm-gradient-bg flex items-center justify-center shadow-lg shadow-cyan-500/25 nm-badge-glow">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl text-white tracking-tight flex items-center space-x-1.5">
              <span>NM CLINIC</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Dental Hospital
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">NM Dental Speciality Clinic & Implant Center</p>
        </div>
      </div>

      {/* Right controls: Role switcher & profile info */}
      <div className="flex items-center space-x-4">
        {/* Quick Role Switcher for preview */}
        <div className="flex items-center space-x-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-700/70">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Staff:</span>
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

        {/* Current User Badge */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 shadow">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-white">{currentUser.name}</div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-slate-400" />
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Secure Logout"
          className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-colors flex items-center space-x-1 text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
