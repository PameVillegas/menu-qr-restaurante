// Script para crear mesas en producción
// Ejecutar con: node create-tables-prod.js

const DATABASE_URL = process.env.DATABASE_URL || 'tu-database-url-aqui';

async function createTables() {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  try {
    console.log('Conectando a la base de datos...');
    
    // Crear 10 mesas
    for (let i = 1; i <= 10; i++) {
      const result = await pool.query(
        'INSERT INTO tables (restaurant_id, number, capacity, status) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id',
        [1, String(i), 4, 'available']
      );
      if (result.rows.length > 0) {
        console.log(`✅ Mesa ${i} creada (ID: ${result.rows[0].id})`);
      } else {
        console.log(`⚠️  Mesa ${i} ya existe`);
      }
    }
    
    console.log('\n✅ Proceso completado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTables();
