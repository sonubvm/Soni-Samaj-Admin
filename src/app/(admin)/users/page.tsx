'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, UserX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearUserError,
  createUser,
  deactivateUser,
  fetchUsers,
  updateUser,
} from '@/store/slices/userSlice';
import { canManageUsers } from '@/lib/permissions';
import {
  ASSIGNABLE_ROLES,
  Permission,
  ROLE_LABELS,
  UserRole,
} from '@/types';
import PasswordInput from '@/components/PasswordInput';
import ConfirmModal from '@/components/ConfirmModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';

const OPTIONAL_PERMISSIONS: Permission[] = ['families:delete', 'families:edit'];

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { list, loading, error } = useAppSelector((state) => state.users);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'assistant' as Exclude<UserRole, 'superadmin'>,
    permissions: [] as Permission[],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const confirmModal = useConfirmModal();

  useEffect(() => {
    if (!canManageUsers(user)) {
      router.replace('/dashboard');
      return;
    }
    dispatch(fetchUsers());
  }, [dispatch, user, router]);

  const togglePermission = (perm: Permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);
    const result = await dispatch(createUser(form));
    setSaving(false);
    if (createUser.rejected.match(result)) {
      setFormError(result.payload as string);
      return;
    }
    setShowForm(false);
    setForm({ name: '', email: '', password: '', role: 'assistant', permissions: [] });
    setFormSuccess('User created. They can log in to the admin panel with this email and password.');
  };

  const handleDeactivateClick = (id: string, name: string) => {
    confirmModal.requestConfirm({
      title: 'Deactivate User',
      message: 'Are you sure you want to deactivate',
      itemName: name,
      confirmLabel: 'Deactivate',
      variant: 'warning',
      hint: 'They will not be able to login until reactivated by an admin.',
      onConfirm: async () => {
        await dispatch(deactivateUser(id));
      },
    });
  };

  const handleToggleDeletePerm = async (id: string, customPermissions: Permission[] = []) => {
    const hasDelete = customPermissions.includes('families:delete');
    const permissions: Permission[] = hasDelete
      ? customPermissions.filter((p) => p !== 'families:delete')
      : [...customPermissions, 'families:delete'];
    await dispatch(updateUser({ id, data: { permissions } }));
  };

  if (!canManageUsers(user)) {
    return <p className="text-gray-500">Access denied.</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button type="button" className="btn-primary flex items-center gap-2" onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {formSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm flex justify-between">
          <span>{formSuccess}</span>
          <button type="button" onClick={() => setFormSuccess(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {(error || formError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex justify-between">
          <span>{error || formError}</span>
          <button type="button" onClick={() => { dispatch(clearUserError()); setFormError(null); }} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Create User</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
            <PasswordInput
              label="Password"
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              placeholder="Min 6 characters"
              required
              autoComplete="new-password"
              showIcon={false}
            />
            <div>
              <label className="label">Role</label>
              <select
                className="input"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Exclude<UserRole, 'superadmin'> }))}
              >
                {ASSIGNABLE_ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="label mb-2">Extra permissions (optional)</p>
            <div className="flex flex-wrap gap-3">
              {OPTIONAL_PERMISSIONS.map((perm) => (
                <label key={perm} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden p-0">
        {loading ? (
          <p className="p-6 text-gray-500">Loading users...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-saffron-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Permissions</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{ROLE_LABELS[u.role]}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{u.permissions.join(', ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.isActive !== false ? 'badge bg-green-100 text-green-700' : 'badge bg-gray-100 text-gray-600'}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {u.role === 'manager' && u.isActive !== false && (
                          <button
                            type="button"
                            className="text-xs btn-secondary py-1 px-2"
                            onClick={() => handleToggleDeletePerm(u.id, u.customPermissions || [])}
                          >
                            {(u.customPermissions || []).includes('families:delete') ? 'Revoke delete' : 'Grant delete'}
                          </button>
                        )}
                        {u.role !== 'superadmin' && u.isActive !== false && u.id !== user?.id && (
                          <button
                            type="button"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Deactivate user"
                            onClick={() => handleDeactivateClick(u.id, u.name)}
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmModal.open}
        onClose={confirmModal.close}
        onConfirm={confirmModal.confirm}
        title={confirmModal.title}
        message={confirmModal.message}
        itemName={confirmModal.itemName}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        variant={confirmModal.variant}
        hint={confirmModal.hint}
        loading={confirmModal.loading}
      />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
