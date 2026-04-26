import { query } from '../utils/db.js';
import { Restaurant, CreateRestaurantDTO } from './types.js';

export const restaurantModel = {
  findAll: async (): Promise<Restaurant[]> => {
    const result = await query('SELECT * FROM restaurants WHERE is_active = true ORDER BY name');
    return result.rows as Restaurant[];
  },
  findById: async (id: number): Promise<Restaurant | null> => {
    const result = await query('SELECT * FROM restaurants WHERE id = $1', [id]);
    return (result.rows[0] as Restaurant) || null;
  },
  findBySlug: async (slug: string): Promise<Restaurant | null> => {
    const result = await query('SELECT * FROM restaurants WHERE slug = $1', [slug]);
    return (result.rows[0] as Restaurant) || null;
  },
  create: async (data: CreateRestaurantDTO): Promise<number> => {
    const result = await query(
      `INSERT INTO restaurants (name, slug, description, address, phone, email) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [data.name, data.slug || data.name.toLowerCase().replace(/\s+/g, '-'), data.description, data.address, data.phone, data.email]
    );
    return result.rows[0].id;
  },
  update: async (id: number, data: Partial<CreateRestaurantDTO>): Promise<void> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
    if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
    if (data.address !== undefined) { fields.push(`address = $${i++}`); values.push(data.address); }
    if (data.phone !== undefined) { fields.push(`phone = $${i++}`); values.push(data.phone); }
    if (data.email !== undefined) { fields.push(`email = $${i++}`); values.push(data.email); }
    values.push(id);
    await query(`UPDATE restaurants SET ${fields.join(', ')} WHERE id = $${i}`, values);
  },
  delete: async (id: number): Promise<void> => {
    await query('UPDATE restaurants SET is_active = false WHERE id = $1', [id]);
  }
};