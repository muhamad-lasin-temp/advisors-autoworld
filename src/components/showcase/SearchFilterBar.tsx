'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CarFilters } from '@/types/car';

interface SearchFilterBarProps {
  filters: CarFilters;
  onFilterChange: (filters: CarFilters) => void;
  availableMakes: string[];
  totalResults: number;
}

const SELECT_CLASS_PRIMARY = "w-full px-4 py-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white focus:bg-white font-semibold text-xs text-slate-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.15rem] bg-[right_0.85rem_center] bg-no-repeat pr-10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer";

const SELECT_CLASS_SECONDARY = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white focus:bg-white font-semibold text-xs text-slate-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.15rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer";

export function SearchFilterBar({
  filters,
  onFilterChange,
  availableMakes,
  totalResults,
}: SearchFilterBarProps) {
  const [showExpandedFilters, setShowExpandedFilters] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value });
  };

  const handleSelectChange = (key: keyof CarFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      query: '',
      make: 'all',
      transmission: 'all',
      fuelType: 'all',
      bodyType: 'all',
      status: 'all',
      sortBy: 'newest',
    });
  };

  const activeFilterCount = [
    filters.query !== '',
    filters.make !== 'all',
    filters.transmission !== 'all',
    filters.fuelType !== 'all',
    filters.bodyType !== 'all',
    filters.status !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-level-1 border border-outline-variant/30 p-3 sm:p-4 md:p-6 mb-6 sm:mb-8 transition-all">
      {/* Top Search & Action Line */}
      <div className="flex flex-col gap-3">
        {/* Search + Filters button row */}
        <div className="flex items-stretch gap-2 sm:gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={filters.query}
              onChange={handleQueryChange}
              placeholder="Search make, model, year..."
              className="w-full pl-9 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-slate-200/90 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-medium text-on-surface transition-all placeholder:text-outline shadow-sm"
              suppressHydrationWarning
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, query: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-outline hover:text-on-surface bg-surface-container px-2 py-0.5 rounded-md"
                suppressHydrationWarning
              >
                Clear
              </button>
            )}
          </div>

          {/* Toggle Filters Button */}
          <button
            type="button"
            onClick={() => setShowExpandedFilters(!showExpandedFilters)}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl font-bold text-xs transition-all border shrink-0 ${
              showExpandedFilters || activeFilterCount > 0
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface border-slate-200/90 hover:bg-surface-container-low'
            }`}
            suppressHydrationWarning
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Make + Sort row */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Quick Make Dropdown */}
          <select
            value={filters.make}
            onChange={(e) => handleSelectChange('make', e.target.value)}
            className={SELECT_CLASS_PRIMARY}
            suppressHydrationWarning
          >
            <option value="all">All Makes</option>
            {availableMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleSelectChange('sortBy', e.target.value)}
            className={SELECT_CLASS_PRIMARY}
            suppressHydrationWarning
          >
            <option value="newest">Newly Listed</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="mileage-asc">Mileage: Lowest</option>
            <option value="year-desc">Year: Newest</option>
          </select>
        </div>
      </div>

      {/* Quick Status Segment Buttons */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-bold text-outline uppercase tracking-wider mr-1">Status:</span>
          {(['all', 'available', 'sold'] as const).map((statusOption) => (
            <button
              key={statusOption}
              type="button"
              onClick={() => handleSelectChange('status', statusOption)}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all capitalize cursor-pointer ${
                filters.status === statusOption
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              suppressHydrationWarning
            >
              {statusOption === 'all' ? 'All' : statusOption === 'available' ? 'Available' : 'Sold'}
            </button>
          ))}
        </div>

        <div className="text-[10px] sm:text-xs font-bold text-on-surface-variant whitespace-nowrap">
          <span className="text-primary font-black">{totalResults}</span> vehicle{totalResults === 1 ? '' : 's'}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {showExpandedFilters && (
        <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-200">
          
          {/* Transmission Filter */}
          <div>
            <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">
              Transmission
            </label>
            <select
              value={filters.transmission}
              onChange={(e) => handleSelectChange('transmission', e.target.value)}
              className={SELECT_CLASS_SECONDARY}
              suppressHydrationWarning
            >
              <option value="all">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Fuel Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">
              Fuel / Powertrain
            </label>
            <select
              value={filters.fuelType}
              onChange={(e) => handleSelectChange('fuelType', e.target.value)}
              className={SELECT_CLASS_SECONDARY}
              suppressHydrationWarning
            >
              <option value="all">All Powertrains</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="Mild Hybrid">Mild Hybrid</option>
            </select>
          </div>

          {/* Body Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">
              Body Style
            </label>
            <select
              value={filters.bodyType}
              onChange={(e) => handleSelectChange('bodyType', e.target.value)}
              className={SELECT_CLASS_SECONDARY}
              suppressHydrationWarning
            >
              <option value="all">All Body Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="MPV">MPV</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Truck">Truck</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
            </select>
          </div>

          {/* Action / Reset */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFilterCount > 0
                  ? 'bg-red-50 text-error hover:bg-red-100 border border-red-200 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              suppressHydrationWarning
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
