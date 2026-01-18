-- Database Schema for 'STATSEDGE' - Supabase Adaptation
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE subscription_status_type AS ENUM ('free', 'pro');

-- PROFILES (Linked to auth.users)
-- This table extends the Supabase authentication system
CREATE TABLE profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    subscription_status subscription_status_type DEFAULT 'free',
    purchased_picks TEXT[] DEFAULT '{}', -- Array of purchased pick IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, subscription_status)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- PAYMENTS / ORDERS TABLE (Simple version for MVP)
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL, -- 'subscription' or 'pick'
    item_id VARCHAR(50) NOT NULL,   -- 'pro_monthly' or match_id
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_provider VARCHAR(20) NOT NULL, -- 'mercadopago', 'stripe'
    status VARCHAR(20) DEFAULT 'pending', -- 'approved', 'pending', 'rejected'
    external_id TEXT, -- MP ID or Stripe ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can view own orders."
  ON orders FOR SELECT
  USING ( auth.uid() = user_id );

