'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Shield, UserCog, ClipboardList } from 'lucide-react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { canManageUsers, isAdmin } from '@/lib/permissions';
import { ROLE_LABELS, UserRole } from '@/types';

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/families', label: 'Families', icon: Users },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [...baseNavItems];
  if (canManageUsers(user)) {
    navItems.push({ href: '/users', label: 'Users', icon: UserCog });
  }
  if (isAdmin(user)) {
    navItems.push({ href: '/audit', label: 'Deletion Audit', icon: ClipboardList });
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50/80">
      <aside className="w-64 bg-gradient-to-b from-saffron-600 via-saffron-600 to-saffron-700 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Soni Samaj</h1>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition',
                pathname.startsWith(href)
                  ? 'bg-white text-saffron-700 shadow-md'
                  : 'text-white/85 hover:bg-white/10'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="px-2 mb-3">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
            {user?.role && (
              <p className="text-xs text-white/50 mt-0.5">{ROLE_LABELS[user.role as UserRole]}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/85 hover:bg-white/10 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
