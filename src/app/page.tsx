'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllCars } from '@/lib/cars-service';
import { Car, CarFilters } from '@/types/car';
import { filterCars } from '@/lib/utils';
import { SearchFilterBar } from '@/components/showcase/SearchFilterBar';
import { CarGrid } from '@/components/showcase/CarGrid';
import { ContactModal } from '@/components/showcase/ContactModal';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarForInquire, setSelectedCarForInquire] = useState<Car | null>(null);

  const [filters, setFilters] = useState<CarFilters>({
    query: '',
    make: 'all',
    transmission: 'all',
    fuelType: 'all',
    bodyType: 'all',
    status: 'all',
    sortBy: 'newest',
  });

  // Sync with URL query params on client safely without useSearchParams SSR bailing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get('status') as 'available' | 'sold' | null;
      if (statusParam && (statusParam === 'available' || statusParam === 'sold')) {
        setFilters((prev) => ({ ...prev, status: statusParam }));
      }
    }
  }, []);

  // Sync with live inventory from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAllCars();
      setCars(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  // Extract unique available makes for filter dropdown
  const availableMakes = useMemo(() => {
    const makes = Array.from(new Set(cars.map((c) => c.make))).sort();
    return makes;
  }, [cars]);

  // Filter cars based on state
  const filteredCars = useMemo(() => {
    return filterCars(cars, filters);
  }, [cars, filters]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      make: 'all',
      transmission: 'all',
      fuelType: 'all',
      bodyType: 'all',
      status: 'all',
      sortBy: 'newest',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner (Renders instantly in static HTML) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-background to-background pt-12 pb-14 border-b border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Precision Mobility Marketplace</span>
            </div>

            {/* Title (LCP Element - Renders instantly) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.1]">
              Verified Pre-Owned Luxury & Performance
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl font-normal">
              Explore structural integrity, full service histories, and transparent specs for handpicked sports cars, luxury sedans, and executive SUVs.
            </p>

            {/* Key Value Points */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-on-surface">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>100% Inspected & Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Direct Dealer Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Inventory Section */}
      <section id="inventory" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Controls Bar */}
        <SearchFilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableMakes={availableMakes}
          totalResults={filteredCars.length}
        />

        {/* Car Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-outline uppercase tracking-wider">
              Fetching Vehicle Inventory...
            </p>
          </div>
        ) : (
          <CarGrid
            cars={filteredCars}
            onResetFilters={handleResetFilters}
            onInquireCar={(car) => setSelectedCarForInquire(car)}
          />
        )}
      </section>

      {/* Inquire Modal */}
      <ContactModal
        car={selectedCarForInquire}
        isOpen={Boolean(selectedCarForInquire)}
        onClose={() => setSelectedCarForInquire(null)}
      />
    </div>
  );
}
