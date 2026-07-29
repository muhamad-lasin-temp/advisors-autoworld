'use client';

import React, { useId } from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  className = '',
}: LogoProps) {
  const isLight = variant === 'light';

  // Sizing definitions matching text cap height
  const iconSizes = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  };

  const uid = useId();
  const ids = {
    silver: `wingSilver-${uid}`,
    cobalt: `wingCobalt-${uid}`,
    gold: `goldEdge-${uid}`,
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Luxury Soaring Speed Wings Emblem SVG */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 140 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Platinum Metallic Gradient */}
            <linearGradient id={ids.silver} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Deep Cobalt Accent Gradient */}
            <linearGradient id={ids.cobalt} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#00288e" />
            </linearGradient>

            {/* Gold Edge Highlight */}
            <linearGradient id={ids.gold} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Left Wing Feathers (Sweeping Aerodynamic Wings) */}
          <path
            d="M 64 34 L 12 18 C 22 28, 38 34, 58 40 Z"
            fill={`url(#${ids.silver})`}
          />
          <path
            d="M 62 40 L 18 30 C 28 38, 42 44, 58 48 Z"
            fill={`url(#${ids.cobalt})`}
          />
          <path
            d="M 60 48 L 26 42 C 34 48, 46 52, 58 54 Z"
            fill={`url(#${ids.silver})`}
          />

          {/* Right Wing Feathers (Sweeping Aerodynamic Wings) */}
          <path
            d="M 76 34 L 128 18 C 118 28, 102 34, 82 40 Z"
            fill={`url(#${ids.silver})`}
          />
          <path
            d="M 78 40 L 122 30 C 112 38, 98 44, 82 48 Z"
            fill={`url(#${ids.cobalt})`}
          />
          <path
            d="M 80 48 L 114 42 C 106 48, 94 52, 82 54 Z"
            fill={`url(#${ids.silver})`}
          />

          {/* Center Monogram Shield Badge */}
          <path
            d="M 70 14 L 86 38 L 70 66 L 54 38 Z"
            fill="#0f172a"
            stroke={`url(#${ids.silver})`}
            strokeWidth="2.5"
          />

          {/* Gold Shield Trim Line */}
          <path
            d="M 70 19 L 82 38 L 70 61 L 58 38 Z"
            stroke={`url(#${ids.gold})`}
            strokeWidth="1.2"
            fill="none"
          />

          {/* Centered 'A' Supercar Apex Monogram inside Shield */}
          <path
            d="M 70 24 L 78 48 L 72 48 L 70 42 L 68 42 L 66 48 L 62 48 Z M 70 30 L 68 37 L 72 37 Z"
            fill={`url(#${ids.silver})`}
          />
        </svg>
      </div>

      {/* Brand Text Header & Subtitle */}
      <div className="flex flex-col justify-center shrink-0">
        <div className={`font-black tracking-tight leading-none flex items-center gap-1.5 whitespace-nowrap ${titleSizes[size]} ${isLight ? 'text-white' : 'text-slate-900'}`}>
          <span className="tracking-wide">ADVISORS</span>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm font-black">
            AUTOWORLD
          </span>
        </div>

        {showSubtitle && (
          <div className={`font-extrabold uppercase tracking-widest leading-tight mt-1 flex items-center gap-1 whitespace-nowrap ${subtitleSizes[size]} ${isLight ? 'text-blue-300' : 'text-slate-500'}`}>
            <span>Precision Mobility</span>
            <span className="inline-block w-1 h-1 rounded-full bg-blue-500" />
            <span>Marketplace</span>
          </div>
        )}
      </div>
    </div>
  );
}
