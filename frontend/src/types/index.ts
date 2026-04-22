export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_primary: string;
  theme_secondary: string;
  is_active: number;
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: number;
  products?: Product[];
}

export interface Product {
  id: number;
  category_id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: number;
  sort_order: number;
  has_variants: number;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  price_modifier: number;
  is_available: number;
}

export interface Table {
  id: number;
  restaurant_id: number;
  number: string;
  qr_code: string;
  is_active: number;
}

export interface MenuData {
  table: Table;
  restaurant: Restaurant;
  menu: Category[];
}

export interface CreateRestaurantDTO {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  logo_url?: string;
  banner_url?: string;
  theme_primary?: string;
  theme_secondary?: string;
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
  restaurant_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
  sort_order?: number;
  has_variants?: boolean;
  variants?: { name: string; price_modifier: number }[];
}

export interface CreateTableDTO {
  restaurant_id: number;
  number: string;
}
