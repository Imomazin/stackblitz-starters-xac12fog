'use client';

import { RoleGate } from '@/components/auth/RoleGate';
import { DollarSign } from 'lucide-react';

export default function FinancePage() {
  return (
    <RoleGate allowed={['FINANCE', 'ADMIN', 'OWNER']}>
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Financial Risk & Cost Tagging</h1>
          </div>
          <p className="text-textMute text-lg mb-4">
            ✅ <strong>You have access!</strong>
          </p>
          <p className="text-textMute">
            This page allows you to tag cost impacts, manage budget fields, and export financial data.
          </p>
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-textMute">
              <strong>Allowed roles:</strong> FINANCE, ADMIN, OWNER
            </p>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
