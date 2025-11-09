'use client';

import { RoleGate } from '@/components/auth/RoleGate';
import { Settings, Users, Mail, Key, Shield, UserCheck } from 'lucide-react';
import { DEMO_USERS } from '@/lib/db/users';

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

          {/* User Directory */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">User Directory</h2>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold mb-2">📋 Demo Account Information</p>
              <p className="text-sm text-textMute">All demo accounts use the password: <code className="bg-background px-2 py-1 rounded font-mono text-primary">demo1234</code></p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {DEMO_USERS.map((user, idx) => (
                <div
                  key={user.id}
                  className="bg-background border-2 border-border hover:border-primary/30 rounded-xl p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      user.role === 'OWNER' ? 'bg-pink-500/10 text-pink-500' :
                      user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                      user.role === 'AUDITOR' ? 'bg-orange-500/10 text-orange-500' :
                      user.role === 'FINANCE' ? 'bg-yellow-500/10 text-yellow-500' :
                      user.role === 'OPERATIONS' ? 'bg-green-500/10 text-green-500' :
                      user.role === 'ANALYST' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-textMute">
                          <Mail className="w-4 h-4" />
                          <code className="bg-surface px-2 py-0.5 rounded text-xs">{user.email}</code>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-textMute">
                          <Key className="w-4 h-4" />
                          <code className="bg-surface px-2 py-0.5 rounded text-xs">demo1234</code>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="w-4 h-4" />
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            user.role === 'OWNER' ? 'bg-pink-500/20 text-pink-600' :
                            user.role === 'ADMIN' ? 'bg-red-500/20 text-red-600' :
                            user.role === 'AUDITOR' ? 'bg-orange-500/20 text-orange-600' :
                            user.role === 'FINANCE' ? 'bg-yellow-500/20 text-yellow-600' :
                            user.role === 'OPERATIONS' ? 'bg-green-500/20 text-green-600' :
                            user.role === 'ANALYST' ? 'bg-blue-500/20 text-blue-600' :
                            'bg-purple-500/20 text-purple-600'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-surface border border-border rounded-lg p-4">
              <p className="text-sm text-textMute">
                <strong>Quick Login:</strong> Click any email above to copy it, then go to <a href="/auth/login" className="text-primary hover:underline">/auth/login</a> and paste the email with password <code className="bg-background px-2 py-1 rounded">demo1234</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
