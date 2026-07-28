import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Mail } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Advisors Autoworld',
  description: 'Privacy Policy and Data Protection guidelines for Advisors Autoworld.',
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-on-surface-variant">
            Last Updated: July 2026 • Advisors Autoworld Inc.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl p-8 shadow-level-1 border border-outline-variant/30 space-y-6 text-sm text-on-surface-variant leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              1. Information We Collect
            </h2>
            <p>
              At <strong>Advisors Autoworld</strong>, we collect personal information that you voluntarily provide when inquiring about a vehicle, scheduling a test drive, or requesting trade-in evaluations. This information includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium text-xs">
              <li>Full Name and Contact Information (Email Address, Phone Number).</li>
              <li>Vehicle interest preferences, messages, and trade-in vehicle details.</li>
              <li>Basic technical analytics data (IP address, browser type) to optimize website performance.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              2. How We Use Your Information
            </h2>
            <p>
              Your information is strictly used to deliver high-quality automotive advisor services:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium text-xs">
              <li>Responding promptly to vehicle availability and pricing inquiries.</li>
              <li>Arranging showroom appointments, inspection logs, and vehicle delivery.</li>
              <li>Sending important updates regarding your vehicle trade-in or purchasing status.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              3. Protection & Non-Sharing Commitment
            </h2>
            <p>
              We enforce strict administrative and technical safeguards to protect your personal data. <strong>We do not sell, rent, or trade your personal contact details to third-party marketing brokers or advertisers.</strong>
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              4. Contact Privacy Officer
            </h2>
            <p>
              If you have any questions or wish to request data removal, please contact our privacy compliance team:
            </p>
            <div className="p-4 bg-surface-container-low rounded-xl text-xs space-y-1 font-medium text-on-surface">
              <p><strong>Advisors Autoworld Inc.</strong></p>
              <p>Location: Punnayurkulam, Kerala, India</p>
              <p>Email: <a href="mailto:sales@advisorsautoworld.com" className="text-primary hover:underline">sales@advisorsautoworld.com</a></p>
              <p>Phone: +91 96454 64777</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
