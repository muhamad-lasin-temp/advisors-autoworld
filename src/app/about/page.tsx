import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Car,
  Star,
  CheckCircle2,
  Handshake,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Advisors Autoworld — Precision Mobility Marketplace',
  description:
    'Learn about Advisors Autoworld — Kerala\'s trusted source for verified pre-owned luxury, sports, and executive vehicles with full transparency and certified inspections.',
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Certified Integrity',
    description:
      'Every vehicle in our inventory undergoes a rigorous multi-point structural and mechanical inspection before listing. No surprises. No hidden damage.',
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: Handshake,
    title: 'Transparent Dealings',
    description:
      'We believe in full price and history transparency. Every listing includes real mileage, service records, and honest condition notes — no inflated claims.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Award,
    title: 'Curated Excellence',
    description:
      'We only source vehicles we\'d recommend to family. Our hand-selected inventory spans luxury sedans, sports cars, and executive SUVs from top global manufacturers.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description:
      'From inquiry to delivery, we move at your speed. Nationwide enclosed shipping, instant financing quotes, and a responsive advisory team available 7 days a week.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
];

const stats = [
  { label: 'Vehicles Sold', value: '500+', icon: Car },
  { label: 'Happy Customers', value: '480+', icon: Users },
  { label: 'Years of Trust', value: '8+', icon: Star },
  { label: 'States Served', value: 'All India', icon: MapPin },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-background to-background pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Our Story</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-[1.1]">
              Kerala&apos;s Most Trusted{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Pre-Owned Luxury
              </span>{' '}
              Dealership
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Advisors Autoworld was founded on one conviction: buying a pre-owned vehicle should feel as premium and trustworthy as buying a new one. We bring that standard to every car, every deal, every conversation.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col xs:flex-row gap-3">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
              >
                <Car className="w-4 h-4" />
                Browse Our Inventory
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-on-surface font-bold text-sm px-6 py-3 rounded-xl border border-outline-variant/40 hover:bg-surface-container-low transition-colors shadow-sm"
              >
                Get in Touch
                <ChevronRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-outline-variant/20 py-6 sm:py-8">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1.5">
                <stat.icon className="w-5 h-5 text-primary mx-auto" />
                <div className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-outline uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Who We Are</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                  Built on a Passion for Precision Vehicles
                </h2>
              </div>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Founded in Punnayurkulam, Kerala, Advisors Autoworld started as a small but passionate operation with a simple goal: to make high-quality pre-owned vehicles accessible, honest, and exciting. Over the years, we've grown into one of the region's most respected names in pre-owned luxury and performance vehicles.
              </p>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Our team of senior automotive advisors brings decades of combined experience in vehicle sourcing, inspection, and customer service. We don't just sell cars — we build long-term relationships with buyers who trust us to guide them toward the right vehicle at the right value.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Every car personally inspected by certified advisors',
                  'Full service history and documentation provided',
                  'Nationwide enclosed shipping available',
                  'Instant financing and trade-in evaluations',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-on-surface-variant">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 sm:p-6 text-white space-y-2 col-span-2">
                <ShieldCheck className="w-7 h-7 text-blue-200" />
                <h3 className="text-lg sm:text-xl font-bold">100% Verified Every Time</h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Our multi-point inspection covers structural integrity, engine health, transmission, electrical systems, and cosmetic condition — documented and shared with you upfront.
                </p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 space-y-2 border border-outline-variant/20">
                <Clock className="w-5 h-5 text-primary" />
                <div className="text-xl font-black text-on-surface">7 Days</div>
                <div className="text-xs text-on-surface-variant font-semibold">Mon–Sun Open</div>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 space-y-2 border border-outline-variant/20">
                <Star className="w-5 h-5 text-amber-500" />
                <div className="text-xl font-black text-on-surface">4.9 / 5</div>
                <div className="text-xs text-on-surface-variant font-semibold">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-14 sm:py-20 bg-surface-container-low/40 border-y border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">What Drives Us</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              The Advisors Autoworld Promise
            </h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/20 shadow-level-1 space-y-3 hover:shadow-level-2 transition-shadow"
              >
                <div className={`w-10 h-10 ${val.bg} rounded-xl flex items-center justify-center`}>
                  <val.icon className={`w-5 h-5 ${val.color}`} />
                </div>
                <h3 className="text-base font-bold text-on-surface">{val.title}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Find Us</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                  Visit Our Showroom
                </h2>
              </div>
              <div className="space-y-4 text-sm text-on-surface-variant">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-on-surface">Address</div>
                    <div>Punnayurkulam, Thrissur District, Kerala, India</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-on-surface">Business Hours</div>
                    <div>Monday – Sunday: 8:00 AM – 11:00 PM</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                      Open Today
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
              >
                Contact Us
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ready to Find Your Car?</span>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                Browse Over 500+ Premium Vehicles
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore our live inventory of verified pre-owned luxury cars, sports vehicles, and executive SUVs — all with full history transparency.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Car className="w-4 h-4" />
                  View Inventory
                </Link>
                <a
                  href={`https://wa.me/919645464777?text=${encodeURIComponent('Hi Advisors Autoworld, I would like to know more about your vehicles.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
