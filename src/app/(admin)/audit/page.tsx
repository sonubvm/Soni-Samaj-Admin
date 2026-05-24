'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeletedFamilies } from '@/store/slices/userSlice';
import { isAdmin } from '@/lib/permissions';
import { ROLE_LABELS, UserRole } from '@/types';

export default function AuditPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { deletedFamilies, deletedPagination } = useAppSelector((state) => state.users);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAdmin(user)) {
      router.replace('/dashboard');
      return;
    }
    dispatch(fetchDeletedFamilies(page));
  }, [dispatch, user, router, page]);

  if (!isAdmin(user)) {
    return <p className="text-gray-500">Access denied.</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Deletion Audit</h1>
      <p className="text-sm text-gray-500 mb-6">Families soft-deleted by admin users — who deleted what and when.</p>

      <div className="card overflow-hidden p-0">
        {deletedFamilies.length === 0 ? (
          <p className="p-6 text-gray-500">No deleted families recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-saffron-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Family</th>
                  <th className="px-4 py-3 font-medium">Mobile</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Deleted By</th>
                  <th className="px-4 py-3 font-medium">Deleted At</th>
                </tr>
              </thead>
              <tbody>
                {deletedFamilies.map((entry) => (
                  <tr key={entry._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{entry.headOfFamily.name}</td>
                    <td className="px-4 py-3 font-mono">{entry.headOfFamily.mobile}</td>
                    <td className="px-4 py-3">{entry.address.city}, {entry.address.district}</td>
                    <td className="px-4 py-3">
                      {entry.deletedBy ? (
                        <>
                          <p className="font-medium">{entry.deletedBy.name}</p>
                          <p className="text-xs text-gray-500">
                            {entry.deletedBy.email} · {ROLE_LABELS[entry.deletedBy.role as UserRole] || entry.deletedBy.role}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {entry.deletedAt ? new Date(entry.deletedAt).toLocaleString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deletedPagination && deletedPagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {deletedPagination.page} of {deletedPagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary text-sm py-1.5" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <button
                type="button"
                className="btn-secondary text-sm py-1.5"
                disabled={page >= deletedPagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
