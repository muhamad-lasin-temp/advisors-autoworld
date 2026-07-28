export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric' | 'Mild Hybrid';
export type BodyType = 'Sedan' | 'SUV' | 'Coupe' | 'Hatchback' | 'Truck' | 'Convertible' | 'Wagon' | 'MPV';

export interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  body_type: BodyType;
  color?: string;
  description?: string;
  images: string[];
  is_sold: boolean;
  created_at: string;
}

export interface CarFilters {
  query: string;
  make: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission: string;
  fuelType: string;
  bodyType: string;
  status: 'all' | 'available' | 'sold';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc' | 'year-desc';
}

export interface CarFormData {
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  body_type: BodyType;
  color: string;
  description: string;
  images: string[];
  is_sold: boolean;
}
