'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, User, LogOut, Menu, X, PhoneCall, MessageSquare } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '@/components/common/Logo';

export function Navbar() {
  const pathname = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminDevice, setIsAdminDevice] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const whatsappHref = `https://wa.me/919645464777?text=${encodeURIComponent('Hi Advisors Autoworld, I would like to inquire about a vehicle.')}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80">

        {/* ── Top utility bar (desktop only) ─────────────────────────── */}
        <div className="hidden lg:block border-b border-slate-100">
          <div className="max-w-[1280px] mx-auto px-6 xl:px-8">
            <div className="flex items-center justify-between h-10">
              {/* Left tagline */}
              <p className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">
                Precision Mobility · Marketplace
              </p>

              {/* Right: contact + admin */}
              <div className="flex items-center gap-1">
                <a
                  href="tel:+919645464777"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-primary px-3 py-1.5 rounded-lg transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+91 96454 64777</span>
                </a>

                <span className="w-px h-3.5 bg-slate-200" />

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {isAdminLoggedIn ? (
                  <>
                    <span className="w-px h-3.5 bg-slate-200" />
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary-container px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      title="Log out admin"
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-500 px-2 py-1.5 rounded-lg transition-colors"
                      suppressHydrationWarning
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : isAdminDevice ? (
                  <>
                    <span className="w-px h-3.5 bg-slate-200" />
                    <Link
                      href="/admin/login"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-primary px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      Admin Sign In
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main bar ───────────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 md:h-[70px] lg:h-20">

            {/* Logo */}
            <Link href="/" className="shrink-0 pl-1.5 sm:pl-3 lg:pl-0">
              {/* Mobile */}
              <Logo variant="dark" size="sm" showSubtitle={false} className="lg:hidden" />
              {/* Desktop — larger, no subtitle (tagline lives in top bar) */}
              <Logo variant="dark" size="lg" showSubtitle={false} className="hidden lg:inline-flex" />
            </Link>

            {/* Desktop Nav — centered */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-primary bg-primary/8'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA button (WhatsApp — prominent) */}
            <div className="hidden lg:flex items-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                Chat Now
              </a>
            </div>

            {/* Tablet (md–lg): icon strip */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <a
                href="tel:+919645464777"
                className="p-2.5 text-slate-500 hover:text-primary bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Call Us"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              {isAdminLoggedIn ? (
                <>
                  <Link href="/admin" className="p-2.5 bg-primary text-white rounded-xl" title="Admin Dashboard">
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    suppressHydrationWarning
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : isAdminDevice ? (
                <Link href="/admin/login" className="p-2.5 border border-slate-200 rounded-xl" title="Admin Sign In">
                  <User className="w-4 h-4 text-slate-500" />
                </Link>
              ) : null}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center -translate-y-1.5">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                suppressHydrationWarning
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile dropdown ─────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 pb-5 space-y-1 animate-in slide-in-from-top-2">
            <div className="px-4 space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/8'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </Link>
                );
              })}
            </div>

            <div className="px-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:+919645464777"
                className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 py-2.5 rounded-xl"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                Call Us: +91 96454 64777
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
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
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center justify-center gap-2 text-red-600 bg-red-50 text-xs font-bold py-3 rounded-xl"
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
                  className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 border border-slate-200 py-3 rounded-xl"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Admin Sign In
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
