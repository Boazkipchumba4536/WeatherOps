'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CloudSun, Eye, EyeOff, Lock, Mail, User as UserIcon, Building, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordCriteria = {
    length: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !companyName) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isPasswordValid) {
      setError('Please meet all password complexity requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await register(name, email, password, companyName);
      if (success) {
        router.push('/verify-success');
      } else {
        setError('This email address is already registered.');
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

      <div className="w-full max-w-md z-10 my-8">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">WeatherOps</span>
          </Link>
          <h2 className="text-xl font-semibold text-zinc-100">Create operator account</h2>
          <p className="text-xs text-zinc-400 mt-1">Operational Weather Intelligence Command</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mitchell"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Company / Agency</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Apex Logistics Inc."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Business Email Address</label>
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

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-10 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password indicator */}
              <div className="mt-2.5 space-y-1 bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Complexity criteria:</p>
                <div className="grid grid-cols-3 gap-1 mt-1 text-[10px]">
                  <div className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${passwordCriteria.length ? 'border-emerald-500' : 'border-zinc-700'}`}>
                      {passwordCriteria.length && <Check className="w-2.5 h-2.5" />}
                    </div>
                    8+ chars
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.number ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${passwordCriteria.number ? 'border-emerald-500' : 'border-zinc-700'}`}>
                      {passwordCriteria.number && <Check className="w-2.5 h-2.5" />}
                    </div>
                    1+ digit
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.uppercase ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${passwordCriteria.uppercase ? 'border-emerald-500' : 'border-zinc-700'}`}>
                      {passwordCriteria.uppercase && <Check className="w-2.5 h-2.5" />}
                    </div>
                    1+ Upper
                  </div>
                </div>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Register System Operator
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            Log in to control room
          </Link>
        </p>
      </div>
    </div>
  );
}
