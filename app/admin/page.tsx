'use client';

import { RoleGate } from '@/components/auth/RoleGate';
import { Settings, Users } from 'lucide-react';

export default function AdminPage() {
  return (
    <RoleGate allowed={['ADMIN', 'OWNER']}>
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">Administration</h1>
          </div>
          <p className="text-textMute text-lg mb-4">
            ✅ <strong>You have access!</strong>
          </p>
          <p className="text-textMute">
            This page allows you to manage users, roles, organizational settings, and feature flags.
          </p>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-textMute">
              <strong>Allowed roles:</strong> ADMIN, OWNER
            </p>
          </div>

          {/* User Management Placeholder */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-bold">User Management</h2>
            </div>
            <div className="bg-background border border-border rounded-lg p-6">
              <p className="text-textMute mb-4">Demo users (all use password: demo1234):</p>
              <ul className="space-y-2 text-sm text-textMute">
                <li>• executive@rlumina.io - EXECUTIVE</li>
                <li>• analyst@rlumina.io - ANALYST</li>
                <li>• ops@rlumina.io - OPERATIONS</li>
                <li>• finance@rlumina.io - FINANCE</li>
                <li>• auditor@rlumina.io - AUDITOR</li>
                <li>• admin@rlumina.io - ADMIN</li>
                <li>• owner@rlumina.io - OWNER</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
