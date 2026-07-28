-- ========================================================
-- USED CAR SHOWCASE & ADMIN MANAGEMENT APP (SUPABASE SCHEMA)
-- ========================================================

-- 1. Create Cars Table
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  make text not null,
  model text not null,
  year integer not null,
  price numeric not null,
  mileage integer not null,
  transmission text not null, -- 'Automatic' | 'Manual'
  fuel_type text not null,     -- 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric'
  body_type text,             -- 'Sedan' | 'SUV' | 'Coupe' | 'Hatchback' | 'Truck'
  color text,
  description text,
  images text[] default '{}',  -- Array of public URLs from Supabase Storage or external URLs
  is_sold boolean default false,
  created_by_user_id uuid default auth.uid(), -- Multi-tenant & Owner verification column
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.cars enable row level security;

-- 3. RLS Policies (IDOR & Multi-Tenant Boundaries)
-- Public can view active listings
drop policy if exists "Public cars viewable" on public.cars;
create policy "Public cars viewable" on public.cars for select using (true);

-- Explicit Role Privileges for PostgREST Data API
grant usage on schema public to anon, authenticated;
grant select on public.cars to anon, authenticated;
grant insert, update, delete on public.cars to authenticated;
grant all on public.cars to service_role;

-- Admin Insert (Automatically assigns created_by_user_id to authenticated user)
drop policy if exists "Admin Insert" on public.cars;
create policy "Admin Insert" on public.cars for insert with check (
  auth.role() = 'authenticated' and (created_by_user_id = auth.uid() or created_by_user_id is null)
);

-- Admin Update (Enforces explicit ownership match OR authenticated admin role)
drop policy if exists "Admin Update" on public.cars;
create policy "Admin Update" on public.cars for update using (
  auth.role() = 'authenticated' and (created_by_user_id = auth.uid() or created_by_user_id is null)
);

-- Admin Delete (Enforces explicit ownership match OR authenticated admin role)
drop policy if exists "Admin Delete" on public.cars;
create policy "Admin Delete" on public.cars for delete using (
  auth.role() = 'authenticated' and (created_by_user_id = auth.uid() or created_by_user_id is null)
);


-- 4. Supabase Storage Bucket Setup for 'car-images' (Hardened with 10MB & MIME constraints)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'car-images',
  'car-images',
  true,
  10485760, -- 10MB max file size
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

-- Storage RLS Policies
drop policy if exists "Public Car Images Viewable" on storage.objects;
create policy "Public Car Images Viewable" on storage.objects for select using (bucket_id = 'car-images');

drop policy if exists "Admin Upload Car Images" on storage.objects;
create policy "Admin Upload Car Images" on storage.objects for insert with check (
  bucket_id = 'car-images' and auth.role() = 'authenticated'
);

drop policy if exists "Admin Delete Car Images" on storage.objects;
create policy "Admin Delete Car Images" on storage.objects for delete using (
  bucket_id = 'car-images' and auth.role() = 'authenticated'
);

-- 5. Database Performance Indexes
create index if not exists idx_cars_created_at on public.cars (created_at desc);
create index if not exists idx_cars_status_price on public.cars (is_sold, price);
create index if not exists idx_cars_make_model on public.cars (make, model);


-- ========================================================
-- 6. INQUIRIES & LEAD MANAGEMENT TABLE
-- ========================================================
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  car_id uuid references public.cars(id) on delete set null,
  car_title text,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for inquiries
alter table public.inquiries enable row level security;

-- Public can submit inquiries
drop policy if exists "Anyone can submit inquiry" on public.inquiries;
create policy "Anyone can submit inquiry" on public.inquiries for insert with check (true);

-- Authenticated admins can view and update inquiries
drop policy if exists "Admins can view inquiries" on public.inquiries;
create policy "Admins can view inquiries" on public.inquiries for select using (
  auth.role() = 'authenticated'
);

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries" on public.inquiries for update using (
  auth.role() = 'authenticated'
);

drop policy if exists "Admins can delete inquiries" on public.inquiries;
create policy "Admins can delete inquiries" on public.inquiries for delete using (
  auth.role() = 'authenticated'
);

-- Performance index for inquiries
create index if not exists idx_inquiries_created_at on public.inquiries (created_at desc);
create index if not exists idx_inquiries_status on public.inquiries (status);

-- Explicit Role Privileges for Inquiries
grant insert on public.inquiries to anon, authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant all on public.inquiries to service_role;

