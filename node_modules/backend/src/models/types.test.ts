import { describe, it, expect } from 'vitest';
import type {
  Restaurant,
  Category,
  MenuItem,
  Admin,
  QRCode,
  MenuResponse,
  CreateItemRequest,
  UpdateItemRequest,
  LoginRequest,
  ErrorResponse,
} from './types';

describe('TypeScript Interfaces', () => {
  describe('Restaurant interface', () => {
    it('should accept valid restaurant object with all fields', () => {
      const restaurant: Restaurant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Restaurant',
        logoUrl: 'https://example.com/logo.png',
        hours: '9:00 AM - 10:00 PM',
        contactInfo: {
          phone: '+1234567890',
          email: 'contact@restaurant.com',
          address: '123 Main St',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(restaurant.id).toBeDefined();
      expect(restaurant.name).toBe('Test Restaurant');
    });

    it('should accept restaurant with only required fields', () => {
      const restaurant: Restaurant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Minimal Restaurant',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(restaurant.logoUrl).toBeUndefined();
      expect(restaurant.hours).toBeUndefined();
      expect(restaurant.contactInfo).toBeUndefined();
    });
  });

  describe('MenuItem interface', () => {
    it('should accept valid menu item with all fields', () => {
      const item: MenuItem = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Burger',
        description: 'Delicious beef burger',
        price: 12.99,
        imageUrl: 'https://example.com/burger.jpg',
        thumbnailUrl: 'https://example.com/burger-thumb.jpg',
        available: true,
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(item.name).toBe('Burger');
      expect(item.price).toBe(12.99);
      expect(item.available).toBe(true);
    });

    it('should accept menu item with only required fields', () => {
      const item: MenuItem = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        categoryId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Simple Item',
        price: 5.0,
        available: true,
        displayOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(item.description).toBeUndefined();
      expect(item.imageUrl).toBeUndefined();
    });
  });

  describe('Category interface', () => {
    it('should accept valid category', () => {
      const category: Category = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Appetizers',
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(category.name).toBe('Appetizers');
      expect(category.displayOrder).toBe(1);
    });

    it('should accept category with items array', () => {
      const category: Category = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Main Courses',
        displayOrder: 2,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(category.items).toEqual([]);
    });
  });

  describe('MenuResponse interface', () => {
    it('should accept valid menu response structure', () => {
      const menuResponse: MenuResponse = {
        restaurant: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Restaurant',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        categories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            restaurantId: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Appetizers',
            displayOrder: 1,
            items: [
              {
                id: '123e4567-e89b-12d3-a456-426614174001',
                categoryId: '123e4567-e89b-12d3-a456-426614174003',
                name: 'Spring Rolls',
                price: 6.99,
                available: true,
                displayOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      expect(menuResponse.restaurant.name).toBe('Test Restaurant');
      expect(menuResponse.categories).toHaveLength(1);
      expect(menuResponse.categories[0].items).toHaveLength(1);
    });
  });

  describe('Request types', () => {
    it('should accept valid CreateItemRequest', () => {
      const request: CreateItemRequest = {
        name: 'New Item',
        description: 'A new menu item',
        price: 15.99,
        categoryId: '123e4567-e89b-12d3-a456-426614174003',
      };

      expect(request.name).toBe('New Item');
      expect(request.price).toBe(15.99);
    });

    it('should accept valid UpdateItemRequest with partial fields', () => {
      const request: UpdateItemRequest = {
        name: 'Updated Name',
        available: false,
      };

      expect(request.name).toBe('Updated Name');
      expect(request.price).toBeUndefined();
    });

    it('should accept valid LoginRequest', () => {
      const request: LoginRequest = {
        email: 'admin@restaurant.com',
        password: 'securepassword',
      };

      expect(request.email).toBe('admin@restaurant.com');
    });
  });

  describe('ErrorResponse interface', () => {
    it('should accept valid error response', () => {
      const errorResponse: ErrorResponse = {
        error: {
          code: 'RESTAURANT_NOT_FOUND',
          message: 'Restaurant with the given ID was not found',
          timestamp: new Date().toISOString(),
        },
      };

      expect(errorResponse.error.code).toBe('RESTAURANT_NOT_FOUND');
      expect(errorResponse.error.message).toBeDefined();
    });

    it('should accept error response with details', () => {
      const errorResponse: ErrorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: {
            field: 'price',
            issue: 'must be a positive number',
          },
          timestamp: new Date().toISOString(),
        },
      };

      expect(errorResponse.error.details).toBeDefined();
      expect(errorResponse.error.details.field).toBe('price');
    });
  });

  describe('Admin interface', () => {
    it('should accept valid admin object', () => {
      const admin: Admin = {
        id: '123e4567-e89b-12d3-a456-426614174004',
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@restaurant.com',
        name: 'Admin User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(admin.email).toBe('admin@restaurant.com');
      expect(admin.name).toBe('Admin User');
    });
  });

  describe('QRCode interface', () => {
    it('should accept valid QR code object', () => {
      const qrCode: QRCode = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        restaurantId: '123e4567-e89b-12d3-a456-426614174000',
        qrImageUrl: 'https://example.com/qr/restaurant-qr.png',
        createdAt: new Date(),
      };

      expect(qrCode.qrImageUrl).toBeDefined();
      expect(qrCode.restaurantId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});
