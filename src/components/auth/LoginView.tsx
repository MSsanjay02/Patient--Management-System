import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Stethoscope, Lock, Mail, AlertCircle, ShieldCheck, KeyRound, Sparkles, Building2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { users, setCurrentUser } = useData();
  const [email, setEmail] = useState('admin@dpms.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password fields.');
      return;
    }

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser) {
      setError('Invalid credentials. User with this email does not exist.');
      return;
    }

    if (matchedUser.status === 'Disabled') {
      setError('Your account is currently disabled. Please contact NM Clinic Admin.');
      return;
    }

    // Successful login
    setCurrentUser(matchedUser);
    onLoginSuccess();
  };

  const handleQuickLogin = (email: string) => {
    const matched = users.find((u) => u.email === email);
    if (matched) {
      setCurrentUser(matched);
      onLoginSuccess();
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setShowResetModal(false);
      setResetSent(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl nm-gradient-bg shadow-xl shadow-cyan-500/25 nm-badge-glow mb-2">
            <Stethoscope className="w-9 h-9 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-black text-white tracking-tight m-0">NM CLINIC</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            NM Dental Speciality Hospital & Laser Implant Center
          </p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="mb-6 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>NM Clinic Demo Sign In:</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-normal">Click role to test</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@dpms.com')}
              className="px-2 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-colors text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('doctor@dpms.com')}
              className="px-2 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors text-center"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('receptionist@dpms.com')}
              className="px-2 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors text-center"
            >
              Receptionist
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@nmclinic.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full nm-gradient-bg hover:opacity-95 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 mt-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to NM Clinic Portal</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          NM Clinic Security & Role-Based Access Control Active
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">NM Clinic Password Reset</h3>
                <p className="text-xs text-slate-400">Request key from clinic administrator</p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
                Instructions sent to NM Clinic Admin!
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Password resets must be approved by NM Clinic Admin. Enter your registered email.
                </p>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="enter user email"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 nm-gradient-bg text-white text-xs font-semibold py-2 rounded-xl"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
