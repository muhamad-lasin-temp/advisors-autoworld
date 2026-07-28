import { Car, CarFilters } from '@/types/car';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMileage(miles: number): string {
  return `${new Intl.NumberFormat('en-IN').format(miles)} km`;
}

export function filterCars(cars: Car[], filters: CarFilters): Car[] {
  return cars.filter((car) => {
    // Text search query (title, make, model, color)
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const matchText = `${car.title} ${car.make} ${car.model} ${car.color || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Make filter
    if (filters.make && filters.make !== 'all') {
      if (car.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    }

    // Transmission filter
    if (filters.transmission && filters.transmission !== 'all') {
      if (car.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false;
    }

    // Fuel Type filter
    if (filters.fuelType && filters.fuelType !== 'all') {
      if (car.fuel_type.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
    }

    // Body Type filter
    if (filters.bodyType && filters.bodyType !== 'all') {
      if (car.body_type?.toLowerCase() !== filters.bodyType.toLowerCase()) return false;
    }

    // Min / Max Price
    if (filters.minPrice !== undefined && car.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && car.price > filters.maxPrice) return false;

    // Min / Max Year
    if (filters.minYear !== undefined && car.year < filters.minYear) return false;
    if (filters.maxYear !== undefined && car.year > filters.maxYear) return false;

    // Status filter
    if (filters.status === 'available' && car.is_sold) return false;
    if (filters.status === 'sold' && !car.is_sold) return false;

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'mileage-asc':
        return a.mileage - b.mileage;
      case 'year-desc':
        return b.year - a.year;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
}
