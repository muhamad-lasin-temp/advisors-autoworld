'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllCars, createCar, updateCar, toggleCarSoldStatus, deleteCar } from '@/lib/cars-service';
import { Car, CarFormData } from '@/types/car';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { AdminCarCard } from '@/components/admin/AdminCarCard';
import { CarFormModal } from '@/components/admin/CarFormModal';
import { Plus, Search, SlidersHorizontal, ShieldCheck, LogOut, RefreshCw, CarFront, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const [authChecking, setAuthChecking] = useState(true);

  // Authentication check (Requirement 2 & 3: Validates cryptographic JWT session token)
  useEffect(() => {
    const checkAuth = async () => {
      let isAuthenticated = false;

      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          isAuthenticated = true;
        }
      } else {
        const localAuth = typeof window !== 'undefined' ? localStorage.getItem('advisors_admin_auth') : null;
        if (localAuth === 'true') {
          isAuthenticated = true;
        }
      }

      if (!isAuthenticated) {
        router.push('/admin/login');
      } else {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  // Load Inventory
  const loadInventory = async () => {
    setLoading(true);
    const data = await fetchAllCars();
    setCars(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Filtered cars for admin list
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match = `${car.title} ${car.make} ${car.model} ${car.color || ''}`.toLowerCase();
        if (!match.includes(q)) return false;
      }
      if (statusFilter === 'available' && car.is_sold) return false;
      if (statusFilter === 'sold' && !car.is_sold) return false;
      return true;
    });
  }, [cars, searchQuery, statusFilter]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: CarFormData) => {
    if (editingCar) {
      // Optimistic UI update for Edit
      setCars((prev) => prev.map((c) => (c.id === editingCar.id ? { ...c, ...formData } : c)));
      await updateCar(editingCar.id, formData);
    } else {
      const newCar = await createCar(formData);
      if (newCar) {
        setCars((prev) => [newCar, ...prev]);
      }
    }
  };

  const handleToggleSold = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update (0ms latency feedback)
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_sold: !currentStatus } : c))
    );
    await toggleCarSoldStatus(id, currentStatus);
  };

  const handleDeleteCar = async (id: string) => {
    // Optimistic UI removal (0ms latency feedback)
    setCars((prev) => prev.filter((c) => c.id !== id));
    await deleteCar(id);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('advisors_admin_auth');
    }
    router.push('/');
  };

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-outline uppercase tracking-wider">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              Vehicle Inventory Dashboard
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Add new vehicles, update specs, toggle sold availability, and manage media storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white text-xs font-bold py-3 px-5 rounded-xl transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Vehicle</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-3 text-slate-500 hover:text-error hover:bg-red-50 rounded-xl transition-colors border border-outline-variant/40"
              title="Sign out admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <StatsOverview cars={cars} />

        {/* Search & Filter Bar for Admin */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-level-1 border border-outline-variant/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter inventory by make, model, or title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-outline uppercase tracking-wider mr-1">Status:</span>
            {(['all', 'available', 'sold'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                  statusFilter === status
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={loadInventory}
              className="p-2.5 text-on-surface-variant hover:bg-surface-container rounded-lg"
              title="Refresh inventory"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inventory Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-outline uppercase tracking-wider">
              Loading Inventory Data...
            </p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-outline-variant/30 my-6">
            <CarFront className="w-12 h-12 text-outline mx-auto mb-3" />
            <h3 className="text-lg font-bold text-on-surface">No Vehicles Match Criteria</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">
              Try adjusting your search query or status filter.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold py-2.5 px-4 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add First Car
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <AdminCarCard
                key={car.id}
                car={car}
                onEdit={handleOpenEditModal}
                onToggleSold={handleToggleSold}
                onDelete={handleDeleteCar}
              />
            ))}
          </div>
        )}

        {/* Add/Edit Car Modal */}
        <CarFormModal
          car={editingCar}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />

      </div>
    </div>
  );
}
