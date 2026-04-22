import { query } from '../utils/db.js';
import { Restaurant, CreateRestaurantDTO, ResultSetHeader } from '../models/types.js';

export const restaurantModel = {
  async findAll(): Promise<Restaurant[]> {
    const [rows] = await query<Restaurant[]>(
      'SELECT * FROM restaurants WHERE is_active = 1 ORDER BY name'
    );
    return rows;
  },

  async findById(id: number): Promise<Restaurant | null> {
    const [rows] = await query<Restaurant[]>(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findBySlug(slug: string): Promise<Restaurant | null> {
    const [rows] = await query<Restaurant[]>(
      'SELECT * FROM restaurants WHERE slug = ? AND is_active = 1',
      [slug]
    );
    return rows[0] || null;
  },

  async create(data: CreateRestaurantDTO): Promise<number> {
    const [result] = await query<ResultSetHeader>(
      `INSERT INTO restaurants (name, slug, description, address, phone, logo_url, banner_url, theme_primary, theme_secondary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.address || null,
        data.phone || null,
        data.logo_url || null,
        data.banner_url || null,
        data.theme_primary || '#1a1a1a',
        data.theme_secondary || '#ffffff',
      ]
    );
    return result.insertId;
  },

  async update(id: number, data: Partial<CreateRestaurantDTO>): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }
    if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.logo_url !== undefined) { fields.push('logo_url = ?'); values.push(data.logo_url); }
    if (data.banner_url !== undefined) { fields.push('banner_url = ?'); values.push(data.banner_url); }
    if (data.theme_primary !== undefined) { fields.push('theme_primary = ?'); values.push(data.theme_primary); }
    if (data.theme_secondary !== undefined) { fields.push('theme_secondary = ?'); values.push(data.theme_secondary); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await query<ResultSetHeader>(
      `UPDATE restaurants SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await query<ResultSetHeader>(
      'UPDATE restaurants SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};
