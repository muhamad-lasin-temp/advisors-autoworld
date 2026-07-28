'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Loader2, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { Car, CarFormData } from '@/types/car';
import { uploadCarImage } from '@/lib/cars-service';
import { CarFormDataSchema } from '@/lib/validations/car-schema';

interface CarFormModalProps {
  car?: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormData) => Promise<void>;
}

// Rule 7: SSRF Protection helper to validate public image URLs
const isValidPublicImageUrl = (urlString: string): boolean => {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const hostname = parsed.hostname.toLowerCase();
    
    // Block internal/private IP spaces & loopbacks
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export function CarFormModal({ car, isOpen, onClose, onSubmit }: CarFormModalProps) {
  const [formData, setFormData] = useState<CarFormData>({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 50000,
    mileage: 10000,
    transmission: 'Automatic',
    fuel_type: 'Gasoline',
    body_type: 'Coupe',
    color: '',
    description: '',
    images: [],
    is_sold: false,
  });

  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        transmission: car.transmission,
        fuel_type: car.fuel_type,
        body_type: car.body_type || 'Coupe',
        color: car.color || '',
        description: car.description || '',
        images: car.images || [],
        is_sold: car.is_sold,
      });
    } else {
      setFormData({
        title: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 45000,
        mileage: 12000,
        transmission: 'Automatic',
        fuel_type: 'Gasoline',
        body_type: 'Sedan',
        color: '',
        description: '',
        images: [],
        is_sold: false,
      });
    }
    setErrorMsg('');
  }, [car, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'mileage') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: numericValue === '' ? 0 : Number(numericValue) }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Auto generate title if title isn't custom
    if (name === 'make' || name === 'model' || name === 'year') {
      const year = name === 'year' ? value : formData.year;
      const make = name === 'make' ? value : formData.make;
      const model = name === 'model' ? value : formData.model;
      if (make && model) {
        setFormData((prev) => ({ ...prev, title: `${year} ${make} ${model}`.trim() }));
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (Rule 6)
      const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

      // Perform validation and parallel upload using Promise.all
      const uploadPromises = Array.from(files).map(async (file) => {
        // Rule 6: Validate file size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} exceeds maximum 10MB size limit.`);
        }

        // Rule 6: Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
          throw new Error(`File ${file.name} must be a valid image format (JPEG, PNG, WebP, AVIF).`);
        }

        return await uploadCarImage(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred during file upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrlImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;

    // Security Rule 10: SSRF URL Protection
    if (!isValidPublicImageUrl(url)) {
      setErrorMsg('Invalid or restricted image URL. External links must use http/https and cannot point to internal/private IP spaces.');
      return;
    }

    setErrorMsg('');
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Security Rule 2: Schema Enforcement using Zod
    const validationResult = CarFormDataSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Invalid input parameter.';
      setErrorMsg(firstError);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(validationResult.data);
      onClose();
    } catch (err: any) {
      // Security Rule 5: Prevent information leakage
      setErrorMsg('An unexpected server error occurred while saving. Please check input parameters and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-inverse-surface text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-inverse-primary">
              Admin Portal
            </span>
            <h3 className="text-xl font-bold">
              {car ? 'Edit Car Listing' : 'Add New Vehicle to Inventory'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl"
            suppressHydrationWarning
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-error text-xs font-bold rounded-xl border border-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Make *
              </label>
              <input
                type="text"
                name="make"
                required
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Porsche"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 911 Carrera S"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Year *
              </label>
              <input
                type="number"
                name="year"
                required
                min={1950}
                max={2030}
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
              Full Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 2023 Porsche 911 Carrera S"
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              suppressHydrationWarning
            />
          </div>

          {/* Pricing & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Price (₹ INR) *
              </label>
              <input
                type="text"
                name="price"
                required
                value={formData.price === 0 ? '' : formData.price}
                onChange={handleChange}
                placeholder="e.g. 1500000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Mileage (KM) *
              </label>
              <input
                type="text"
                name="mileage"
                required
                value={formData.mileage === 0 ? '' : formData.mileage}
                onChange={handleChange}
                placeholder="e.g. 45000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Exterior Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="GT Silver Metallic"
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.15rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer"
                suppressHydrationWarning
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Fuel / Powertrain
              </label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.15rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer"
                suppressHydrationWarning
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Mild Hybrid">Mild Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                Body Style
              </label>
              <select
                name="body_type"
                value={formData.body_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.15rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer"
                suppressHydrationWarning
              >
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
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
              Vehicle Description & Highlights
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe condition, optional features, service history..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <input
              type="checkbox"
              id="is_sold"
              name="is_sold"
              checked={formData.is_sold}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              suppressHydrationWarning
            />
            <label htmlFor="is_sold" className="text-xs font-bold text-on-surface cursor-pointer select-none">
              Mark vehicle as SOLD (Archives vehicle from active search results)
            </label>
          </div>

          {/* Supabase Storage Image Upload Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">
                Vehicle Photos & Media (Supabase Storage: car-images)
              </label>
              <span className="text-[11px] text-slate-500">
                {formData.images.length} photo{formData.images.length === 1 ? '' : 's'} added
              </span>
            </div>

            {/* Upload Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Uploader */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-outline-variant/60 hover:border-primary rounded-2xl cursor-pointer bg-surface-container-low transition-colors text-center">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                ) : (
                  <Upload className="w-6 h-6 text-primary mb-1" />
                )}
                <span className="text-xs font-bold text-on-surface">
                  {uploading ? 'Compressing & Uploading...' : 'Click to Upload Images'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Files compressed to lightweight WebP before cloud upload
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {/* Paste URL */}
              <div className="flex flex-col justify-between p-4 border border-outline-variant/40 rounded-2xl bg-white">
                <div>
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1 mb-1">
                    <LinkIcon className="w-3.5 h-3.5 text-primary" />
                    Or Add Public Image URL
                  </span>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  disabled={!newImageUrl.trim()}
                  className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-primary bg-surface-container hover:bg-primary hover:text-white py-2 rounded-lg transition-colors"
                  suppressHydrationWarning
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Image URL
                </button>
              </div>
            </div>

            {/* Images Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden group border border-slate-200">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                      suppressHydrationWarning
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-slate-100 rounded-xl transition-colors"
              suppressHydrationWarning
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
              suppressHydrationWarning
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <span>{car ? 'Save Changes' : 'Publish Listing'}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
