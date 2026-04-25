export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  price: number;
  created_at: Date;
}

export interface Table {
  id: number;
  restaurant_id: number;
  number: number;
  qr_code: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes: string | null;
}

export interface Order {
  id: number;
  restaurant_id: number;
  table_id: number;
  customer_name: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  tip_amount: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRestaurantDTO {
  name: string;
  slug?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CreateCategoryDTO {
  restaurant_id: number;
  name: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}

export interface CreateProductDTO {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
  sort_order?: number;
}

export interface CreateTableDTO {
  restaurant_id: number;
  number: number;
}

export interface QueryResult {
  rowCount: number;
  rows: unknown[];
}