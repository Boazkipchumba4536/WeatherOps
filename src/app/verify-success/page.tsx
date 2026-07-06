'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';
import { CloudSun, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export default function VerifySuccessPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="w-full max-w-md z-10 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">WeatherOps</span>
          </div>
          <h2 className="text-xl font-semibold text-zinc-100">Verification Success</h2>
          <p className="text-xs text-zinc-400 mt-1">Operational Weather Intelligence Command</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-200">Account Activated Successfully</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-[300px] mx-auto">
              Welcome aboard, <span className="text-zinc-200 font-semibold">{user?.name || 'Operator'}</span>. Your profile has been assigned to <span className="text-zinc-200 font-semibold">{user?.companyName || 'Apex Logistics'}</span> with role access <span className="text-zinc-200 font-semibold">{user?.role}</span>.
            </p>
          </div>

          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 flex items-center gap-3 text-left">
            <div className="p-2 rounded bg-zinc-900 text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Active Credentials</div>
              <div className="text-xs text-zinc-300 font-semibold">{user?.email || 'admin@weatherops.com'}</div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            Launch Command Center
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
