import { MetadataRoute } from 'next';
import { fetchAllCars } from '@/lib/cars-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://advisorsautoworld.com';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic car listing pages
  try {
    const cars = await fetchAllCars();
    const carRoutes: MetadataRoute.Sitemap = cars.map((car) => ({
      url: `${baseUrl}/cars/${car.id}`,
      lastModified: car.created_at ? new Date(car.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...routes, ...carRoutes];
  } catch {
    return routes;
  }
}
