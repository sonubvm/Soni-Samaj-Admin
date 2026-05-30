'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCurrentFamily, fetchFamilyById } from '@/store/slices/familySlice';
import ClickablePhoto from '@/components/ClickablePhoto';

export default function FamilyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { current } = useAppSelector((state) => state.families);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    if (id) dispatch(fetchFamilyById(id));
    return () => {
      dispatch(clearCurrentFamily());
    };
  }, [dispatch, id, token, router]);

  if (!current) {
    return <p className="text-gray-500">Loading family details...</p>;
  }

  return (
    <>
      <Link href="/families" className="inline-flex items-center gap-2 text-saffron-700 text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Families
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 break-words">
        {current.headOfFamily.name}&apos;s Family
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DetailCard title="Head of Family">
          <MemberPhoto photo={current.headOfFamily.photo} name={current.headOfFamily.name} />
          <DetailRow label="Name" value={current.headOfFamily.name} />
          <DetailRow label="Mobile" value={current.headOfFamily.mobile || 'N/A'} />
          <DetailRow label="Email" value={current.headOfFamily.email || 'N/A'} />
          <DetailRow label="Marital Status" value={current.headOfFamily.maritalStatus || 'Not recorded'} />
        </DetailCard>

        <DetailCard title="Address">
          <DetailRow
            label="Full Address"
            value={[current.address.houseNo, current.address.street, current.address.village].filter(Boolean).join(', ')}
          />
          <DetailRow label="City" value={current.address.city} />
          <DetailRow label="District" value={current.address.district} />
          <DetailRow label="State" value={current.address.state} />
          <DetailRow label="Pincode" value={current.address.pincode || 'N/A'} />
        </DetailCard>

        <DetailCard title="Father">
          <MemberPhoto photo={current.parents.father.photo} name={current.parents.father.name} />
          <DetailRow label="Name" value={current.parents.father.name} />
          <DetailRow label="Occupation" value={current.parents.father.occupation || 'N/A'} />
          <DetailRow label="Income" value={`₹${current.parents.father.income || 0}/mo`} />
          <DetailRow label="Education" value={current.parents.father.education || 'N/A'} />
          <DetailRow label="Mobile" value={current.parents.father.mobile || 'N/A'} />
        </DetailCard>

        <DetailCard title="Mother">
          <MemberPhoto photo={current.parents.mother.photo} name={current.parents.mother.name} />
          <DetailRow label="Name" value={current.parents.mother.name} />
          <DetailRow label="Occupation" value={current.parents.mother.occupation || 'N/A'} />
          <DetailRow label="Income" value={`₹${current.parents.mother.income || 0}/mo`} />
          <DetailRow label="Education" value={current.parents.mother.education || 'N/A'} />
          <DetailRow label="Mobile" value={current.parents.mother.mobile || 'N/A'} />
        </DetailCard>

        {(current.spouse?.name || current.spouse?.mobile || current.spouse?.photo) && (
          <DetailCard title={current.headOfFamily.maritalStatus === 'Widowed' ? 'Spouse (Deceased)' : 'Spouse'}>
            <MemberPhoto photo={current.spouse?.photo} name={current.spouse?.name || 'Spouse'} />
            <DetailRow label="Name" value={current.spouse?.name || 'N/A'} />
            <DetailRow label="Mobile" value={current.spouse?.mobile || 'N/A'} />
          </DetailCard>
        )}

        {current.headOfFamily.maritalStatus === 'Married' &&
          !current.spouse?.name &&
          !current.spouse?.mobile &&
          !current.spouse?.photo && (
            <DetailCard title="Spouse">
              <p className="text-sm text-gray-500">No spouse details recorded.</p>
            </DetailCard>
          )}

        <DetailCard title="Income">
          <DetailRow label="Total Family Income" value={`₹${current.totalFamilyIncome?.toLocaleString()}/mo`} />
        </DetailCard>

        {current.coResidents?.length > 0 && (
          <DetailCard title="Co-Residents">
            {current.coResidents.map((r, i) => (
              <div key={r._id || i} className="pb-2 mb-2 border-b border-gray-100 last:border-0">
                <MemberPhoto photo={r.photo} name={r.name} size="sm" />
                <DetailRow label="Name" value={r.name} />
                <DetailRow label="Relation" value={r.relation || 'N/A'} />
                <DetailRow label="Age" value={String(r.age || 'N/A')} />
                <DetailRow label="Occupation" value={r.occupation || 'N/A'} />
              </div>
            ))}
          </DetailCard>
        )}

        {current.children?.length > 0 && (
          <DetailCard title="Children" className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {current.children.map((c, i) => (
                <div key={c._id || i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <MemberPhoto photo={c.photo} name={c.name} size="sm" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <span className={c.studentType === 'College' ? 'badge-college' : 'badge-school'}>
                      {c.studentType || 'School'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {c.school?.name || 'N/A'}
                    {c.studentType === 'College' && c.course ? ` · ${c.course}` : ''}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.studentType === 'College' ? 'Year' : 'Class'}: {c.currentStd || 'N/A'}
                    {c.school?.medium ? ` · ${c.school.medium}` : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    {c.percentage ? `${c.percentage}%` : ''}
                    {c.passOutYear ? ` · Pass ${c.passOutYear}` : ''}
                    {c.isStudying ? ' · Studying' : ' · Not studying'}
                  </p>
                </div>
              ))}
            </div>
          </DetailCard>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Registered: {new Date(current.createdAt).toLocaleString('en-IN')}
      </p>
    </>
  );
}

function MemberPhoto({
  photo,
  name,
  size = 'md',
}: {
  photo?: string;
  name: string;
  size?: 'sm' | 'md';
}) {
  if (!photo) return null;

  const dimensions = size === 'sm' ? 'w-16 h-16' : 'w-24 h-24';

  return (
    <div className="mb-3">
      <ClickablePhoto
        photo={photo}
        name={name}
        imageClassName={`${dimensions} rounded-xl object-cover border border-gray-200 shadow-sm`}
      />
    </div>
  );
}

function DetailCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${className}`}>
      <h2 className="text-lg font-semibold text-saffron-700 mb-4">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3 text-sm py-1">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium sm:text-right sm:max-w-[60%] break-words">{value}</span>
    </div>
  );
}
