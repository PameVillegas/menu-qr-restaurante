import { query } from '../utils/db.js';
import { Product, CreateProductDTO } from './types.js';

export const productModel = {
  findByCategory: async (categoryId: number): Promise<Product[]> => {
    const result = await query('SELECT * FROM products WHERE category_id = $1 AND is_available = true ORDER BY sort_order, name', [categoryId]);
    return result.rows as Product[];
  },
  findByRestaurant: async (restaurantId: number): Promise<Product[]> => {
    const result = await query(
      `SELECT p.* FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE c.restaurant_id = $1 AND p.is_available = true 
       ORDER BY c.sort_order, p.sort_order, p.name`,
      [restaurantId]
    );
    return result.rows as Product[];
  },
  findById: async (id: number): Promise<Product | null> => {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return (result.rows[0] as Product) || null;
  },
  findByIdWithVariants: async (id: number): Promise<Product | null> => {
    return productModel.findById(id);
  },
  create: async (data: CreateProductDTO): Promise<number> => {
    const result = await query(
      `INSERT INTO products (category_id, name, description, price, image_url, is_available, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [data.category_id, data.name, data.description, data.price, data.image_url, data.is_available ?? true, data.sort_order || 0]
    );
    return result.rows[0].id;
  },
  update: async (id: number, data: Partial<CreateProductDTO>): Promise<void> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
    if (data.description !== undefined) { fields.push(`description = $${i++}`); values.push(data.description); }
    if (data.price !== undefined) { fields.push(`price = $${i++}`); values.push(data.price); }
    if (data.image_url !== undefined) { fields.push(`image_url = $${i++}`); values.push(data.image_url); }
    if (data.is_available !== undefined) { fields.push(`is_available = $${i++}`); values.push(data.is_available); }
    values.push(id);
    await query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${i}`, values);
  },
  delete: async (id: number): Promise<void> => {
    await query('UPDATE products SET is_available = false WHERE id = $1', [id]);
  },
  addVariant: async (productId: number, name: string, priceModifier: number): Promise<number> => {
    const product = await productModel.findById(productId);
    if (!product) throw new Error('Product not found');
    const result = await query(
      'INSERT INTO product_variants (product_id, name, price) VALUES ($1, $2, $3) RETURNING id',
      [productId, name, product.price + priceModifier]
    );
    return result.rows[0].id;
  },
  deleteVariant: async (variantId: number): Promise<void> => {
    await query('DELETE FROM product_variants WHERE id = $1', [variantId]);
  }
};