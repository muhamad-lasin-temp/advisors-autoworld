import React from 'react';
import { Car } from '@/types/car';
import { formatPrice } from '@/lib/utils';
import { CarFront, CheckCircle2, DollarSign, TrendingUp, Tag } from 'lucide-react';

interface StatsOverviewProps {
  cars: Car[];
}

export function StatsOverview({ cars }: StatsOverviewProps) {
  const totalCount = cars.length;
  const activeCars = cars.filter((c) => !c.is_sold);
  const soldCars = cars.filter((c) => c.is_sold);
  
  const totalValue = cars.reduce((acc, car) => acc + (car.price || 0), 0);
  const activeValue = activeCars.reduce((acc, car) => acc + (car.price || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      
      {/* Total Vehicles */}
      <div className="bg-white p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 transition-all hover:shadow-level-2">
        <div className="flex justify-between items-start mb-3">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <CarFront className="w-5 h-5" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-outline tracking-wider">
              Total Inventory
            </span>
            <span className="block text-2xl font-black text-on-surface">
              {totalCount}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          <span>All recorded listings</span>
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
            Updated live
          </span>
        </div>
      </div>

      {/* Active Vehicles */}
      <div className="bg-white p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 transition-all hover:shadow-level-2">
        <div className="flex justify-between items-start mb-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-outline tracking-wider">
              Available Cars
            </span>
            <span className="block text-2xl font-black text-on-surface">
              {activeCars.length}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          <span>Ready for sale</span>
          <span className="text-primary font-bold">{formatPrice(activeValue)}</span>
        </div>
      </div>

      {/* Sold Vehicles */}
      <div className="bg-white p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 transition-all hover:shadow-level-2">
        <div className="flex justify-between items-start mb-3">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-outline tracking-wider">
              Sold History
            </span>
            <span className="block text-2xl font-black text-on-surface">
              {soldCars.length}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
          <span>Archived sales</span>
          <span className="text-indigo-600 font-bold">
            {totalCount > 0 ? Math.round((soldCars.length / totalCount) * 100) : 0}% Conversion
          </span>
        </div>
      </div>

      {/* Total Valuation */}
      <div className="bg-white p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 transition-all hover:shadow-level-2">
        <div className="flex justify-between items-start mb-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-outline tracking-wider">
              Total Portfolio Value
            </span>
            <span className="block text-2xl font-black text-primary">
              {formatPrice(totalValue)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 pt-2 border-t border-slate-100">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Full asset valuation</span>
        </div>
      </div>

    </div>
  );
}
