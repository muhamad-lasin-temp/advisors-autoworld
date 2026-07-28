import { z } from 'zod';

export const CarFormDataSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(150, 'Title cannot exceed 150 characters').trim(),
  make: z.string().min(1, 'Make is required').max(50, 'Make cannot exceed 50 characters').trim(),
  model: z.string().min(1, 'Model is required').max(50, 'Model cannot exceed 50 characters').trim(),
  year: z.number().int().min(1900, 'Year must be 1900 or later').max(new Date().getFullYear() + 2, 'Invalid model year'),
  price: z.number().min(0, 'Price must be a positive number').max(10000000, 'Price exceeds maximum threshold'),
  mileage: z.number().int().min(0, 'Mileage cannot be negative').max(2000000, 'Mileage exceeds maximum threshold'),
  transmission: z.enum(['Automatic', 'Manual']),
  fuel_type: z.enum(['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Mild Hybrid']),
  body_type: z.enum(['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck', 'Convertible', 'Wagon', 'MPV']),
  color: z.string().max(50, 'Color cannot exceed 50 characters').optional().default(''),
  description: z.string().max(3000, 'Description cannot exceed 3000 characters').optional().default(''),
  images: z.array(z.string().url('Invalid image URL')).max(20, 'Maximum 20 images allowed'),
  is_sold: z.boolean().default(false),
});

export const ContactInquirySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name cannot exceed 100 characters').trim(),
  email: z.string().email('Invalid email address').max(150, 'Email cannot exceed 150 characters').trim(),
  phone: z.string().max(30, 'Phone number cannot exceed 30 characters').optional().default(''),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional().default(''),
  carId: z.string().optional(),
  carTitle: z.string().optional(),
});

export type ValidatedCarFormData = z.infer<typeof CarFormDataSchema>;
export type ValidatedContactInquiry = z.infer<typeof ContactInquirySchema>;
