'use client';

import React from 'react';
import { CarCard } from './CarCard';
import { Car } from '@/types/car';
import { Car as CarIcon, RotateCcw } from 'lucide-react';

interface CarGridProps {
  cars: Car[];
  onResetFilters: () => void;
  onInquireCar?: (car: Car) => void;
}

export function CarGrid({ cars, onResetFilters, onInquireCar }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-outline-variant/30 shadow-level-1 my-8 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto mb-4">
          <CarIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">
          No Vehicles Match Your Criteria
        </h3>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
          We couldn't find any vehicles matching your search terms or filter selections. Try relaxing your filters or search keywords.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-sm"
          suppressHydrationWarning
        >
          <RotateCcw className="w-4 h-4" />
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {cars.map((car, index) => (
        <CarCard
          key={car.id}
          car={car}
          priority={index < 3}
          onInquire={onInquireCar}
        />
      ))}
    </div>
  );
}
