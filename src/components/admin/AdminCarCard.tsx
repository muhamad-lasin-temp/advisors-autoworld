'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Car } from '@/types/car';
import { formatPrice, formatMileage } from '@/lib/utils';
import { Edit2, Trash2, CheckCircle2, RefreshCw, ExternalLink, Gauge, Fuel } from 'lucide-react';

interface AdminCarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onToggleSold: (id: string, currentStatus: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function AdminCarCard({ car, onEdit, onToggleSold, onDelete }: AdminCarCardProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggleSold(car.id, car.is_sold);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(car.id);
    } finally {
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const imageSrc = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-level-1 border border-outline-variant/30 flex flex-col justify-between transition-all hover:shadow-level-2">
      
      {/* Top Image & Overlay */}
      <div className="relative aspect-[16/10] w-full bg-slate-100">
        <img
          src={imageSrc}
          alt={car.title}
          className={`w-full h-full object-cover ${car.is_sold ? 'grayscale-[50%] opacity-90' : ''}`}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {car.is_sold ? (
            <span className="bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Active Listing
            </span>
          )}
          <span className="bg-white/90 text-on-surface text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {car.year}
          </span>
        </div>

        <Link
          href={`/cars/${car.id}`}
          target="_blank"
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-on-surface rounded-xl shadow-sm transition-colors"
          title="View Public Listing"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold text-outline uppercase tracking-wider mb-1">
            {car.make} • {car.transmission}
          </div>
          <h4 className="text-base font-bold text-on-surface line-clamp-1">
            {car.title}
          </h4>
          <div className="text-xl font-black text-primary mt-1">
            {formatPrice(car.price)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-on-surface-variant pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
            <Gauge className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
            <Fuel className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{car.fuel_type}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          
          <div className="flex items-center gap-2">
            {/* Toggle Sold Status */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                car.is_sold
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${toggling ? 'animate-spin' : ''}`} />
              <span>{car.is_sold ? 'Mark Available' : 'Mark Sold'}</span>
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(car)}
              className="p-2.5 bg-surface-container hover:bg-primary hover:text-white text-primary rounded-xl transition-colors"
              title="Edit car details"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Delete Trigger */}
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-error rounded-xl transition-colors"
              title="Delete car listing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Delete Confirmation Box */}
          {showConfirmDelete && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2 animate-in fade-in">
              <p className="text-[11px] font-bold text-red-900">
                Confirm deleting this car listing?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 bg-slate-200 text-slate-800 text-xs font-bold py-1.5 rounded-lg hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
