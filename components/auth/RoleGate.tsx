'use client';

import { useSession } from 'next-auth/react';
import { Role } from '@/lib/db/users';
import { ReactNode } from 'react';

type RoleGateProps = {
  allowed: Role[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGate({ allowed, children, fallback }: RoleGateProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!session?.user) {
    return fallback || <div className="p-8 text-center text-textMute">Please sign in to access this content.</div>;
  }

  if (!allowed.includes(session.user.role)) {
    return fallback || <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-bold text-red-800 mb-2">Access Denied</h3>
      <p className="text-red-600">Your role ({session.user.role}) does not have permission to view this content.</p>
      <p className="text-sm text-red-500 mt-2">Allowed roles: {allowed.join(', ')}</p>
    </div>;
  }

  return <>{children}</>;
}
