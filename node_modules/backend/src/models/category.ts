import { query } from '../utils/db.js';
import { Category, CreateCategoryDTO } from './types.js';

export const getCategories = async (restaurantId: number): Promise<Category[]> => {
  const result = await query('SELECT * FROM categories WHERE restaurant_id = $1 AND is_active = 1 ORDER BY sort_order, name', [restaurantId]);
  return result.rows as Category[];
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
  return (result.rows[0] as Category) || null;
};

export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
  const result = await query(
    `INSERT INTO categories (restaurant_id, name, description, image_url, sort_order) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.restaurant_id, data.name, data.description, data.image_url, data.sort_order || 0]
  );
  return result.rows[0] as Category;
};

export const updateCategory = async (id: number, data: Partial<CreateCategoryDTO>): Promise<Category> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
  if (data.image_url !== undefined) { fields.push(`image_url = $${i++}`); values.push(data.image_url); }
  if (data.sort_order !== undefined) { fields.push(`sort_order = $${i++}`); values.push(data.sort_order); }
  
  values.push(id);
  const result = await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return result.rows[0] as Category;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await query('UPDATE categories SET is_active = 0 WHERE id = $1', [id]);
};

export default { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };