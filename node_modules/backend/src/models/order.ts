import { query } from '../utils/db.js';
import { ResultSetHeader } from '../models/types.js';

export const orderModel = {
  async create(tableId: number, tableNumber: string, items: { product_id: number; name: string; price: number; quantity: number }[], tip: number = 0): Promise<number> {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const [result] = await query<ResultSetHeader>(
      'INSERT INTO orders (table_id, table_number, total, tip) VALUES (?, ?, ?, ?)',
      [tableId, tableNumber, total, tip]
    );
    
    const orderId = result.insertId;
    
    for (const item of items) {
      await query<ResultSetHeader>(
        'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.name, item.price, item.quantity, item.price * item.quantity]
      );
    }
    
    return orderId;
  },

  async findByRestaurant(restaurantId: number, status?: string): Promise<any[]> {
    let sql = `
      SELECT o.*, t.number as table_num 
      FROM orders o 
      JOIN \`tables\` t ON o.table_id = t.id 
      WHERE t.restaurant_id = ?
    `;
    const params: any[] = [restaurantId];
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY o.created_at DESC';
    
    const [rows] = await query<any[]>(sql, params);
    
    for (const order of rows) {
      const [items] = await query<any[]>(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }
    
    return rows;
  },

  async findByTable(tableId: number): Promise<any[]> {
    const [rows] = await query<any[]>(
      'SELECT * FROM orders WHERE table_id = ? ORDER BY created_at DESC',
      [tableId]
    );
    return rows;
  },

  async updateStatus(orderId: number, status: string): Promise<boolean> {
    const [result] = await query<ResultSetHeader>(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    return result.affectedRows > 0;
  },

  async addReview(orderId: number, tableNumber: string, rating: number, comment: string, tipAmount: number): Promise<number> {
    const [result] = await query<ResultSetHeader>(
      'INSERT INTO reviews (order_id, table_number, rating, comment, tip_amount) VALUES (?, ?, ?, ?, ?)',
      [orderId, tableNumber, rating, comment, tipAmount]
    );
    return result.insertId;
  },

  async getReviews(restaurantId: number): Promise<any[]> {
    const [rows] = await query<any[]>(`
      SELECT r.*, o.table_number 
      FROM reviews r 
      JOIN orders o ON r.order_id = o.id
      JOIN \`tables\` t ON o.table_id = t.id
      WHERE t.restaurant_id = ?
      ORDER BY r.created_at DESC
    `, [restaurantId]);
    return rows;
  },
};