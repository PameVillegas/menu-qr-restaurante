import { query } from '../utils/db.js';
import { Table, CreateTableDTO, ResultSetHeader } from '../models/types.js';

export const tableModel = {
  async findByRestaurant(restaurantId: number): Promise<Table[]> {
    const [rows] = await query<Table[]>(
      'SELECT * FROM tables WHERE restaurant_id = ? AND is_active = 1 ORDER BY number',
      [restaurantId]
    );
    return rows;
  },

  async findById(id: number): Promise<Table | null> {
    const [rows] = await query<Table[]>(
      'SELECT * FROM tables WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByQrCode(qrCode: string): Promise<Table | null> {
    const [rows] = await query<Table[]>(
      'SELECT t.*, r.name as restaurant_name, r.slug as restaurant_slug FROM tables t JOIN restaurants r ON t.restaurant_id = r.id WHERE t.qr_code = ? AND t.is_active = 1 AND r.is_active = 1',
      [qrCode]
    );
    return rows[0] || null;
  },

  async create(data: CreateTableDTO): Promise<number> {
    const qrCode = `${data.restaurant_id}-${data.number}-${Date.now()}`;
    const [result] = await query<ResultSetHeader>(
      'INSERT INTO tables (restaurant_id, number, qr_code) VALUES (?, ?, ?)',
      [data.restaurant_id, data.number, qrCode]
    );
    return result.insertId;
  },

  async createBulk(restaurantId: number, numbers: string[]): Promise<number> {
    let inserted = 0;
    for (const number of numbers) {
      await this.create({ restaurant_id: restaurantId, number });
      inserted++;
    }
    return inserted;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await query<ResultSetHeader>(
      'UPDATE tables SET is_active = 0 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};
