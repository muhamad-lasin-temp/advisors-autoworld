import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchCarById, fetchAllCars } from '@/lib/cars-service';
import { CarDetailClient } from './CarDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const car = await fetchCarById(resolvedParams.id);

  if (!car) {
    return {
      title: 'Vehicle Not Found | Advisors Autoworld',
      description: 'The requested luxury or pre-owned vehicle listing could not be found.',
    };
  }

  const title = `${car.year} ${car.title} - ₹${Number(car.price).toLocaleString('en-IN')} | Advisors Autoworld`;
  const description = car.description
    ? car.description.slice(0, 160)
    : `Explore this verified pre-owned ${car.year} ${car.make} ${car.model} with ${car.mileage.toLocaleString()} miles. Available at Advisors Autoworld.`;

  const mainImage = car.images && car.images.length > 0 ? car.images[0] : '/og-image.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: car.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImage],
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const car = await fetchCarById(resolvedParams.id);

  if (!car) {
    notFound();
  }

  const allCars = await fetchAllCars();
  const similarCars = allCars
    .filter((c) => c.id !== car.id && (c.make === car.make || c.body_type === car.body_type))
    .slice(0, 3);

  // Schema.org Car JSON-LD for rich Google Search Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: car.title,
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    vehicleModelDate: car.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'SMI',
    },
    vehicleTransmission: car.transmission,
    fuelType: car.fuel_type,
    color: car.color,
    description: car.description,
    image: car.images,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'INR',
      availability: car.is_sold
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarDetailClient car={car} similarCars={similarCars} />
    </>
  );
}
