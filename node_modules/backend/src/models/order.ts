import { query, getClient } from '../utils/db.js';
import { Order, OrderItem } from './types.js';

export const orderModel = {
  findByRestaurant: async (restaurantId: number, status?: string): Promise<Order[]> => {
    let sql = 'SELECT * FROM orders WHERE restaurant_id = $1';
    if (status) sql += ' AND status = $2';
    sql += ' ORDER BY created_at DESC';
    const params = status ? [restaurantId, status] : [restaurantId];
    const result = await query(sql, params);
    return result.rows as Order[];
  },
  findById: async (id: number): Promise<Order | null> => {
    const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
    return (result.rows[0] as Order) || null;
  },
  create: async (tableId: number, tableNumber: number, items: OrderItem[], tip: number): Promise<number> => {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      const result = await client.query(
        `INSERT INTO orders (restaurant_id, table_id, customer_name, status, total, tip_amount) 
         VALUES (1, $1, 'Cliente', 'pending', $2, $3) RETURNING id`,
        [tableId, total, tip]
      );
      const orderId = result.rows[0].id;
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
          [orderId, item.product_id, item.product_name, item.quantity, item.unit_price, item.subtotal]
        );
      }
      await client.query('COMMIT');
      return orderId;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  updateStatus: async (id: number, status: string): Promise<void> => {
    await query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
  },
  addReview: async (orderId: number, tableNumber: number, rating: number, comment: string, tipAmount: number): Promise<number> => {
    await query('UPDATE orders SET tip_amount = $1 WHERE id = $2', [tipAmount, orderId]);
    const result = await query(
      'INSERT INTO reviews (restaurant_id, order_id, rating, comment) VALUES (1, $1, $2, $3) RETURNING id',
      [orderId, rating, comment]
    );
    return result.rows[0].id;
  },
  getReviews: async (restaurantId: number): Promise<unknown[]> => {
    const result = await query('SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC', [restaurantId]);
    return result.rows;
  }
};