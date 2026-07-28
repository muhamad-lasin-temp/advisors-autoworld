import React from 'react';
import { Car } from '@/types/car';
import { formatMileage } from '@/lib/utils';

interface TechSpecsGridProps {
  car: Car;
}

export function TechSpecsGrid({ car }: TechSpecsGridProps) {
  const specs = [
    { label: 'Make', value: car.make },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year.toString() },
    { label: 'Mileage', value: formatMileage(car.mileage) },
    { label: 'Transmission', value: car.transmission },
    { label: 'Fuel Type', value: car.fuel_type },
    { label: 'Body Style', value: car.body_type || 'N/A' },
    { label: 'Exterior Color', value: car.color || 'Factory Specification' },
    { label: 'Availability', value: car.is_sold ? 'Sold' : 'In Stock' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-level-1 border border-outline-variant/30">
      <h3 className="text-sm font-bold uppercase tracking-wider text-outline mb-4">
        Technical Specifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {specs.map((spec, index) => (
          <div key={index} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-xs font-semibold text-on-surface-variant">
              {spec.label}
            </span>
            <span className="text-sm font-bold text-on-surface">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
