'use server';

import { createClient } from '@/lib/supabase/server';
import type { Order, OrderItem } from '@/lib/types/database';

export async function createOrder(
  userId: string | null,
  guestEmail: string | null,
  subtotal: number,
  tax: number,
  shipping_cost: number,
  shipping_address_id: string,
  payment_method_id: string,
  notes?: string
) {
  const supabase = await createClient();

  // Generate order number
  const orderNumber =
    'ORD' +
    new Date().toISOString().slice(0, 10).replace(/-/g, '') +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

  const total = subtotal + tax + shipping_cost;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      guest_email: guestEmail,
      subtotal,
      tax,
      shipping_cost,
      total,
      shipping_address_id,
      payment_method_id,
      notes,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);
  return data as Order;
}

export async function addOrderItems(orderId: string, items: Array<{ product_id: string; quantity: number; price: number }>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('order_items')
    .insert(
      items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))
    )
    .select();

  if (error) throw new Error(`Failed to add order items: ${error.message}`);
  return data as OrderItem[];
}

export async function getOrder(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), shipping_address(*), payment_method(*)')
    .eq('id', orderId)
    .single();

  if (error) throw new Error(`Failed to fetch order: ${error.message}`);
  return data as Order;
}

export async function getOrderByNumber(orderNumber: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), shipping_address(*), payment_method(*)')
    .eq('order_number', orderNumber)
    .single();

  if (error) throw new Error(`Failed to fetch order: ${error.message}`);
  return data as Order;
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, shipping_address(*), payment_method(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update order status: ${error.message}`);
  return data as Order;
}

export async function updatePaymentStatus(
  orderId: string,
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update payment status: ${error.message}`);
  return data as Order;
}

export async function cancelOrder(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error(`Failed to cancel order: ${error.message}`);
  return data as Order;
}
