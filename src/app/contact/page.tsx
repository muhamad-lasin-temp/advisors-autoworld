'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Truck,
  ShieldCheck,
} from 'lucide-react';

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us Directly',
    value: '+91 96454 64777',
    sub: 'Mon – Sun, 8 AM – 11 PM',
    href: 'tel:+919645464777',
    color: 'text-primary',
    bg: 'bg-primary/8',
    cta: 'Call Now',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Chat',
    value: 'Chat Instantly',
    sub: 'Fastest response guaranteed',
    href: `https://wa.me/919645464777?text=${encodeURIComponent('Hi Advisors Autoworld, I would like to inquire about a vehicle.')}`,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    cta: 'Open WhatsApp',
    external: true,
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: 'sales@advisorsautoworld.com',
    sub: 'We reply within 2 hours',
    href: 'mailto:sales@advisorsautoworld.com',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    cta: 'Send Email',
  },
];

const trustPoints = [
  { icon: ShieldCheck, text: 'Verified multi-point inspection on every vehicle' },
  { icon: Truck, text: 'Nationwide enclosed shipping available' },
  { icon: Headphones, text: 'Dedicated advisor available 7 days a week' },
  { icon: CheckCircle2, text: 'Instant financing & trade-in evaluations' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          message: form.subject
            ? `Subject: ${form.subject}\n\n${form.message}`
            : form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-background to-background pt-10 sm:pt-16 pb-10 sm:pb-16 border-b border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Contact &amp; Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-[1.1]">
              We&apos;re Here to Help You Find{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Your Next Car
              </span>
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Reach out via call, WhatsApp, or the form below. Our senior advisors typically respond within 30 minutes during business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-10 sm:py-14">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-14">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                target={method.external ? '_blank' : undefined}
                rel={method.external ? 'noreferrer' : undefined}
                className="group bg-white rounded-2xl p-4 sm:p-6 border border-outline-variant/20 shadow-level-1 hover:shadow-level-2 transition-all hover:-translate-y-1 space-y-3 sm:space-y-4 flex flex-col"
              >
                <div className={`w-10 h-10 ${method.bg} rounded-xl flex items-center justify-center`}>
                  <method.icon className={`w-5 h-5 ${method.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-outline uppercase tracking-wider mb-0.5">{method.title}</div>
                  <div className="text-sm font-bold text-on-surface break-all">{method.value}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{method.sub}</div>
                </div>
                <div className={`mt-auto inline-flex items-center gap-1.5 text-xs font-bold ${method.color} group-hover:gap-2.5 transition-all`}>
                  {method.cta} <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>

          {/* Main Content: Form + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-5 sm:p-8 border border-outline-variant/20 shadow-level-1">
                <h2 className="text-xl font-bold text-on-surface mb-1">Send Us a Message</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-6">
                  Fill in the form below and a dedicated advisor will get back to you shortly.
                </p>

                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">Message Received!</h3>
                    <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                      Thank you for reaching out. One of our senior automotive advisors will contact you within the hour.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline mt-2"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1.5">Subject</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.15rem] bg-[right_0.85rem_center] bg-no-repeat pr-10"
                      >
                        <option value="">Select a subject...</option>
                        <option value="vehicle-inquiry">Vehicle Inquiry</option>
                        <option value="trade-in">Trade-In Evaluation</option>
                        <option value="financing">Financing Options</option>
                        <option value="shipping">Shipping & Delivery</option>
                        <option value="test-drive">Schedule a Visit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what you're looking for, which car you're interested in, or any questions you have..."
                        className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-sm disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* Location */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/20 shadow-level-1 space-y-4">
                <h3 className="text-base font-bold text-on-surface">Showroom Location</h3>
                <div className="space-y-3 text-sm text-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-on-surface">Advisors Autoworld</div>
                      <div>Punnayurkulam, Thrissur</div>
                      <div>Kerala, India</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-on-surface">Business Hours</div>
                      <div>Mon – Sun: 8:00 AM – 11:00 PM</div>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                        Currently Open
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Points */}
              <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 sm:p-6 text-white space-y-4">
                <h3 className="text-base font-bold">Why Choose Advisors?</h3>
                <div className="space-y-3">
                  {trustPoints.map((pt) => (
                    <div key={pt.text} className="flex items-start gap-2.5">
                      <pt.icon className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-blue-100">{pt.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Quick CTA */}
              <a
                href={`https://wa.me/919645464777?text=${encodeURIComponent('Hi Advisors Autoworld, I have an inquiry!')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-4 sm:p-5 transition-colors group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">Chat on WhatsApp</div>
                  <div className="text-xs text-emerald-100">Get an instant response from our team</div>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
