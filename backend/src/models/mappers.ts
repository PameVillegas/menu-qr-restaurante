/**
 * Mapper functions to convert between database rows (snake_case) and application models (camelCase)
 */

import type {
  Restaurant,
  Category,
  MenuItem,
  Admin,
  QRCode,
  RestaurantRow,
  CategoryRow,
  MenuItemRow,
  AdminRow,
  QRCodeRow,
  ContactInfo,
} from './types';

/**
 * Convert RestaurantRow from database to Restaurant model
 */
export function mapRestaurantRow(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    hours: row.hours,
    contactInfo: row.contact_info as ContactInfo | undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert CategoryRow from database to Category model
 */
export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert MenuItemRow from database to MenuItem model
 */
export function mapMenuItemRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price), // Convert DECIMAL string to number
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
    available: row.available,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert AdminRow from database to Admin model
 */
export function mapAdminRow(row: AdminRow): Admin {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert QRCodeRow from database to QRCode model
 */
export function mapQRCodeRow(row: QRCodeRow): QRCode {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    qrImageUrl: row.qr_image_url,
    createdAt: row.created_at,
  };
}
