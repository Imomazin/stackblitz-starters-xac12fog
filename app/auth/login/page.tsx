'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield } from 'lucide-react';

const DEMO_USERS = [
  { email: 'executive@rlumina.io', role: 'EXECUTIVE', name: 'Executive', color: 'bg-purple-500' },
  { email: 'analyst@rlumina.io', role: 'ANALYST', name: 'Analyst', color: 'bg-blue-500' },
  { email: 'ops@rlumina.io', role: 'OPERATIONS', name: 'Operations', color: 'bg-green-500' },
  { email: 'finance@rlumina.io', role: 'FINANCE', name: 'Finance', color: 'bg-yellow-500' },
  { email: 'auditor@rlumina.io', role: 'AUDITOR', name: 'Auditor', color: 'bg-orange-500' },
  { email: 'admin@rlumina.io', role: 'ADMIN', name: 'Admin', color: 'bg-red-500' },
  { email: 'owner@rlumina.io', role: 'OWNER', name: 'Owner', color: 'bg-pink-500' },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-neo rounded-2xl mb-4 shadow-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            R<span className="text-primary">_</span>LUMINA
          </h1>
          <p className="text-textMute">Risk Management Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-surface border border-border rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-neo text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Chips */}
          <div className="mt-8">
            <p className="text-sm text-textMute mb-3 text-center">Quick login as demo user:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => quickLogin(user.email)}
                  className={`${user.color} text-white px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity`}
                >
                  {user.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-textMute mt-3 text-center">
              All demo accounts use password: <code className="bg-background px-2 py-1 rounded">demo1234</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-textMute mt-6">
          R_LUMINA © 2024 - Enterprise Risk Management
        </p>
      </div>
    </div>
  );
}
