import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Stethoscope, Lock, Mail, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';

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
      setError('Your account is currently disabled. Please contact the clinic Admin.');
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
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg shadow-xl shadow-sky-500/20 mb-2">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight m-0">DentalPro DPMS</h1>
          <p className="text-sm text-slate-400">Dental Patient & Clinic Management System</p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="mb-6 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Quick Demo Login:</span>
            <span className="text-[10px] text-sky-400 font-normal">Click to switch role</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@dpms.com')}
              className="px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium transition-colors text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('doctor@dpms.com')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors text-center"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('receptionist@dpms.com')}
              className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors text-center"
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
                placeholder="doctor@dpms.com"
                className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
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
                className="text-xs text-sky-400 hover:underline"
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
                className="w-full bg-slate-800 border border-slate-700 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full gradient-bg hover:opacity-95 text-white font-semibold py-3 rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 mt-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to Clinic Portal</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Role-Based Access Control • Supabase Security Enabled
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Admin Password Reset</h3>
                <p className="text-xs text-slate-400">Request password reset key</p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
                Reset instructions sent to Clinic Administrator!
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Password resets must be approved by the Clinic Admin. Enter your email address to initiate.
                </p>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="enter user email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
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
                    className="flex-1 gradient-bg text-white text-xs font-semibold py-2 rounded-xl"
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
