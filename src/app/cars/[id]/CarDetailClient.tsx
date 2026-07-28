'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Car } from '@/types/car';
import { ImageGallery } from '@/components/detail/ImageGallery';
import { TechSpecsGrid } from '@/components/detail/TechSpecsGrid';
import { InquireForm } from '@/components/detail/InquireForm';
import { CarCard } from '@/components/showcase/CarCard';
import { ChevronRight, ArrowLeft, CheckCircle2, FileText, Share2 } from 'lucide-react';

interface CarDetailClientProps {
  car: Car;
  similarCars: Car[];
}

export function CarDetailClient({ car, similarCars }: CarDetailClientProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-outline mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Inventory
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/?make=${car.make}`} className="hover:text-primary transition-colors">
            {car.make}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-on-surface font-bold truncate max-w-[200px] sm:max-w-none">
            {car.title}
          </span>
        </div>

        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {car.is_sold ? (
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Sold Archive
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Available
                </span>
              )}
              <span className="text-xs font-bold text-outline uppercase tracking-wider">
                {car.year} Model • {car.body_type || 'Vehicle'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              {car.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-white text-on-surface border border-outline-variant/40 hover:bg-surface-container-low px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-primary" />
              <span>{copied ? 'Link Copied!' : 'Share Vehicle'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image Gallery, Specs, Description */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery
              images={car.images}
              title={car.title}
              isSold={car.is_sold}
            />

            {/* Overview & Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-level-1 border border-outline-variant/30 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider">
                <FileText className="w-4 h-4 text-primary" />
                <span>Vehicle Overview & Condition Note</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line font-medium">
                {car.description ||
                  'No detailed description provided for this vehicle. Contact our sales advisors for complete build sheet details and maintenance logs.'}
              </p>
            </div>

            {/* Technical Specifications */}
            <TechSpecsGrid car={car} />
          </div>

          {/* Right Column: Sticky Inquire Form */}
          <div>
            <InquireForm car={car} />
          </div>
        </div>

        {/* Similar Vehicles Section */}
        {similarCars.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">
                  Recommendations
                </span>
                <h3 className="text-2xl font-bold text-on-surface">
                  Similar Vehicles in Inventory
                </h3>
              </div>
              <Link
                href="/"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Browse All Cars</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map((simCar) => (
                <CarCard key={simCar.id} car={simCar} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
