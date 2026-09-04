-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS set_deliveries_updated_at ON public.deliveries;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.set_updated_at();

-- Drop policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Dispatchers can read all users" ON public.users;
DROP POLICY IF EXISTS "Retailers can CRUD own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Dispatchers can read and update all deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Dispatchers can update all deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Riders can read assigned deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Riders can update assigned deliveries" ON public.deliveries;

-- Drop tables
DROP TABLE IF EXISTS public.deliveries CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.delivery_status CASCADE;

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('retailer', 'dispatcher', 'rider');
CREATE TYPE public.delivery_status AS ENUM ('Requested', 'Assigned', 'Picked Up', 'Delivered');

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'retailer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Dispatchers can read all users (needed to assign riders)
CREATE POLICY "Dispatchers can read all users" ON public.users
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'dispatcher'
  );

-- Create deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  item_description TEXT NOT NULL,
  status public.delivery_status NOT NULL DEFAULT 'Requested',
  assigned_rider_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  confirmation_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for deliveries
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Retailers can CRUD their own deliveries
CREATE POLICY "Retailers can CRUD own deliveries" ON public.deliveries
  FOR ALL USING (auth.uid() = retailer_id);

-- Dispatchers can read all deliveries
CREATE POLICY "Dispatchers can read all deliveries" ON public.deliveries
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'dispatcher'
  );

-- Dispatchers can update all deliveries
CREATE POLICY "Dispatchers can update all deliveries" ON public.deliveries
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'dispatcher'
  );

-- Riders can read assigned deliveries
CREATE POLICY "Riders can read assigned deliveries" ON public.deliveries
  FOR SELECT USING (
    assigned_rider_id = auth.uid()
  );

-- Riders can update assigned deliveries
CREATE POLICY "Riders can update assigned deliveries" ON public.deliveries
  FOR UPDATE USING (
    assigned_rider_id = auth.uid()
  );

-- Create a trigger to sync auth.users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'retailer'::public.user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger for updated_at on users
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER set_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Setup Realtime
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.deliveries;
