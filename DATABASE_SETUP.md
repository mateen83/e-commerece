# PakMart Database Setup Guide

## Quick Start

The PakMart e-commerce platform requires database tables to be set up in Supabase. Follow these steps:

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Create the Database Tables

Copy and paste the SQL script below into the SQL Editor and execute it:

```sql
-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  weight DECIMAL(8, 2),
  stock INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  image_url TEXT,
  images JSONB DEFAULT '[]'::JSONB,
  variants JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings table
CREATE TABLE IF NOT EXISTS public.reviews_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Cart table
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Shipping addresses table
CREATE TABLE IF NOT EXISTS public.shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Pakistan',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email VARCHAR(255),
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) NOT NULL,
  shipping_cost DECIMAL(12, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method_id UUID REFERENCES public.payment_methods(id),
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address_id UUID REFERENCES public.shipping_addresses(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method_id UUID REFERENCES public.payment_methods(id),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  company VARCHAR(255),
  address VARCHAR(500),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Pakistan',
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_sku_idx ON products(sku);
CREATE INDEX IF NOT EXISTS cart_user_id_idx ON cart(user_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews_ratings(product_id);
CREATE INDEX IF NOT EXISTS shipping_addresses_user_id_idx ON shipping_addresses(user_id);
```

### Step 3: Enable Row Level Security (RLS)

Execute the following SQL to enable RLS on tables:

```sql
-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Public read access
CREATE POLICY "Categories are publicly readable" ON public.categories
  FOR SELECT USING (true);

-- Products: Public read access
CREATE POLICY "Products are publicly readable" ON public.products
  FOR SELECT USING (true);

-- Reviews: Public read, authenticated users can create
CREATE POLICY "Reviews are publicly readable" ON public.reviews_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.reviews_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlist: Users manage their own
CREATE POLICY "Users can view their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Cart: Users manage their own
CREATE POLICY "Users can view their own cart" ON public.cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their cart" ON public.cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON public.cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from their cart" ON public.cart
  FOR DELETE USING (auth.uid() = user_id);

-- Shipping Addresses: Users manage their own
CREATE POLICY "Users can view their own addresses" ON public.shipping_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses" ON public.shipping_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.shipping_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.shipping_addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Payment Methods: Public read access
CREATE POLICY "Payment methods are publicly readable" ON public.payment_methods
  FOR SELECT USING (true);

-- Orders: Users view their own
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR guest_email = auth.email());

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items: Users view through orders
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- User Profiles: Users manage their own
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Step 4: Seed Initial Data

Execute the following SQL to add initial payment methods:

```sql
-- Insert payment methods
INSERT INTO public.payment_methods (name, slug, description, is_active)
VALUES
  ('Cash on Delivery', 'cod', 'Pay when you receive your order', true),
  ('JazzCash', 'jazzcash', 'Pay via JazzCash mobile money', true),
  ('EasyPaisa', 'easypaisa', 'Pay via EasyPaisa mobile money', true),
  ('Bank Transfer', 'bank_transfer', 'Direct bank transfer', true),
  ('Credit/Debit Card', 'card', 'Pay with your credit or debit card', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample categories
INSERT INTO public.categories (name, slug, description)
VALUES
  ('Electronics', 'electronics', 'Electronic devices and gadgets'),
  ('Fashion', 'fashion', 'Clothing, shoes, and accessories'),
  ('Home & Kitchen', 'home-kitchen', 'Home appliances and kitchen items'),
  ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
  ('Books', 'books', 'Books, e-books, and reading materials')
ON CONFLICT (slug) DO NOTHING;
```

### Step 5: Verify Database Setup

Once you've executed all the SQL scripts:

1. Go to the "Table Editor" in Supabase
2. You should see all the new tables (categories, products, orders, etc.)
3. The application should now load without database errors

## Testing the Setup

After setting up the database:

1. Refresh your browser at http://localhost:3000
2. You should see the PakMart homepage
3. The categories and products sections will be empty until you add data

## Adding Sample Products

To add sample products, use the Supabase SQL Editor:

```sql
-- Insert sample products
INSERT INTO public.products (name, slug, category_id, description, price, sku, stock, image_url, rating, rating_count)
VALUES
  (
    'Samsung 55" Smart TV',
    'samsung-55-smart-tv',
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'Beautiful 4K Ultra HD Smart TV with HDR support',
    89999.00,
    'TV-001',
    25,
    'https://images.unsplash.com/photo-1593642632440-35c76d0d7f9d?w=400',
    4.5,
    120
  ),
  (
    'Wireless Headphones',
    'wireless-headphones',
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'Premium noise-cancelling wireless headphones',
    12999.00,
    'HP-001',
    50,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    4.8,
    250
  );
```

## Troubleshooting

### "Table not found" Error
- Make sure you've executed the table creation SQL script
- Check that your Supabase project is properly connected in the v0 UI

### RLS Policy Errors
- Ensure RLS is enabled on all tables
- Verify policies are created correctly
- Check that you're using authenticated requests when required

### Still Having Issues?
- Check the Supabase SQL Editor for any error messages
- Verify your environment variables are set correctly (Vars section in v0 UI)
- Try clearing browser cache and refreshing the page
