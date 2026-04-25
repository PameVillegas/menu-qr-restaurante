import { query } from '../utils/db.js';
import { Table, CreateTableDTO } from './types.js';

export const getTables = async (restaurantId: number): Promise<Table[]> => {
  const result = await query('SELECT * FROM tables WHERE restaurant_id = $1 AND is_active = 1 ORDER BY number', [restaurantId]);
  return result.rows as Table[];
};

export const getTableById = async (id: number): Promise<Table | null> => {
  const result = await query('SELECT * FROM tables WHERE id = $1', [id]);
  return (result.rows[0] as Table) || null;
};

export const createTable = async (data: CreateTableDTO): Promise<Table> => {
  const result = await query(
    'INSERT INTO tables (restaurant_id, number, qr_code) VALUES ($1, $2, $3) RETURNING *',
    [data.restaurant_id, data.number, `MESA-${data.number}`]
  );
  return result.rows[0] as Table;
};

export const updateTable = async (id: number, data: Partial<CreateTableDTO>): Promise<Table> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  
  if (data.number !== undefined) { fields.push(`number = $${i++}`); values.push(data.number); }
  if (data.qr_code !== undefined) { fields.push(`qr_code = $${i++}`); values.push(data.qr_code); }
  
  values.push(id);
  const result = await query(`UPDATE tables SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return result.rows[0] as Table;
};

export const deleteTable = async (id: number): Promise<void> => {
  await query('UPDATE tables SET is_active = 0 WHERE id = $1', [id]);
};

export default { getTables, getTableById, createTable, updateTable, deleteTable };