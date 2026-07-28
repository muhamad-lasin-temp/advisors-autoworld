'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring platform (Sentry, Axiom, Datadog, etc.)
    console.error('[Production Error Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-level-2 space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Something Went Wrong
          </h2>
          <p className="text-sm text-on-surface-variant font-medium">
            We encountered an unexpected error processing your request. Our technical team has been notified.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-outline bg-surface-container-low py-1 px-3 rounded-md inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white font-bold text-xs py-3 px-6 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-bold text-xs py-3 px-6 rounded-xl border border-outline-variant/40 hover:bg-surface-container transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
