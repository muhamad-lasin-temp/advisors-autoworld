'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, User, LogOut, Menu, X, PhoneCall } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '@/components/common/Logo';

export function Navbar() {
  const pathname = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminDevice, setIsAdminDevice] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check local storage device memory and Supabase auth session
    const localAuth = typeof window !== 'undefined' ? localStorage.getItem('advisors_admin_auth') : null;
    const isDevice = typeof window !== 'undefined' ? localStorage.getItem('advisors_admin_device') === 'true' : false;
    
    setIsAdminDevice(isDevice);
    if (localAuth === 'true') {
      setIsAdminLoggedIn(true);
    }

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAdminLoggedIn(true);
          setIsAdminDevice(true);
          if (typeof window !== 'undefined') localStorage.setItem('advisors_admin_device', 'true');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const loggedIn = !!session || localStorage.getItem('advisors_admin_auth') === 'true';
        setIsAdminLoggedIn(loggedIn);
        if (loggedIn) {
          setIsAdminDevice(true);
          if (typeof window !== 'undefined') localStorage.setItem('advisors_admin_device', 'true');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('advisors_admin_auth');
      // Intentionally keep advisors_admin_device = 'true' so this device remembers admin access!
      localStorage.setItem('advisors_admin_device', 'true');
    }
    setIsAdminLoggedIn(false);
    setIsAdminDevice(true);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Inventory' },
    { href: '/?status=available', label: 'Available Cars' },
    { href: '/?status=sold', label: 'Sold History' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/">
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+919645464777"
              className="flex items-center gap-2 text-xs font-bold text-on-surface-variant bg-surface-container-low hover:bg-surface-container px-3.5 py-2.5 rounded-xl transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-primary" />
              <span>+91 96454 64777</span>
            </a>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out admin"
                  className="p-2.5 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-xl transition-colors"
                  suppressHydrationWarning
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdminDevice ? (
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-xs font-bold text-on-surface bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container-low px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-slate-500" />
                Admin Sign In
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-on-surface hover:bg-slate-100 rounded-lg"
              suppressHydrationWarning
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 pb-6 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-on-surface hover:bg-surface-container-low"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:+919645464777"
                className="flex items-center justify-center gap-2 text-xs font-bold text-on-surface-variant bg-surface-container-low py-3 rounded-xl"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                <span>Call Us: +91 96454 64777</span>
              </a>
              {isAdminLoggedIn ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-primary text-white text-xs font-bold py-3 rounded-xl"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 text-error bg-red-50 text-xs font-bold py-3 rounded-xl"
                    suppressHydrationWarning
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </>
              ) : isAdminDevice ? (
                <Link
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-on-surface border border-outline-variant/40 py-3 rounded-xl"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Admin Sign In
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
