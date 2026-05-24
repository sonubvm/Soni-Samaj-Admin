export * from './family';

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'assistant';

export type Permission =
  | 'families:view'
  | 'families:edit'
  | 'families:delete'
  | 'users:manage'
  | 'dashboard:view';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  customPermissions?: Permission[];
  isActive?: boolean;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, 'superadmin'>;
  permissions?: Permission[];
}

export interface UpdateUserPayload {
  name?: string;
  role?: Exclude<UserRole, 'superadmin'>;
  permissions?: Permission[];
  isActive?: boolean;
  password?: string;
}

export interface DeletedFamilyAudit {
  _id: string;
  headOfFamily: { name: string; mobile: string };
  address: { city: string; district: string };
  deletedAt: string;
  deletedBy?: { _id: string; name: string; email: string; role: string } | null;
}

export interface FamilyFilters {
  district?: string;
  city?: string;
  state?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  minIncome?: string;
  maxIncome?: string;
  childStd?: string;
  schoolMedium?: string;
  search?: string;
  studentType?: string;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalFamilies: number;
  totalChildren: number;
  schoolStudents: number;
  collegeStudents: number;
  notStudyingChildren: number;
  avgFamilyIncome: number;
  totalFamilyIncome: number;
  avgHeadIncome: number;
  totalHeadIncome: number;
  minHeadIncome: number;
  maxHeadIncome: number;
  /** @deprecated use avgFamilyIncome */
  avgIncome?: number;
  /** @deprecated use totalFamilyIncome */
  totalIncome?: number;
  topDistricts: { district: string; count: number }[];
}

export interface FilterOptions {
  districts: string[];
  cities: string[];
  states: string[];
  fatherOccupations: string[];
  motherOccupations: string[];
  schoolMediums: string[];
  childStandards: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const ALL_PERMISSIONS: Permission[] = [
  'families:view',
  'families:edit',
  'families:delete',
  'users:manage',
  'dashboard:view',
];

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  assistant: 'Assistant',
};

export const ASSIGNABLE_ROLES: Exclude<UserRole, 'superadmin'>[] = ['admin', 'manager', 'assistant'];
