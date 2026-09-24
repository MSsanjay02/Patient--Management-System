import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, Role } from '../../types';
import { UserPlus, UserCheck, Shield, CheckCircle, Ban, Edit, Search } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Doctor');
  const [password, setPassword] = useState('');

  const openCreateModal = () => {
    setName('');
    setEmail('');
    setRole('Doctor');
    setPassword('');
    setEditingUser(null);
    setShowAddModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword('');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        email,
        role,
      });
    } else {
      addUser({
        name,
        email,
        role,
        status: 'Active',
      });
    }

    setShowAddModal(false);
  };

  const toggleUserStatus = (user: User) => {
    const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    updateUser(user.id, { status: newStatus });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-sky-400" />
            <span>User Management</span>
          </h2>
          <p className="text-xs text-slate-400">Manage clinic staff logins, roles & security status</p>
        </div>

        <button
          onClick={openCreateModal}
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search user by name, email or role..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <span className="text-xs text-slate-400 px-3 hidden sm:inline">
          Showing {filteredUsers.length} of {users.length} Users
        </span>
      </div>

      {/* User Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
                        u.role === 'Admin'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : u.role === 'Doctor'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        u.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {u.status === 'Active' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-3" />
                          <span>Disabled</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{u.created_at.slice(0, 10)}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-medium transition-colors inline-flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors inline-flex items-center space-x-1 ${
                        u.status === 'Active'
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {u.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingUser ? 'Edit User Credentials' : 'Create New User Account'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Samuel Green"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel.green@dpms.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Doctor">Doctor (Clinical & Treatments)</option>
                  <option value="Receptionist">Receptionist (Appointments & Invoicing)</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Default Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-bg text-white py-2.5 rounded-xl font-semibold shadow-md"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
