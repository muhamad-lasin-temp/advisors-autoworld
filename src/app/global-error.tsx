'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">Critical Application Error</h2>
          <p className="text-sm text-slate-400">
            A system error occurred at the root layout level.
          </p>
          <button
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
