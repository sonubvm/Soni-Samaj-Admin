'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMe, logout, setInitialized } from '@/store/slices/authSlice';
import { canAccessAdminPanel } from '@/lib/permissions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, initialized, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !initialized) {
      dispatch(fetchMe());
    } else if (!token) {
      dispatch(setInitialized());
    }
  }, [dispatch, token, initialized]);

  useEffect(() => {
    if (initialized && !token) {
      router.replace('/login');
    }
  }, [token, initialized, router]);

  useEffect(() => {
    if (initialized && user && !canAccessAdminPanel(user)) {
      dispatch(logout());
      router.replace('/login');
    }
  }, [initialized, user, dispatch, router]);

  if (!initialized || !token) {
    return (
      <p className="min-h-screen flex items-center justify-center text-saffron-600">
        Loading...
      </p>
    );
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
