import { describe, it, expect } from 'vitest';
import {
  mapRestaurantRow,
  mapCategoryRow,
  mapMenuItemRow,
  mapAdminRow,
  mapQRCodeRow,
} from './mappers';
import type {
  RestaurantRow,
  CategoryRow,
  MenuItemRow,
  AdminRow,
  QRCodeRow,
} from './types';

describe('Mapper Functions', () => {
  describe('mapRestaurantRow', () => {
    it('should convert restaurant row to camelCase model', () => {
      const row: RestaurantRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Restaurant',
        logo_url: 'https://example.com/logo.png',
        hours: '9:00 AM - 10:00 PM',
        contact_info: {
          phone: '+1234567890',
          email: 'contact@restaurant.com',
        },
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      };

      const result = mapRestaurantRow(row);

      expect(result.id).toBe(row.id);
      expect(result.name).toBe(row.name);
      expect(result.logoUrl).toBe(row.logo_url);
      expect(result.hours).toBe(row.hours);
      expect(result.contactInfo).toEqual(row.contact_info);
      expect(result.createdAt).toBe(row.created_at);
      expect(result.updatedAt).toBe(row.updated_at);
    });

    it('should handle optional fields', () => {
      const row: RestaurantRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Minimal Restaurant',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      };

      const result = mapRestaurantRow(row);

      expect(result.logoUrl).toBeUndefined();
      expect(result.hours).toBeUndefined();
      expect(result.contactInfo).toBeUndefined();
    });
  });

  describe('mapCategoryRow', () => {
    it('should convert category row to camelCase model', () => {
      const row: CategoryRow = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Appetizers',
        display_order: 1,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      };

      const result = mapCategoryRow(row);

      expect(result.id).toBe(row.id);
      expect(result.restaurantId).toBe(row.restaurant_id);
      expect(result.name).toBe(row.name);
      expect(result.displayOrder).toBe(row.display_order);
      expect(result.createdAt).toBe(row.created_at);
      expect(result.updatedAt).toBe(row.updated_at);
    });
  });

  describe('mapMenuItemRow', () => {
    it('should convert menu item row to camelCase model', () => {
      const row: MenuItemRow = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        category_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls',
        price: '8.99', // DECIMAL comes as string from pg
        image_url: 'https://example.com/spring-rolls.jpg',
        thumbnail_url: 'https://example.com/spring-rolls-thumb.jpg',
        available: true,
        display_order: 1,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      };

      const result = mapMenuItemRow(row);

      expect(result.id).toBe(row.id);
      expect(result.categoryId).toBe(row.category_id);
      expect(result.name).toBe(row.name);
      expect(result.description).toBe(row.description);
      expect(result.price).toBe(8.99); // Converted to number
      expect(typeof result.price).toBe('number');
      expect(result.imageUrl).toBe(row.image_url);
      expect(result.thumbnailUrl).toBe(row.thumbnail_url);
      expect(result.available).toBe(row.available);
      expect(result.displayOrder).toBe(row.display_order);
      expect(result.createdAt).toBe(row.created_at);
      expect(result.updatedAt).toBe(row.updated_at);
    });

    it('should handle optional fields', () => {
      const row: MenuItemRow = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        category_id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Simple Item',
        price: '5.00',
        available: true,
        display_order: 0,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      };

      const result = mapMenuItemRow(row);

      expect(result.description).toBeUndefined();
      expect(result.imageUrl).toBeUndefined();
      expect(result.thumbnailUrl).toBeUndefined();
      expect(result.price).toBe(5.0);
    });

    it('should correctly parse decimal prices', () => {
      const testCases = [
        { input: '10.50', expected: 10.5 },
        { input: '0.99', expected: 0.99 },
        { input: '100.00', expected: 100.0 },
        { input: '15.95', expected: 15.95 },
      ];

      testCases.forEach(({ input, expected }) => {
        const row: MenuItemRow = {
          id: '123e4567-e89b-12d3-a456-426614174002',
          category_id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Test Item',
          price: input,
          available: true,
          display_order: 0,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const result = mapMenuItemRow(row);
        expect(result.price).toBe(expected);
      });
    });
  });

  describe('mapAdminRow', () => {
    it('should convert admin row to camelCase model', () => {
      const row: AdminRow = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@restaurant.com',
        password_hash: '$2b$10$hashedpassword',
        name: 'Admin User',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      };

      const result = mapAdminRow(row);

      expect(result.id).toBe(row.id);
      expect(result.restaurantId).toBe(row.restaurant_id);
      expect(result.email).toBe(row.email);
      expect(result.name).toBe(row.name);
      expect(result.createdAt).toBe(row.created_at);
      expect(result.updatedAt).toBe(row.updated_at);
      // password_hash should not be in the result
      expect('passwordHash' in result).toBe(false);
    });
  });

  describe('mapQRCodeRow', () => {
    it('should convert QR code row to camelCase model', () => {
      const row: QRCodeRow = {
        id: '123e4567-e89b-12d3-a456-426614174004',
        restaurant_id: '123e4567-e89b-12d3-a456-426614174000',
        qr_image_url: 'https://example.com/qr/restaurant-qr.png',
        created_at: new Date('2024-01-01'),
      };

      const result = mapQRCodeRow(row);

      expect(result.id).toBe(row.id);
      expect(result.restaurantId).toBe(row.restaurant_id);
      expect(result.qrImageUrl).toBe(row.qr_image_url);
      expect(result.createdAt).toBe(row.created_at);
    });
  });
});
