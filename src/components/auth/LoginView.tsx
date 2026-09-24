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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft light glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30 mb-2">
            <Stethoscope className="w-9 h-9" />
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <Building2 className="w-5 h-5 text-sky-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight m-0">NM CLINIC</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            NM Dental Speciality Hospital & Laser Implant Center
          </p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>NM Clinic Demo Sign In:</span>
            </span>
            <span className="text-[10px] text-sky-600 font-semibold">Click role to test</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@dpms.com')}
              className="px-2 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-colors text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('doctor@dpms.com')}
              className="px-2 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-colors text-center"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('receptionist@dpms.com')}
              className="px-2 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition-colors text-center"
            >
              Receptionist
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@nmclinic.com"
                className="w-full bg-slate-50 border border-slate-300 focus:border-sky-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-xs text-sky-600 hover:underline font-semibold"
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
                className="w-full bg-slate-50 border border-slate-300 focus:border-sky-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-2 mt-6"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to NM Clinic Portal</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
          NM Clinic Security & Role-Based Access Control Active
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">NM Clinic Password Reset</h3>
                <p className="text-xs text-slate-500">Request key from clinic administrator</p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
                Instructions sent to NM Clinic Admin!
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <p className="text-xs text-slate-600">
                  Password resets must be approved by NM Clinic Admin. Enter your registered email.
                </p>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="enter user email"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
                  required
                />
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 text-white text-xs font-bold py-2 rounded-xl"
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
