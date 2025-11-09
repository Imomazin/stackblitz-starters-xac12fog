'use client';

import { RoleGate } from '@/components/auth/RoleGate';
import { CheckCircle } from 'lucide-react';

export default function ApprovalsPage() {
  return (
    <RoleGate allowed={['OPERATIONS', 'ADMIN', 'OWNER']}>
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold">Approvals & Publishing</h1>
          </div>
          <p className="text-textMute text-lg mb-4">
            ✅ <strong>You have access!</strong>
          </p>
          <p className="text-textMute">
            This page allows you to review, approve, and publish risk management plans.
          </p>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-textMute">
              <strong>Allowed roles:</strong> OPERATIONS, ADMIN, OWNER
            </p>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
