'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';
import { CloudSun, Mail, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const exists = await forgotPassword(email);
      if (exists) {
        setSuccess(true);
      } else {
        setError('This email address does not match any registered operator.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">WeatherOps</span>
          </Link>
          <h2 className="text-xl font-semibold text-zinc-100">Recover password</h2>
          <p className="text-xs text-zinc-400 mt-1">Operational Weather Intelligence Command</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-xl">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Reset instructions dispatched</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto">
                  A verification dispatch has been sent to <span className="text-zinc-200 font-semibold">{email}</span>. Click the link to proceed.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/reset-password?email=${encodeURIComponent(email)}`}
                  className="btn-primary w-full justify-center text-xs"
                >
                  Mock Reset Password Link
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-zinc-400 mb-4">
                Provide your registered operator email address below. The system will dispatch credentials reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 text-white animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Dispatch Reset Request'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to operator login
          </Link>
        </p>
      </div>
    </div>
  );
}
