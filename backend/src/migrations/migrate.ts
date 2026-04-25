import { pool } from '../utils/db.js';

const migrations = `
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  logo_url TEXT,
  banner_url TEXT,
  primary_color VARCHAR(20) DEFAULT '#10b981',
  secondary_color VARCHAR(20) DEFAULT '#1f2937',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tables (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  number INTEGER NOT NULL,
  qr_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  table_id INTEGER REFERENCES tables(id),
  customer_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10,2) DEFAULT 0,
  tip_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id),
  order_id INTEGER REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function runMigrations() {
  console.log('Running migrations...');
  try {
    await pool.query(migrations);
    console.log('Migrations completed successfully');
    
    const restaurantCheck = await pool.query('SELECT COUNT(*) FROM restaurants');
    if (parseInt(restaurantCheck.rows[0].count) === 0) {
      console.log('Creating sample data...');
      await pool.query(`
        INSERT INTO restaurants (name, slug, primary_color) 
        VALUES ('Restaurante Sarmiento', 'restaurante-sarmiento', '#10b981');
      `);
      const resId = await pool.query("SELECT id FROM restaurants WHERE slug = 'restaurante-sarmiento'");
      const restaurantId = resId.rows[0].id;
      
      await pool.query(`
        INSERT INTO categories (restaurant_id, name, sort_order) VALUES
        ($1, 'Entradas', 1),
        ($1, 'Principales', 2),
        ($1, 'Bebidas', 3),
        ($1, 'Postres', 4);
      `, [restaurantId]);
      
      const catResult = await pool.query('SELECT id, name FROM categories WHERE restaurant_id = $1', [restaurantId]);
      
      for (const cat of catResult.rows) {
        if (cat.name === 'Entradas') {
          await pool.query(`
            INSERT INTO products (category_id, name, price) VALUES
            ($1, 'Empanadas (6 unidades)', 1200),
            ($1, 'Bruschettas', 1800);
          `, [cat.id]);
        } else if (cat.name === 'Principales') {
          await pool.query(`
            INSERT INTO products (category_id, name, price) VALUES
            ($1, 'Milanesa con puré', 3500),
            ($1, 'Pastas caseras', 2800),
            ($1, 'Bife de chorizo', 4200);
          `, [cat.id]);
        } else if (cat.name === 'Bebidas') {
          await pool.query(`
            INSERT INTO products (category_id, name, price) VALUES
            ($1, 'Gaseosa', 500),
            ($1, 'Jugo natural', 800),
            ($1, 'Agua mineral', 400);
          `, [cat.id]);
        } else if (cat.name === 'Postres') {
          await pool.query(`
            INSERT INTO products (category_id, name, price) VALUES
            ($1, 'Flan casero', 900),
            ($1, 'Helado artesanal', 1100);
          `, [cat.id]);
        }
      }
      
      await pool.query(`
        INSERT INTO tables (restaurant_id, number, qr_code) VALUES
        ($1, 1, 'QR-MESA-1'),
        ($1, 2, 'QR-MESA-2'),
        ($1, 3, 'QR-MESA-3');
      `, [restaurantId]);
      
      console.log('Sample data created successfully');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();