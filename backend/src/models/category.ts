import { query } from '../utils/db.js';
import { Category, CreateCategoryDTO } from './types.js';

export const categoryModel = {
  findByRestaurant: async (restaurantId: number): Promise<Category[]> => {
    const result = await query('SELECT * FROM categories WHERE restaurant_id = $1 AND is_active = 1 ORDER BY sort_order, name', [restaurantId]);
    return result.rows as Category[];
  },
  findById: async (id: number): Promise<Category | null> => {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return (result.rows[0] as Category) || null;
  },
  create: async (data: CreateCategoryDTO): Promise<number> => {
    const result = await query(
      `INSERT INTO categories (restaurant_id, name, description, image_url, sort_order) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [data.restaurant_id, data.name, data.description, data.image_url, data.sort_order || 0]
    );
    return result.rows[0].id;
  },
  update: async (id: number, data: Partial<CreateCategoryDTO>): Promise<void> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
    if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
    if (data.image_url !== undefined) { fields.push(`image_url = $${i++}`); values.push(data.image_url); }
    if (data.sort_order !== undefined) { fields.push(`sort_order = $${i++}`); values.push(data.sort_order); }
    values.push(id);
    await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = $${i}`, values);
  },
  delete: async (id: number): Promise<void> => {
    await query('UPDATE categories SET is_active = false WHERE id = $1', [id]);
  },
  reorder: async (restaurantId: number, categoryIds: number[]): Promise<void> => {
    for (let i = 0; i < categoryIds.length; i++) {
      await query('UPDATE categories SET sort_order = $1 WHERE id = $2 AND restaurant_id = $3', [i, categoryIds[i], restaurantId]);
    }
  }
};