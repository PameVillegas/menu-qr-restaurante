import { query } from '../utils/db.js';
import { Product, CreateProductDTO } from './types.js';

export const getProducts = async (categoryId: number): Promise<Product[]> => {
  const result = await query(
    'SELECT * FROM products WHERE category_id = $1 AND is_available = true ORDER BY sort_order, name',
    [categoryId]
  );
  return result.rows as Product[];
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await query('SELECT * FROM products WHERE id = $1', [id]);
  return (result.rows[0] as Product) || null;
};

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  const result = await query(
    `INSERT INTO products (category_id, name, description, price, image_url, is_available, sort_order) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [data.category_id, data.name, data.description, data.price, data.image_url, data.is_available ?? true, data.sort_order || 0]
  );
  return result.rows[0] as Product;
};

export const updateProduct = async (id: number, data: Partial<CreateProductDTO>): Promise<Product> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
  if (data.price !== undefined) { fields.push(`price = $${i++}`); values.push(data.price); }
  if (data.image_url !== undefined) { fields.push(`image_url = $${i++}`); values.push(data.image_url); }
  if (data.is_available !== undefined) { fields.push(`is_available = $${i++}`); values.push(data.is_available); }
  if (data.sort_order !== undefined) { fields.push(`sort_order = $${i++}`); values.push(data.sort_order); }
  
  values.push(id);
  const result = await query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return result.rows[0] as Product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await query('UPDATE products SET is_available = false WHERE id = $1', [id]);
};

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct };