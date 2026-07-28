import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
          <Car className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Vehicle or Page Not Found
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            The page or car listing you are looking for does not exist, has been sold, or was moved to our archive.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white font-bold text-xs py-3 px-6 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Active Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
