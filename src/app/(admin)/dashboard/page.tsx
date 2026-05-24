'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Baby,
  IndianRupee,
  MapPin,
  GraduationCap,
  School,
  TrendingUp,
  UserX,
  Wallet,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/store/slices/familySlice';

const formatInr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { stats } = useAppSelector((state) => state.families);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    dispatch(fetchStats());
  }, [dispatch, token, router]);

  const avgFamilyIncome = stats?.avgFamilyIncome ?? stats?.avgIncome ?? 0;
  const totalFamilyIncome = stats?.totalFamilyIncome ?? stats?.totalIncome ?? 0;

  const overviewCards = [
    {
      label: 'Total Families',
      value: stats?.totalFamilies ?? 0,
      icon: Users,
      gradient: 'from-saffron-500 to-orange-400',
    },
    {
      label: 'Total Children',
      value: stats?.totalChildren ?? 0,
      icon: Baby,
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      label: 'School Students',
      value: stats?.schoolStudents ?? 0,
      icon: School,
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      label: 'College Students',
      value: stats?.collegeStudents ?? 0,
      icon: GraduationCap,
      gradient: 'from-purple-500 to-violet-400',
    },
    {
      label: 'Not Studying',
      value: stats?.notStudyingChildren ?? 0,
      icon: UserX,
      gradient: 'from-slate-500 to-gray-400',
    },
  ];

  const familyIncomeCards = [
    {
      label: 'Avg Family Income',
      value: formatInr(avgFamilyIncome),
      icon: TrendingUp,
      gradient: 'from-green-500 to-lime-400',
    },
    {
      label: 'Total Family Income',
      value: formatInr(totalFamilyIncome),
      icon: IndianRupee,
      gradient: 'from-amber-500 to-gold-500',
    },
  ];

  const headIncomeCards = [
    {
      label: 'Avg Parents Income',
      value: formatInr(stats?.avgHeadIncome ?? 0),
      sub: 'Father + mother monthly',
      icon: Wallet,
      gradient: 'from-rose-500 to-pink-400',
    },
    {
      label: 'Total Parents Income',
      value: formatInr(stats?.totalHeadIncome ?? 0),
      sub: 'Sum across all families',
      icon: IndianRupee,
      gradient: 'from-indigo-500 to-blue-400',
    },
    {
      label: 'Parents Income Range',
      value: `${formatInr(stats?.minHeadIncome ?? 0)} – ${formatInr(stats?.maxHeadIncome ?? 0)}`,
      sub: 'Min to max per family',
      icon: TrendingUp,
      gradient: 'from-teal-500 to-emerald-400',
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of registered Soni Samaj families</p>
        </div>
        <Link href="/families" className="btn-primary text-sm">
          View All Families
        </Link>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Registration overview</h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {overviewCards.map(({ label, value, icon: Icon, gradient }) => (
          <StatCard key={label} label={label} value={value} icon={Icon} gradient={gradient} />
        ))}
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Family income</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {familyIncomeCards.map(({ label, value, icon: Icon, gradient }) => (
          <StatCard key={label} label={label} value={value} icon={Icon} gradient={gradient} />
        ))}
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Parents income (father + mother)
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {headIncomeCards.map(({ label, value, sub, icon: Icon, gradient }) => (
          <StatCard key={label} label={label} value={value} sub={sub} icon={Icon} gradient={gradient} />
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-saffron-500" />
          Top Districts
        </h2>
        {stats?.topDistricts?.length ? (
          <div className="space-y-3">
            {stats.topDistricts.map((d, i) => (
              <div key={d.district} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-saffron-100 text-saffron-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{d.district}</span>
                    <span className="text-saffron-600 font-semibold">{d.count} families</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-saffron-400 to-gold-400 rounded-full"
                      style={{
                        width: `${Math.min(100, (d.count / (stats.topDistricts[0]?.count || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No registration data yet. Stats will appear after families register.</p>
        )}
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <div className="stat-card">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`} />
      <div className="flex items-center gap-4 relative">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
