'use server';

import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/lib/types/database';



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
      return [];
    }
    return data as Product[];
  } catch (err) {
    console.log('[v0] Error fetching products:', err);
    return [];
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
      throw error || new Error('Not found');
    }
    return data as Product;
  } catch (error) {
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
      throw error || new Error('Not found');
    }
    return data as Product;
  } catch (error) {
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
      return [];
    }
    return data as Product[];
  } catch (error) {
    return [];
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
