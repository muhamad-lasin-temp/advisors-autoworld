import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-16 sm:mt-20 border-t border-slate-700/50">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Logo variant="light" size="sm" showSubtitle={false} />
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Precision Mobility Marketplace. Verified pre-owned luxury, sports, and executive vehicles curated with structural integrity and full history transparency.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Certified Inspection Guaranteed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">
                  All Vehicles
                </Link>
              </li>
              <li>
                <Link href="/?status=available" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">
                  Available Cars
                </Link>
              </li>
              <li>
                <Link href="/?status=sold" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">
                  Sold Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-1 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
              Contact Info
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-fixed-dim shrink-0 mt-0.5" />
                <span>Punnayurkulam, Kerala, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-fixed-dim shrink-0" />
                <a href="tel:+919645464777" className="hover:underline">+91 96454 64777</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary-fixed-dim shrink-0 mt-0.5" />
                <a href="mailto:sales@advisorsautoworld.com" className="hover:underline break-all">sales@advisorsautoworld.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary-fixed-dim shrink-0" />
                <span>Mon – Sun: 8:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Customer Service Trust */}
          <div className="bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between col-span-2 lg:col-span-3">
            <div>
              <span className="text-xs font-bold text-inverse-primary uppercase tracking-wider block mb-2">
                Have a Trade-In or Inquiry?
              </span>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Connect directly with our senior automotive advisors for nationwide shipping options or vehicle trade evaluations.
              </p>
            </div>
            <a
              href={`https://wa.me/919645464777?text=${encodeURIComponent('Hi Advisors Autoworld, I have a trade-in evaluation or vehicle inquiry.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 sm:gap-4">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Advisors Autoworld Inc. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/about" className="hover:underline">About Us</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
