import { query } from './db.js';

export async function seedTables() {
  try {
    console.log('Verificando restaurante...');
    
    // Check if restaurant exists
    const restaurantResult = await query('SELECT COUNT(*) as count FROM restaurants WHERE id = 1');
    const restaurantCount = parseInt(restaurantResult.rows[0].count);
    
    if (restaurantCount === 0) {
      console.log('Creando restaurante...');
      await query(
        `INSERT INTO restaurants (id, name, slug, description, phone, address, logo_url, banner_url, theme_primary, theme_secondary, is_active) 
         VALUES (1, 'Mi Restaurante', 'mi-restaurante', 'Bienvenidos a nuestro restaurante', '+54 11 1234-5678', 'Calle Principal 123', '/logosarmiento.jpeg', '', '#10b981', '#059669', true)`
      );
      console.log('✅ Restaurante creado');
    } else {
      console.log(`✅ Restaurante ya existe`);
    }
    
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
    console.error('Error en seed:', error.message);
  }
}
