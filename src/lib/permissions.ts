import { Permission, User, UserRole } from '@/types';

const ADMIN_ROLES: UserRole[] = ['admin', 'superadmin'];
const PANEL_ROLES: UserRole[] = ['superadmin', 'admin', 'manager', 'assistant'];

export function canAccessAdminPanel(user: User | null | undefined): boolean {
  if (!user || user.isActive === false) return false;
  return PANEL_ROLES.includes(user.role);
}

export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  return user.permissions?.includes(permission) ?? false;
}

export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return ADMIN_ROLES.includes(user.role);
}

export function canDeleteFamilies(user: User | null | undefined): boolean {
  return hasPermission(user, 'families:delete');
}

export function canManageUsers(user: User | null | undefined): boolean {
  return isAdmin(user) && hasPermission(user, 'users:manage');
}

export function canEditFamilies(user: User | null | undefined): boolean {
  return hasPermission(user, 'families:edit');
}
