import React from 'react';
import { useData } from '../../context/DataContext';
import { Role } from '../../types';
import { Stethoscope, UserCheck, LogOut, Shield, ChevronDown } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      {/* Brand logo & tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-white tracking-tight">DentalPro</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
              DPMS v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Dental Patient & Treatment Management</p>
        </div>
      </div>

      {/* Right controls: Role switcher & profile info */}
      <div className="flex items-center space-x-4">
        {/* Quick Role Preview Switcher for testing */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <UserCheck className="w-4 h-4 text-sky-400" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active User:</span>
          <div className="relative">
            <select
              value={currentUser.id}
              onChange={handleRoleSwitch}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-6 appearance-none"
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
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-white">{currentUser.name}</div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-slate-400" />
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Secure Logout"
          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-colors flex items-center space-x-1 text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
