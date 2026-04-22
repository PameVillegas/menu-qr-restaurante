# Database Setup Guide

## PostgreSQL Configuration

This project uses PostgreSQL as the primary database with a connection pool managed by the `pg` library.

## Quick Start

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   createdb menu_digital_qr
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and update database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=menu_digital_qr
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

4. **Run Migrations**
   ```bash
   npm run migrate
   ```

## Database Schema

### Tables

#### restaurants
Stores restaurant information
- `id` (UUID, PK)
- `name` (VARCHAR, required)
- `logo_url` (TEXT)
- `hours` (TEXT)
- `contact_info` (JSONB)
- `created_at`, `updated_at` (TIMESTAMP)

#### categories
Menu categories with ordering
- `id` (UUID, PK)
- `restaurant_id` (UUID, FK → restaurants)
- `name` (VARCHAR, required)
- `display_order` (INTEGER, required)
- `created_at`, `updated_at` (TIMESTAMP)
- UNIQUE constraint on (restaurant_id, display_order)

#### menu_items
Individual menu items
- `id` (UUID, PK)
- `category_id` (UUID, FK → categories)
- `name` (VARCHAR, required)
- `description` (TEXT)
- `price` (DECIMAL(10,2), required, CHECK >= 0)
- `image_url` (TEXT)
- `thumbnail_url` (TEXT)
- `available` (BOOLEAN, default true)
- `display_order` (INTEGER, required)
- `created_at`, `updated_at` (TIMESTAMP)
- UNIQUE constraint on (category_id, display_order)

#### admins
Restaurant administrators
- `id` (UUID, PK)
- `restaurant_id` (UUID, FK → restaurants)
- `email` (VARCHAR, required, UNIQUE)
- `password_hash` (VARCHAR, required)
- `name` (VARCHAR, required)
- `created_at`, `updated_at` (TIMESTAMP)

#### qr_codes
Generated QR codes
- `id` (UUID, PK)
- `restaurant_id` (UUID, FK → restaurants)
- `qr_image_url` (TEXT, required)
- `created_at` (TIMESTAMP)

### Indexes

Performance-optimized indexes:
- `idx_categories_order`: (restaurant_id, display_order)
- `idx_categories_restaurant`: (restaurant_id)
- `idx_items_order`: (category_id, available DESC, display_order)
- `idx_items_category`: (category_id)
- `idx_items_available`: (available)
- `idx_admins_email`: (email)
- `idx_admins_restaurant`: (restaurant_id)
- `idx_qr_codes_restaurant`: (restaurant_id)

### Features

- **UUID Primary Keys**: All tables use UUIDs for better distribution and security
- **Automatic Timestamps**: `updated_at` is automatically updated via triggers
- **Cascade Deletes**: Foreign keys cascade on delete for data integrity
- **Check Constraints**: Price validation (>= 0)
- **JSONB Support**: Flexible contact information storage

## Connection Pool

The database connection is managed through a connection pool with the following configuration:

- **Max Connections**: 20
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 2 seconds

### Usage

```typescript
import { query, getClient } from './utils/db.js';

// Simple query
const result = await query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);

// Transaction
const client = await getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO ...');
  await client.query('UPDATE ...');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Testing

Run database tests:
```bash
npm test -- db.test.ts
```

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l`

### Migration Errors
- Check PostgreSQL version (requires 12+)
- Verify pgcrypto extension is available
- Review migration logs for specific errors

### Performance Issues
- Monitor connection pool usage
- Check index usage with EXPLAIN ANALYZE
- Review slow query logs
