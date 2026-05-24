'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Eye, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteFamily, fetchFamilies, fetchFilterOptions } from '@/store/slices/familySlice';
import { FamilyFilters } from '@/types';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { canDeleteFamilies } from '@/lib/permissions';

export default function FamiliesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { list, pagination, loading, filterOptions } = useAppSelector((state) => state.families);
  const { token, user } = useAppSelector((state) => state.auth);

  const [filters, setFilters] = useState<FamilyFilters>({ page: 1, limit: 20 });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteModal = useDeleteModal();
  const canDelete = canDeleteFamilies(user);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    dispatch(fetchFilterOptions());
  }, [dispatch, token, router]);

  useEffect(() => {
    if (token) dispatch(fetchFamilies(filters));
  }, [dispatch, filters, token]);

  const updateFilter = (key: keyof FamilyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (!canDelete) {
      setDeleteError('You do not have permission to delete families.');
      return;
    }
    setDeleteError(null);
    deleteModal.requestDelete({
      title: 'Delete Family',
      message: 'Are you sure you want to delete the family',
      itemName: name,
      onConfirm: async () => {
        const result = await dispatch(deleteFamily(id));
        if (deleteFamily.rejected.match(result)) {
          setDeleteError((result.payload as string) || 'Failed to delete family.');
          throw new Error('delete failed');
        }
        dispatch(fetchFamilies(filters));
      },
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Families</h1>

      {deleteError && (
        <ErrorBanner message={deleteError} onDismiss={() => setDeleteError(null)} />
      )}

      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Filters</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterInput label="Search" value={filters.search || ''} onChange={(v) => updateFilter('search', v)} placeholder="Name or mobile" />
          <FilterSelect label="District" value={filters.district || ''} onChange={(v) => updateFilter('district', v)} options={filterOptions?.districts || []} />
          <FilterSelect label="City" value={filters.city || ''} onChange={(v) => updateFilter('city', v)} options={filterOptions?.cities || []} />
          <FilterSelect label="State" value={filters.state || ''} onChange={(v) => updateFilter('state', v)} options={filterOptions?.states || []} />
          <FilterSelect label="Father Occupation" value={filters.fatherOccupation || ''} onChange={(v) => updateFilter('fatherOccupation', v)} options={filterOptions?.fatherOccupations || []} />
          <FilterSelect label="Mother Occupation" value={filters.motherOccupation || ''} onChange={(v) => updateFilter('motherOccupation', v)} options={filterOptions?.motherOccupations || []} />
          <FilterSelect label="School Medium" value={filters.schoolMedium || ''} onChange={(v) => updateFilter('schoolMedium', v)} options={filterOptions?.schoolMediums || []} />
          <FilterSelect label="Child Std" value={filters.childStd || ''} onChange={(v) => updateFilter('childStd', v)} options={filterOptions?.childStandards || []} />
          <FilterSelect label="Student Type" value={filters.studentType || ''} onChange={(v) => updateFilter('studentType', v)} options={['School', 'College']} />
          <FilterInput label="Min Income" type="number" value={filters.minIncome || ''} onChange={(v) => updateFilter('minIncome', v)} />
          <FilterInput label="Max Income" type="number" value={filters.maxIncome || ''} onChange={(v) => updateFilter('maxIncome', v)} />
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <p className="p-6 text-gray-500">Loading families...</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-gray-500">No families found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-saffron-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Head Name</th>
                  <th className="px-4 py-3 font-medium">Mobile</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">District</th>
                  <th className="px-4 py-3 font-medium">Income</th>
                  <th className="px-4 py-3 font-medium">Children</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((family) => (
                  <tr key={family._id} className="border-t border-gray-100 table-row-hover">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{family.headOfFamily.name}</p>
                      <p className="text-xs text-gray-400">{new Date(family.createdAt).toLocaleDateString('en-IN')}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">{family.headOfFamily.mobile}</td>
                    <td className="px-4 py-3">{family.address.city}</td>
                    <td className="px-4 py-3">{family.address.district}</td>
                    <td className="px-4 py-3 font-medium">₹{family.totalFamilyIncome?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-saffron-100 text-saffron-700">{family.children?.length || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/families/${family._id}`} className="p-1.5 text-saffron-600 hover:bg-saffron-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(family._id, family.headOfFamily.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary text-sm py-1.5"
                disabled={pagination.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn-secondary text-sm py-1.5"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={deleteModal.open}
        onClose={deleteModal.close}
        onConfirm={deleteModal.confirm}
        title={deleteModal.title}
        message={deleteModal.message}
        itemName={deleteModal.itemName}
        loading={deleteModal.loading}
      />
    </>
  );
}

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex justify-between items-center">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} className="underline ml-4 shrink-0">
        Dismiss
      </button>
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label text-xs">{label}</label>
      <div className="relative">
        {label === 'Search' && <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />}
        <input
          type={type}
          className={`input text-sm py-2 ${label === 'Search' ? 'pl-9' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="label text-xs">{label}</label>
      <select className="input text-sm py-2" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
