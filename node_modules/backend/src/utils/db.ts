import mysql, { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { config } from './config.js';

export const pool: Pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

pool.getConnection()
  .then(() => console.log('Database connection established'))
  .catch((err) => console.error('Database connection failed:', err));

export const query = async (
  sql: string,
  params?: unknown[]
): Promise<[RowDataPacket[], ResultSetHeader]> => {
  const start = Date.now();
  try {
    const [rows, result]: any = await pool.query(sql, params);
    const duration = Date.now() - start;
    console.log('Executed query', { sql, duration, affectedRows: result?.affectedRows });
    return [rows as RowDataPacket[], result as ResultSetHeader];
  } catch (error) {
    console.error('Query error', { sql, error });
    throw error;
  }
};

export const getConnection = async () => {
  return pool.getConnection();
};

export default pool;