import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Edit2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  X,
  Lock,
} from 'lucide-react';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Master Admin' | 'Secondary Admin';
  status: 'Active' | 'Suspended';
  createdAt: string;
  password?: string;
}

interface SettingsManageViewProps {
  admins: AdminUser[];
  onUpdateAdmins: (admins: AdminUser[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsManageView: React.FC<SettingsManageViewProps> = ({
  admins,
  onUpdateAdmins,
  showToast,
}) => {
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [passwordTargetAdmin, setPasswordTargetAdmin] = useState<AdminUser | null>(null);
  const [resetPasswordResult, setResetPasswordResult] = useState<{ username: string; pass: string } | null>(null);

  // Create form state
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Edit username form state
  const [editUsernameVal, setEditUsernameVal] = useState('');

  // Update password form state
  const [updatePasswordVal, setUpdatePasswordVal] = useState('');

  // Create secondary admin
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      showToast('Username and password are required', 'error');
      return;
    }

    if (admins.some((a) => a.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      showToast('An admin with this username already exists', 'error');
      return;
    }

    const newAdmin: AdminUser = {
      id: `ADM-00${admins.length + 1}`,
      username: newUsername.trim().toLowerCase(),
      name: newName.trim() || 'Secondary Admin',
      email: newEmail.trim() || `${newUsername.trim().toLowerCase()}@gaenr.com`,
      role: 'Secondary Admin',
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10),
      password: newPassword,
    };

    onUpdateAdmins([...admins, newAdmin]);
    showToast(`Secondary admin "${newAdmin.username}" created successfully`, 'success');

    // Reset
    setNewUsername('');
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setShowCreateModal(false);
  };

  // Edit secondary admin username
  const handleSaveEditedUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (!editUsernameVal.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }

    const updated = admins.map((a) =>
      a.id === editingAdmin.id ? { ...a, username: editUsernameVal.trim().toLowerCase() } : a
    );

    onUpdateAdmins(updated);
    showToast(`Admin username updated to "${editUsernameVal.trim().toLowerCase()}"`, 'success');
    setEditingAdmin(null);
  };

  // Update secondary admin password
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetAdmin) return;
    if (updatePasswordVal.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    const updated = admins.map((a) =>
      a.id === passwordTargetAdmin.id ? { ...a, password: updatePasswordVal } : a
    );

    onUpdateAdmins(updated);
    showToast(`Password updated successfully for "${passwordTargetAdmin.username}"`, 'success');
    setPasswordTargetAdmin(null);
    setUpdatePasswordVal('');
  };

  // Reset secondary admin password
  const handleResetPassword = (admin: AdminUser) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let tempPass = 'Gnr_';
    for (let i = 0; i < 8; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const updated = admins.map((a) => (a.id === admin.id ? { ...a, password: tempPass } : a));
    onUpdateAdmins(updated);

    setResetPasswordResult({ username: admin.username, pass: tempPass });
    showToast(`Password reset for ${admin.username}`, 'info');
  };

  // Remove secondary admin
  const handleRemoveAdmin = (admin: AdminUser) => {
    if (admin.role === 'Master Admin' || admin.username === 'operations') {
      showToast('Master Admin "operations" account cannot be removed!', 'error');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove secondary admin "${admin.username}"?`
    );
    if (!confirmed) return;

    onUpdateAdmins(admins.filter((a) => a.id !== admin.id));
    showToast(`Secondary admin "${admin.username}" removed`, 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage administrative privilege accounts, secondary admin roles, and credentials.
          </p>
        </div>
        {/* Create Secondary Admin Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Secondary Admin</span>
        </button>
      </div>

      {/* Reset Password Banner (if just generated) */}
      {resetPasswordResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in">
          <div className="text-xs">
            <span className="font-bold text-emerald-900 block">
              Password Reset Successfully for {resetPasswordResult.username}
            </span>
            <span className="text-emerald-700 font-mono text-[11px]">
              Temporary Password:{' '}
              <strong className="text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                {resetPasswordResult.pass}
              </strong>
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(resetPasswordResult.pass);
              showToast('Temporary password copied to clipboard', 'success');
              setResetPasswordResult(null);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy &amp; Dismiss</span>
          </button>
        </div>
      )}

      {/* View Admin List Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Admin ID &amp; Username</th>
                <th className="py-3.5 px-4">Display Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map((adm) => {
                const isMaster = adm.role === 'Master Admin' || adm.username === 'operations';

                return (
                  <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {adm.username}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{adm.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{adm.name}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {adm.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                          isMaster
                            ? 'bg-blue-50 text-[#006eff] border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {adm.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{adm.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {adm.createdAt}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {isMaster ? (
                        <span className="text-[10px] text-slate-400 font-mono italic">
                          Protected Master
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit secondary admin username */}
                          <button
                            onClick={() => {
                              setEditingAdmin(adm);
                              setEditUsernameVal(adm.username);
                            }}
                            title="Edit username"
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Update secondary admin password */}
                          <button
                            onClick={() => {
                              setPasswordTargetAdmin(adm);
                              setUpdatePasswordVal('');
                            }}
                            title="Update password"
                            className="p-1.5 text-slate-400 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset secondary admin password */}
                          <button
                            onClick={() => handleResetPassword(adm)}
                            title="Reset password"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Remove secondary admin */}
                          <button
                            onClick={() => handleRemoveAdmin(adm)}
                            title="Remove secondary admin"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Secondary Admin */}
      {showCreateModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Secondary Admin</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. farhan.ops"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Farhan Ahmed"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="farhan@gaenr.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006eff] hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Secondary Admin Username */}
      {editingAdmin && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingAdmin(null);
          }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Admin Username</h3>
              <button
                onClick={() => setEditingAdmin(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedUsername} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Username</label>
                <input
                  type="text"
                  required
                  value={editUsernameVal}
                  onChange={(e) => setEditUsernameVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006eff] hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Update Username
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Secondary Admin Password */}
      {passwordTargetAdmin && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPasswordTargetAdmin(null);
          }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Update Password for {passwordTargetAdmin.username}
              </h3>
              <button
                onClick={() => setPasswordTargetAdmin(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={updatePasswordVal}
                  onChange={(e) => setUpdatePasswordVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordTargetAdmin(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006eff] hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
