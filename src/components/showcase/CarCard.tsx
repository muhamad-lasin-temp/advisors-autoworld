'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gauge, Fuel, Zap, ChevronLeft, ChevronRight, ArrowUpRight, CheckCircle2, Shield } from 'lucide-react';
import { Car } from '@/types/car';
import { formatPrice, formatMileage } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  priority?: boolean;
  onInquire?: (car: Car) => void;
}

export function CarCard({ car, priority = false, onInquire }: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car.images && car.images.length > 0
    ? car.images 
    : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="glass-card group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-level-2">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={images[currentImageIndex]}
          alt={car.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            car.is_sold ? 'grayscale-[40%] opacity-90' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Status & Feature Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {car.is_sold ? (
              <span className="bg-slate-900/90 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-slate-700">
                Sold Out
              </span>
            ) : (
              <span className="bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                Available
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-md text-on-surface text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/40">
              {car.year}
            </span>
          </div>

          {car.fuel_type === 'Electric' && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              EV
            </span>
          )}
        </div>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handlePrevImage}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
              aria-label="Previous image"
              suppressHydrationWarning
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
              aria-label="Next image"
              suppressHydrationWarning
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Indicator Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Make & Model Header */}
          <div className="flex items-center justify-between gap-2 text-xs font-bold text-outline uppercase tracking-wider mb-1">
            <span>{car.make} • {car.body_type || 'Vehicle'}</span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold lowercase">
              <Shield className="w-3 h-3 text-primary" /> Trans: {car.transmission}
            </span>
          </div>

          {/* Vehicle Title */}
          <Link href={`/cars/${car.id}`} className="group-hover:text-primary transition-colors block">
            <h3 className="text-lg font-bold text-on-surface line-clamp-1">
              {car.title}
            </h3>
          </Link>

          {/* Price XL Label */}
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              {formatPrice(car.price)}
            </span>
            <span className="text-xs font-semibold text-outline">
              USD
            </span>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs font-semibold text-on-surface-variant">
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg">
            <Gauge className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg">
            <Fuel className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{car.fuel_type}</span>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <Link
            href={`/cars/${car.id}`}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-primary bg-surface-container hover:bg-primary hover:text-white py-3 px-4 rounded-xl transition-all shadow-sm group/btn"
          >
            <span>View Full Details</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
