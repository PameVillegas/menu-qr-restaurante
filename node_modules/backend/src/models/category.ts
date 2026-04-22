import { query } from '../utils/db.js';
import { Category, CreateCategoryDTO, ResultSetHeader } from '../models/types.js';

export const categoryModel = {
  async findByRestaurant(restaurantId: number): Promise<Category[]> {
    const [rows] = await query<Category[]>(
      'SELECT * FROM categories WHERE restaurant_id = ? AND is_active = 1 ORDER BY sort_order, name',
      [restaurantId]
    );
    return rows;
  },

  async findById(id: number): Promise<Category | null> {
    const [rows] = await query<Category[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(data: CreateCategoryDTO): Promise<number> {
    const [result] = await query<ResultSetHeader>(
      `INSERT INTO categories (restaurant_id, name, description, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.restaurant_id,
        data.name,
        data.description || null,
        data.image_url || null,
        data.sort_order || 0,
      ]
    );
    return result.insertId;
  },

  async update(id: number, data: Partial<CreateCategoryDTO>): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await query<ResultSetHeader>(
      `UPDATE categories SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await query<ResultSetHeader>(
      'UPDATE categories SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async reorder(restaurantId: number, categoryIds: number[]): Promise<boolean> {
    for (let i = 0; i < categoryIds.length; i++) {
      await query<ResultSetHeader>(
        'UPDATE categories SET sort_order = ? WHERE id = ? AND restaurant_id = ?',
        [i, categoryIds[i], restaurantId]
      );
    }
    return true;
  },
};
