'use client';

import { RoleGate } from '@/components/auth/RoleGate';
import { FileSearch } from 'lucide-react';

export default function AuditPage() {
  return (
    <RoleGate allowed={['AUDITOR', 'ADMIN', 'OWNER']}>
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileSearch className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Audit Logs & Compliance</h1>
          </div>
          <p className="text-textMute text-lg mb-4">
            ✅ <strong>You have access!</strong>
          </p>
          <p className="text-textMute">
            This page provides full audit log visibility and data export capabilities for compliance purposes.
          </p>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-textMute">
              <strong>Allowed roles:</strong> AUDITOR, ADMIN, OWNER
            </p>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
