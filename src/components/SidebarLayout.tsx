
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Shield, UserCog, ClipboardList, Menu, X } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50/80">

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-saffron-600 to-saffron-700 text-white shadow-md z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold">Soni Samaj</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-saffron-600 via-saffron-600 to-saffron-700 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out',
          'md:relative md:translate-x-0', // Static and always visible on desktop
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full' // Slide toggle on mobile
        )}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Soni Samaj</h1>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          </div>

          {/* Mobile close button inside the sidebar */}
          <button onClick={closeSidebar} className="md:hidden p-1 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition',
                pathname.startsWith(href)
                  ? 'bg-white text-saffron-700 shadow-md'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
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
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
