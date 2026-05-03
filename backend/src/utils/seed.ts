import { query } from './db.js';

export async function seedTables() {
  try {
    console.log('Verificando mesas...');
    
    // Check if tables exist
    const result = await query('SELECT COUNT(*) as count FROM tables WHERE restaurant_id = 1');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('Creando mesas...');
      
      // Create 10 tables
      for (let i = 1; i <= 10; i++) {
        await query(
          'INSERT INTO tables (restaurant_id, number, capacity, status) VALUES ($1, $2, $3, $4)',
          [1, String(i), 4, 'available']
        );
        console.log(`✅ Mesa ${i} creada`);
      }
      
      console.log('✅ Todas las mesas creadas');
    } else {
      console.log(`✅ Ya existen ${count} mesas`);
    }
  } catch (error: any) {
    console.error('Error al crear mesas:', error.message);
  }
}
