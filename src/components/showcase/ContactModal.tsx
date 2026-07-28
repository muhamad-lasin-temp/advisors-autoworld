'use client';

import React, { useState } from 'react';
import { X, Send, Phone, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Car } from '@/types/car';
import { formatPrice } from '@/lib/utils';
import { ContactInquirySchema } from '@/lib/validations/car-schema';

interface ContactModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ car, isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !car) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Security Rule 2: Schema Enforcement using Zod
    const validationResult = ContactInquirySchema.safeParse({
      name,
      email,
      phone,
      message,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid form input.';
      setErrorMsg(firstError);
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative">
        
        {/* Header */}
        <div className="bg-primary text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-fixed">
            Vehicle Inquiry
          </span>
          <h3 className="text-xl font-bold mt-1 line-clamp-1">
            {car.title}
          </h3>
          <p className="text-xs text-primary-fixed-dim mt-1 font-semibold">
            Price: {formatPrice(car.price)} • Year: {car.year}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-on-surface">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Thank you for your interest. One of our senior automotive advisors will contact you shortly regarding the {car.make} {car.model}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                  Message / Questions
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi, I'm interested in the ${car.title}. Please send me more information or availability details.`}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`https://wa.me/919645464777?text=${encodeURIComponent(`Hi, I'm interested in the ${car.title} (${formatPrice(car.price)})`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Seller</span>
                </a>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
