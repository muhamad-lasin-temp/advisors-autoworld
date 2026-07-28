import { supabase, isSupabaseConfigured } from './supabase';
import { Car, CarFormData } from '@/types/car';

export async function fetchAllCars(page = 1, limit = 50): Promise<Car[]> {
  if (!isSupabaseConfigured) {
    console.warn('[Production Warning] Supabase client is not initialized with environment variables.');
    return [];
  }

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('[Supabase Error] fetchAllCars failed:', error.message);
      return [];
    }

    return (data as Car[]) || [];
  } catch (err) {
    console.error('[Supabase Exception] fetchAllCars error:', err);
    return [];
  }
}

export async function fetchCarById(id: string): Promise<Car | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`[Supabase Error] fetchCarById (${id}) failed:`, error.message);
      return null;
    }

    return (data as Car) || null;
  } catch (err) {
    console.error(`[Supabase Exception] fetchCarById (${id}) error:`, err);
    return null;
  }
}

export async function createCar(formData: CarFormData): Promise<Car | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase
    .from('cars')
    .insert([
      {
        title: formData.title,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        body_type: formData.body_type,
        color: formData.color,
        description: formData.description,
        images: formData.images,
        is_sold: formData.is_sold,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('[Supabase Error] createCar failed:', error.message);
    throw new Error(error.message);
  }

  return data as Car;
}

export async function updateCar(id: string, formData: Partial<CarFormData>): Promise<Car | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase configuration missing.');
  }

  const { data, error } = await supabase
    .from('cars')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[Supabase Error] updateCar (${id}) failed:`, error.message);
    throw new Error(error.message);
  }

  return data as Car;
}

export async function toggleCarSoldStatus(id: string, currentStatus: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const newStatus = !currentStatus;
  const { error } = await supabase
    .from('cars')
    .update({ is_sold: newStatus })
    .eq('id', id);

  if (error) {
    console.error(`[Supabase Error] toggleCarSoldStatus (${id}) failed:`, error.message);
    return false;
  }

  return true;
}

export async function deleteCar(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[Supabase Error] deleteCar (${id}) failed:`, error.message);
    return false;
  }

  return true;
}

// Client-side image compression helper (resizes heavy 5MB photos down to ~150KB WebP)
export async function compressImageFile(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file);
            },
            'image/webp',
            quality
          );
        } else {
          resolve(file);
        }
      };
    };
  });
}

export async function uploadCarImage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase storage is not configured.');
  }

  // Compress image to WebP before uploading
  const compressedBlob = await compressImageFile(file, 1200, 0.8);
  const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
    type: 'image/webp',
  });

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
  const filePath = `inventory/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('car-images')
    .upload(filePath, compressedFile, { cacheControl: '31536000', upsert: true });

  if (uploadError) {
    console.error('[Supabase Storage Error] uploadCarImage failed:', uploadError.message);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('Failed to retrieve public URL for uploaded image.');
  }

  return data.publicUrl;
}
