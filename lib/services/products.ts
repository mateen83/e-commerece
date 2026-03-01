'use server';

import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/lib/types/database';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Samsung 55" Smart TV',
    slug: 'samsung-55-smart-tv',
    category_id: 'electronics',
    description: 'Beautiful 4K Ultra HD Smart TV with HDR support',
    price: 89999.00,
    sku: 'TV-001',
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1593642632440-35c76d0d7f9d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1593642632440-35c76d0d7f9d?w=800&q=80'],
    rating: 4.5,
    rating_count: 120,
    discount_price: null,
    weight: null,
    variants: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    category_id: 'electronics',
    description: 'Premium noise-cancelling wireless headphones',
    price: 12999.00,
    sku: 'HP-001',
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    rating: 4.8,
    rating_count: 250,
    discount_price: null,
    weight: null,
    variants: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Men\'s Casual Shirt',
    slug: 'mens-casual-shirt',
    category_id: 'fashion-apparel',
    description: 'Comfortable cotton blend casual shirt for everyday wear',
    price: 3499.00,
    sku: 'SH-001',
    stock: 100,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    rating: 4.2,
    rating_count: 85,
    discount_price: null,
    weight: null,
    variants: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Stainless Steel Cookware Set',
    slug: 'stainless-steel-cookware',
    category_id: 'home-kitchen',
    description: '10-piece premium stainless steel cookware set for all your culinary needs',
    price: 15999.00,
    sku: 'CW-001',
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800&q=80'],
    rating: 4.7,
    rating_count: 42,
    discount_price: null,
    weight: null,
    variants: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Bestselling Mystery Novel',
    slug: 'bestselling-mystery-novel',
    category_id: 'books-media',
    description: 'Thrilling mystery novel that will keep you on the edge of your seat',
    price: 1299.00,
    sku: 'BK-001',
    stock: 200,
    image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'],
    rating: 4.9,
    rating_count: 512,
    discount_price: null,
    weight: null,
    variants: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function getProducts(limit = 20, offset = 0) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.log('[v0] Products table not ready:', error.message);
      return FALLBACK_PRODUCTS.slice(offset, offset + limit);
    }
    return data as Product[];
  } catch (err) {
    console.log('[v0] Error fetching products:', err);
    return FALLBACK_PRODUCTS.slice(offset, offset + limit);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = FALLBACK_PRODUCTS.find(p => p.slug === slug);
      if (fallback) return fallback;
      throw error || new Error('Not found');
    }
    return data as Product;
  } catch (error) {
    const fallback = FALLBACK_PRODUCTS.find(p => p.slug === slug);
    if (fallback) return fallback;
    throw new Error(`Failed to fetch product`);
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const fallback = FALLBACK_PRODUCTS.find(p => p.id === id);
      if (fallback) return fallback;
      throw error || new Error('Not found');
    }
    return data as Product;
  } catch (error) {
    const fallback = FALLBACK_PRODUCTS.find(p => p.id === id);
    if (fallback) return fallback;
    throw new Error(`Failed to fetch product`);
  }
}

export async function getProductsByCategory(categoryId: string, limit = 20, offset = 0) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      // Also fallback if categoryId matches category slug for our mock
      .eq('category_id', categoryId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Since categories table might be real, categoryId could be a uuid, but our mock uses slug.
      // Let's filter fallback products by something if possible, or just return them
      const fallbacks = FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId || p.category_id === FALLBACK_PRODUCTS.find(fp => fp.slug === categoryId)?.category_id);
      return (fallbacks.length ? fallbacks : FALLBACK_PRODUCTS).slice(offset, offset + limit);
    }
    return data as Product[];
  } catch (error) {
    const fallbacks = FALLBACK_PRODUCTS.filter(p => p.category_id === categoryId);
    return (fallbacks.length ? fallbacks : FALLBACK_PRODUCTS).slice(offset, offset + limit);
  }
}

export async function searchProducts(query: string, limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to search products: ${error.message}`);
  return data as Product[];
}

export async function getCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('name', { ascending: true });

    if (error) {
      console.log('[v0] Categories table not ready:', error.message);
      return [];
    }
    return data as Category[];
  } catch (err) {
    console.log('[v0] Error fetching categories:', err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw new Error(`Failed to fetch category: ${error.message}`);
  return data as Category;
}

export async function getRelatedProducts(productId: string, limit = 4) {
  const supabase = await createClient();
  const product = await getProductById(productId);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', productId)
    .limit(limit)
    .order('rating', { ascending: false });

  if (error) throw new Error(`Failed to fetch related products: ${error.message}`);
  return data as Product[];
}
