'use client';

import { useSession, signOut } from 'next-auth/react';
import { Shield, LogOut } from 'lucide-react';
import { getAllowedRoutes } from '@/lib/auth/permissions';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const allowedRoutes = getAllowedRoutes(session.user.role);

  return (
    <div className="max-w-[1600px] mx-auto p-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}!</h1>
            <p className="text-textMute text-lg">
              You&apos;re logged in as <span className="font-semibold text-primary">{session.user.role}</span>
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Role Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Your Access</h2>
          </div>
          <div className="space-y-2">
            <p className="text-textMute">
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
            <p className="text-textMute">
              <span className="font-semibold">Role:</span> {session.user.role}
            </p>
            <p className="text-textMute">
              <span className="font-semibold">User ID:</span> {session.user.id}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Available Pages</h2>
          <div className="space-y-2">
            {allowedRoutes.map((route) => (
              <Link
                key={route}
                href={route}
                className="block px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                {route.replace('/', '').charAt(0).toUpperCase() + route.slice(2)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Role-Specific Message */}
      <div className="bg-surface border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
        {session.user.role === 'EXECUTIVE' && (
          <p className="text-textMute">
            As an <strong>Executive</strong>, you have read-only access to dashboards and reports.
            You can comment and acknowledge published items.
          </p>
        )}
        {session.user.role === 'ANALYST' && (
          <p className="text-textMute">
            As a <strong>Risk Analyst</strong>, you can create and edit simulations, scenarios, and draft
            risk items and mitigation plans.
          </p>
        )}
        {session.user.role === 'OPERATIONS' && (
          <p className="text-textMute">
            As an <strong>Operations Manager</strong>, you can review, assign owners, update statuses,
            and approve/publish plans within your scope.
          </p>
        )}
        {session.user.role === 'FINANCE' && (
          <p className="text-textMute">
            As a <strong>Finance Controller</strong>, you have read access plus the ability to tag
            cost impacts and budget fields, and export data.
          </p>
        )}
        {session.user.role === 'AUDITOR' && (
          <p className="text-textMute">
            As an <strong>Auditor</strong>, you have read-only access with full audit log visibility
            and export capabilities.
          </p>
        )}
        {session.user.role === 'ADMIN' && (
          <p className="text-textMute">
            As an <strong>Administrator</strong>, you have full access to manage users, roles,
            organizational settings, and feature flags.
          </p>
        )}
        {session.user.role === 'OWNER' && (
          <p className="text-textMute">
            As the <strong>System Owner</strong>, you have super admin privileges including everything
            Admin has plus data export and backup capabilities.
          </p>
        )}
      </div>
    </div>
  );
}
