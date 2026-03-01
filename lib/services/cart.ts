'use server';

import { createClient } from '@/lib/supabase/server';
import { TAX_RATE, SHIPPING_COSTS } from '@/lib/types/database';
import type { CartItem, Cart } from '@/lib/types/database';

export async function getCart(userId: string): Promise<Cart> {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from('cart')
    .select('*, product:products(*)')
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to fetch cart: ${error.message}`);

  const cartItems = items || [];
  const subtotal = cartItems.reduce((sum, item) => {
    const productPrice = item.product?.discount_price || item.product?.price || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const shipping_cost = 0; // Will be calculated at checkout based on delivery address
  const total = subtotal + tax + shipping_cost;

  return {
    items: cartItems as any,
    subtotal,
    tax,
    shipping_cost,
    total,
  };
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const supabase = await createClient();

  const { data: existingItem } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existingItem) {
    // Update quantity if item exists
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update cart: ${error.message}`);
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();

    if (error) throw new Error(`Failed to add to cart: ${error.message}`);
    return data;
  }
}

export async function updateCartItem(userId: string, cartItemId: string, quantity: number) {
  const supabase = await createClient();

  if (quantity <= 0) {
    return removeFromCart(userId, cartItemId);
  }

  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update cart item: ${error.message}`);
  return data;
}

export async function removeFromCart(userId: string, cartItemId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to remove from cart: ${error.message}`);
}

export async function clearCart(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to clear cart: ${error.message}`);
}

export function calculateShippingCost(city: string): number {
  return SHIPPING_COSTS[city] || 500; // Default to 500 PKR if city not found
}

export function calculateCartTotal(subtotal: number, city?: string): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} {
  const tax = subtotal * TAX_RATE;
  const shipping = city ? calculateShippingCost(city) : 0;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}
