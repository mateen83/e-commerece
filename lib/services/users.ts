'use server';

import { createClient } from '@/lib/supabase/server';
import type { ShippingAddress } from '@/lib/types/database';

export async function getUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  return user;
}

export async function getShippingAddresses(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch addresses: ${error.message}`);
  return data as ShippingAddress[];
}

export async function addShippingAddress(userId: string, address: Omit<ShippingAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient();

  // If this is the default address, unset all other defaults
  if (address.is_default) {
    await supabase
      .from('shipping_addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('shipping_addresses')
    .insert({
      user_id: userId,
      ...address,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add address: ${error.message}`);
  return data as ShippingAddress;
}

export async function updateShippingAddress(
  userId: string,
  addressId: string,
  address: Partial<Omit<ShippingAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient();

  // If setting as default, unset other defaults
  if (address.is_default) {
    await supabase
      .from('shipping_addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('shipping_addresses')
    .update(address)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update address: ${error.message}`);
  return data as ShippingAddress;
}

export async function deleteShippingAddress(userId: string, addressId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('shipping_addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to delete address: ${error.message}`);
  return true;
}

export async function getWishlist(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wishlist')
    .select('*, product:products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch wishlist: ${error.message}`);
  return data || [];
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error) throw new Error(`Failed to add to wishlist: ${error.message}`);
  return data;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw new Error(`Failed to remove from wishlist: ${error.message}`);
  return true;
}
