'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  isSold: boolean;
}

export function ImageGallery({ images, title, isSold }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const displayImages = images && images.length > 0
    ? images 
    : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'];

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image Viewer */}
      <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 group shadow-level-1 border border-outline-variant/30">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${title} - image ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className={`object-cover transition-all duration-300 ${isSold ? 'grayscale-[30%]' : ''}`}
        />

        {/* Lightbox trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-2.5 rounded-xl backdrop-blur-md transition-all"
          title="Full Screen View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next Arrows - always visible on touch devices */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/60 text-white text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-md">
          {selectedIndex + 1} / {displayImages.length} Photos
        </div>
      </div>

      {/* Thumbnails Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-[16/10] w-16 sm:w-24 md:w-28 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                idx === selectedIndex 
                  ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' 
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-slate-300 p-2 rounded-full bg-white/10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-[16/10]">
            <Image
              src={displayImages[selectedIndex]}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-4 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-4 rounded-full"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
