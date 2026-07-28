import React from 'react';
import Link from 'next/link';
import { FileCheck, ArrowLeft, Car, Scale, ShieldAlert, Phone } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Advisors Autoworld',
  description: 'Terms of Service and Vehicle Purchase Terms for Advisors Autoworld.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-level-1 border border-outline-variant/30 space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-on-surface-variant">
            Last Updated: July 2026 • Advisors Autoworld Inc.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl p-8 shadow-level-1 border border-outline-variant/30 space-y-6 text-sm text-on-surface-variant leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              1. Vehicle Listings & Price Accuracy
            </h2>
            <p>
              All vehicle prices, specifications, and availability details published on <strong>Advisors Autoworld</strong> are subject to confirmation at the time of purchase. While we strive for 100% accuracy, vehicle availability changes rapidly, and final terms are established upon signing a formal sales contract at our showroom.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              2. Inquiries & Test Drive Bookings
            </h2>
            <p>
              Submitting an online inquiry form or booking a test drive reservation does not constitute a binding sales agreement or hold contract on a vehicle. Vehicles remain open for sale until a deposit or official sales order is completed.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              3. Acceptable Website Use
            </h2>
            <p>
              Users agree not to misuse our digital marketplace, attempt unauthorized access to inventory management systems, or submit false inquiry information.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              4. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of Kerala, India.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              5. Questions & Contact
            </h2>
            <div className="p-4 bg-surface-container-low rounded-xl text-xs space-y-1 font-medium text-on-surface">
              <p><strong>Advisors Autoworld Inc.</strong></p>
              <p>Location: Punnayurkulam, Kerala, India</p>
              <p>Phone: +91 96454 64777</p>
              <p>Email: <a href="mailto:sales@advisorsautoworld.com" className="text-primary hover:underline">sales@advisorsautoworld.com</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
