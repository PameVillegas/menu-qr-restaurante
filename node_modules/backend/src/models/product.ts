import { query } from '../utils/db.js';
import { Product, ProductVariant, CreateProductDTO, ResultSetHeader } from '../models/types.js';

export const productModel = {
  async findByCategory(categoryId: number): Promise<Product[]> {
    const [rows] = await query<Product[]>(
      'SELECT * FROM products WHERE category_id = ? AND is_available = 1 ORDER BY sort_order, name',
      [categoryId]
    );
    return rows;
  },

  async findByRestaurant(restaurantId: number): Promise<Product[]> {
    const [rows] = await query<Product[]>(
      'SELECT * FROM products WHERE restaurant_id = ? ORDER BY sort_order, name',
      [restaurantId]
    );
    return rows;
  },

  async findById(id: number): Promise<Product | null> {
    const [rows] = await query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByIdWithVariants(id: number): Promise<{ product: Product; variants: ProductVariant[] } | null> {
    const product = await this.findById(id);
    if (!product) return null;

    const [variants] = await query<ProductVariant[]>(
      'SELECT * FROM product_variants WHERE product_id = ? AND is_available = 1 ORDER BY price_modifier',
      [id]
    );

    return { product, variants };
  },

  async create(data: CreateProductDTO): Promise<number> {
    const [result] = await query<ResultSetHeader>(
      `INSERT INTO products (category_id, restaurant_id, name, description, price, image_url, is_available, sort_order, has_variants)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.category_id,
        data.restaurant_id,
        data.name,
        data.description || null,
        data.price,
        data.image_url || null,
        data.is_available ? 1 : 0,
        data.sort_order || 0,
        data.has_variants ? 1 : 0,
      ]
    );

    const productId = result.insertId;

    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        await query<ResultSetHeader>(
          'INSERT INTO product_variants (product_id, name, price_modifier) VALUES (?, ?, ?)',
          [productId, variant.name, variant.price_modifier]
        );
      }
    }

    return productId;
  },

  async update(id: number, data: Partial<CreateProductDTO>): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.price !== undefined) { fields.push('price = ?'); values.push(data.price); }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.is_available !== undefined) { fields.push('is_available = ?'); values.push(data.is_available ? 1 : 0); }
    if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }
    if (data.has_variants !== undefined) { fields.push('has_variants = ?'); values.push(data.has_variants ? 1 : 0); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await query<ResultSetHeader>(
      `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await query<ResultSetHeader>(
      'UPDATE products SET is_available = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async addVariant(productId: number, name: string, priceModifier: number): Promise<number> {
    const [result] = await query<ResultSetHeader>(
      'INSERT INTO product_variants (product_id, name, price_modifier) VALUES (?, ?, ?)',
      [productId, name, priceModifier]
    );
    return result.insertId;
  },

  async deleteVariant(variantId: number): Promise<boolean> {
    const [result] = await query<ResultSetHeader>(
      'DELETE FROM product_variants WHERE id = ?',
      [variantId]
    );
    return result.affectedRows > 0;
  },
};
