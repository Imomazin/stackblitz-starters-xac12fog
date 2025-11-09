import { Role } from '../db/users';

/**
 * Permission actions that can be performed in R_LUMINA
 */
export type Permission =
  | 'view_dashboards'
  | 'create_drafts'
  | 'edit_drafts'
  | 'approve_publish'
  | 'update_status'
  | 'assign_owners'
  | 'tag_costs'
  | 'export_data'
  | 'view_audit_logs'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_settings';

/**
 * Permissions matrix based on roles
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  EXECUTIVE: ['view_dashboards'],
  ANALYST: ['view_dashboards', 'create_drafts', 'edit_drafts'],
  OPERATIONS: [
    'view_dashboards',
    'create_drafts',
    'edit_drafts',
    'approve_publish',
    'update_status',
    'assign_owners',
  ],
  FINANCE: ['view_dashboards', 'tag_costs', 'export_data'],
  AUDITOR: ['view_dashboards', 'export_data', 'view_audit_logs'],
  ADMIN: [
    'view_dashboards',
    'create_drafts',
    'edit_drafts',
    'approve_publish',
    'update_status',
    'assign_owners',
    'tag_costs',
    'export_data',
    'view_audit_logs',
    'manage_users',
    'manage_roles',
    'manage_settings',
  ],
  OWNER: [
    'view_dashboards',
    'create_drafts',
    'edit_drafts',
    'approve_publish',
    'update_status',
    'assign_owners',
    'tag_costs',
    'export_data',
    'view_audit_logs',
    'manage_users',
    'manage_roles',
    'manage_settings',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Check if a role has access to a specific route
 */
export function canAccessRoute(role: Role, route: string): boolean {
  // Public routes
  if (route === '/' || route.startsWith('/auth')) {
    return true;
  }

  // Dashboard - all authenticated users
  if (route === '/dashboard' || route.startsWith('/dashboard')) {
    return true;
  }

  // Drafts - Analyst, Operations, Admin, Owner
  if (route.startsWith('/drafts')) {
    return can(role, 'create_drafts');
  }

  // Approvals - Operations, Admin, Owner
  if (route.startsWith('/approvals')) {
    return can(role, 'approve_publish');
  }

  // Finance - Finance, Admin, Owner
  if (route.startsWith('/finance')) {
    return can(role, 'tag_costs');
  }

  // Audit - Auditor, Admin, Owner
  if (route.startsWith('/audit')) {
    return can(role, 'view_audit_logs');
  }

  // Admin - Admin, Owner only
  if (route.startsWith('/admin')) {
    return can(role, 'manage_users');
  }

  // Default: deny
  return false;
}

/**
 * Get all allowed routes for a role
 */
export function getAllowedRoutes(role: Role): string[] {
  const routes = ['/dashboard'];

  if (can(role, 'create_drafts')) routes.push('/drafts');
  if (can(role, 'approve_publish')) routes.push('/approvals');
  if (can(role, 'tag_costs')) routes.push('/finance');
  if (can(role, 'view_audit_logs')) routes.push('/audit');
  if (can(role, 'manage_users')) routes.push('/admin');

  return routes;
}

/**
 * Get human-readable permission descriptions
 */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  view_dashboards: 'View dashboards and reports',
  create_drafts: 'Create and edit draft scenarios',
  edit_drafts: 'Edit existing drafts',
  approve_publish: 'Approve and publish plans',
  update_status: 'Update status and assign owners',
  assign_owners: 'Assign risk owners',
  tag_costs: 'Tag cost impacts and budget fields',
  export_data: 'Export data to files',
  view_audit_logs: 'View full audit logs',
  manage_users: 'Manage users and roles',
  manage_roles: 'Manage role assignments',
  manage_settings: 'Manage system settings',
};
