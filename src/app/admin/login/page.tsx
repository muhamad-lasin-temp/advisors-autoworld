'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2, Sparkles, KeyRound } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '@/components/common/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!isSupabaseConfigured) {
      // In local demo mode, set admin auth and device memory flags
      if (typeof window !== 'undefined') {
        localStorage.setItem('advisors_admin_auth', 'true');
        localStorage.setItem('advisors_admin_device', 'true');
      }
      router.push('/admin');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid email or password credentials.');
        setLoading(false);
        return;
      }

      if (data.session) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('advisors_admin_auth', 'true');
          localStorage.setItem('advisors_admin_device', 'true');
        }
        router.push('/admin');
        return;
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setErrorMsg('An unexpected error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high via-background to-background">
      <div className="max-w-md w-full">
        
        {/* Card Header */}
        <div className="bg-white rounded-2xl p-8 shadow-level-2 border border-outline-variant/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          {/* Logo & Brand Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Logo variant="dark" size="lg" />
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Local Demo Mode Active</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Running locally without live Supabase credentials. Click <strong>Sign In</strong> below (or submit any credentials) to enter the <strong>Demo Admin Dashboard</strong>!
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-50 text-error text-xs font-bold rounded-xl border border-red-200 text-center">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@advisorsautoworld.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Management Portal</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Access is restricted strictly to verified dealership staff and inventory administrators. All login sessions are encrypted and monitored for security.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
