'use client';

import React, { useState } from 'react';
import { Car } from '@/types/car';
import { formatPrice } from '@/lib/utils';
import { Phone, Mail, Send, CheckCircle2, ShieldCheck, Truck, Clock } from 'lucide-react';

interface InquireFormProps {
  car: Car;
}

export function InquireForm({ car }: InquireFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [hpField, setHpField] = useState(''); // Anti-bot honeypot
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-Bot Honeypot Defense: Silent drop if automated spam bot fills hidden input
    if (hpField) {
      setSubmitted(true);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setHpField('');
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-level-1 border border-outline-variant/30 sticky top-24 space-y-6">
      
      {/* Price & Status Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Asking Price</span>
          {car.is_sold ? (
            <span className="bg-slate-900 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
              Sold
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-200">
              In Stock
            </span>
          )}
        </div>
        <div className="text-3xl font-extrabold text-primary tracking-tight mt-1">
          {formatPrice(car.price)}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>Verified Multi-Point Inspection</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary shrink-0" />
          <span>Nationwide Enclosed Shipping Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <span>Instant Financing & Trade-In Quote</span>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">
          Inquire About This Car
        </h4>

        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold">Inquiry Sent!</p>
            <p className="text-[11px]">An advisor will reach out to you within 1 business hour.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Anti-Bot Honeypot Field (Invisible to legitimate human users) */}
            <input
              type="text"
              name="website_hp"
              value={hpField}
              onChange={(e) => setHpField(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name *"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I'd like to schedule a test drive or request additional vehicle details."
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={car.is_sold}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                car.is_sold
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-container text-white shadow-sm'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{car.is_sold ? 'Vehicle Sold' : 'Contact Dealer'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Direct Contact Buttons */}
      <div className="pt-2 border-t border-slate-100 flex gap-2">
        <a
          href="tel:+919645464777"
          className="flex-1 flex items-center justify-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-primary" />
          <span>Call Showroom</span>
        </a>
        <a
          href={`https://wa.me/919645464777?text=${encodeURIComponent(`Hi, inquiring about ${car.title}`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
