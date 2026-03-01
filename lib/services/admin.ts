'use server';

import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/lib/types/database';

// Product Management
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw new Error(`Failed to create product: ${error.message}`);
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update product: ${error.message}`);
  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw new Error(`Failed to delete product: ${error.message}`);
  return true;
}

// Category Management
export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw new Error(`Failed to create category: ${error.message}`);
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update category: ${error.message}`);
  return data as Category;
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw new Error(`Failed to delete category: ${error.message}`);
  return true;
}

// Inventory Management
export async function updateInventory(productId: string, newStock: number, logType: string, notes?: string) {
  const supabase = await createClient();

  // Update product stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ stock: newStock, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (updateError) throw new Error(`Failed to update inventory: ${updateError.message}`);

  // Log the change
  const { error: logError } = await supabase
    .from('inventory_logs')
    .insert({
      product_id: productId,
      quantity_change: newStock,
      log_type: logType,
      notes,
    });

  if (logError) throw new Error(`Failed to log inventory change: ${logError.message}`);
  return true;
}

export async function getInventoryLogs(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory_logs')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch inventory logs: ${error.message}`);
  return data || [];
}

// Analytics
export async function getAdminStats() {
  const supabase = await createClient();

  // Get total orders
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get total revenue
  const { data: ordersData } = await supabase.from('orders').select('total');

  const totalRevenue = (ordersData || []).reduce((sum, order) => sum + (order.total || 0), 0);

  // Get total products
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id, name, stock')
    .lt('stock', 10)
    .order('stock', { ascending: true });

  return {
    totalOrders: ordersCount || 0,
    totalRevenue,
    totalProducts: productsCount || 0,
    lowStockProducts: lowStockProducts || [],
  };
}
