import { ApiResponse, Restaurant, Category, Product, CreateRestaurantDTO, CreateCategoryDTO, CreateProductDTO } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://menu-qr-rest.onrender.com/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'An error occurred');
  }

  return data.data as T;
}

export const api = {
  menu: {
    get: () => fetchApi<{ restaurant: Restaurant; menu: Category[] }>('/menu'),
    getBySlug: (slug: string) => fetchApi<{ restaurant: Restaurant; menu: Category[] }>(`/menu/${slug}`),
  },
  restaurants: {
    getAll: () => fetchApi<Restaurant[]>('/restaurants'),
    getById: (id: number) => fetchApi<Restaurant>(`/restaurants/${id}`),
    getBySlug: (slug: string) => fetchApi<Restaurant>(`/restaurants/slug/${slug}`),
    create: (data: CreateRestaurantDTO) => fetchApi<Restaurant>('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<CreateRestaurantDTO>) => fetchApi<Restaurant>(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<void>(`/restaurants/${id}`, { method: 'DELETE' }),
  },
  categories: {
    getByRestaurant: (restaurantId: number) => fetchApi<Category[]>(`/categories/restaurant/${restaurantId}`),
    create: (data: CreateCategoryDTO) => fetchApi<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<CreateCategoryDTO>) => fetchApi<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<void>(`/categories/${id}`, { method: 'DELETE' }),
    reorder: (restaurantId: number, categoryIds: number[]) => fetchApi<void>(`/categories/reorder/${restaurantId}`, { method: 'POST', body: JSON.stringify({ categoryIds }) }),
  },
  products: {
    getByCategory: (categoryId: number) => fetchApi<Product[]>(`/products/category/${categoryId}`),
    getByRestaurant: (restaurantId: number) => fetchApi<Product[]>(`/products/restaurant/${restaurantId}`),
    create: (data: CreateProductDTO) => fetchApi<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<CreateProductDTO>) => fetchApi<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<void>(`/products/${id}`, { method: 'DELETE' }),
  },
  orders: {
    create: (data: { table_number: string; client_name?: string; items: any[]; tip: number }) => 
      fetchApi<{ order_id: number; table: string }>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getByRestaurant: (restaurantId: number, status?: string) => 
      fetchApi<any[]>(`/orders/restaurant/${restaurantId}${status ? `?status=${status}` : ''}`),
    updateStatus: (orderId: number, status: string) => 
      fetchApi<{ message: string }>(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    addReview: (orderId: number, data: { table_number: string; rating: number; comment?: string; tip_amount: number }) => 
      fetchApi<{ review_id: number }>(`/orders/${orderId}/review`, { method: 'POST', body: JSON.stringify(data) }),
    getReviews: () => fetchApi<any[]>('/orders/reviews'),
  },
};
 
