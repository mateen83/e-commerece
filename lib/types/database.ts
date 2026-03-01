// Product related types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category_id: string;
  sku: string;
  weight: number | null;
  stock: number;
  rating: number;
  rating_count: number;
  image_url: string | null;
  images: string[];
  variants: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

// Cart and Order types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description: string | null;
  enabled: boolean;
  created_at: string;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  postal_code: string | null;
  region: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  shipping_address_id: string | null;
  payment_method_id: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes: string | null;
  items?: OrderItem[];
  shipping_address?: ShippingAddress;
  payment_method?: PaymentMethod;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'fixed' | 'percentage';
  discount_value: number | null;
  discount_percentage: number | null;
  min_order_value: number | null;
  max_uses: number | null;
  times_used: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// Pakistan-specific constants
export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Hyderabad',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Jhang',
  'Bahawalpur',
  'Sargodha',
  'Mardan',
  'Kasur',
  'Okara',
  'Sahiwal',
];

export const PAKISTAN_REGIONS = [
  'Sindh',
  'Punjab',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit Baltistan',
];

// Tax rates for Pakistan
export const TAX_RATE = 0.17; // 17% GST

// Shipping costs by region (in PKR)
export const SHIPPING_COSTS: Record<string, number> = {
  'Karachi': 250,
  'Lahore': 200,
  'Islamabad': 300,
  'Rawalpindi': 300,
  'Faisalabad': 350,
  'Multan': 400,
  'Hyderabad': 300,
  'Peshawar': 450,
  'Quetta': 500,
  'Sialkot': 400,
  'Gujranwala': 300,
  'Jhang': 350,
  'Bahawalpur': 400,
  'Sargodha': 350,
  'Mardan': 450,
  'Kasur': 250,
  'Okara': 350,
  'Sahiwal': 350,
};
