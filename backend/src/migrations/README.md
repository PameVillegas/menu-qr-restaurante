# Database Migrations

This directory contains database migration files for the Menu Digital QR system.

## Setup

1. Ensure PostgreSQL is installed and running
2. Create a database: `createdb menu_digital_qr`
3. Configure database credentials in `.env` file
4. Run migrations: `npm run migrate`

## Migration Files

- `001_initial_schema.sql` - Initial database schema with tables for restaurants, categories, menu_items, admins, and qr_codes

## Schema Overview

### Tables

- **restaurants**: Restaurant information (name, logo, hours, contact)
- **categories**: Menu categories with ordering
- **menu_items**: Individual menu items with pricing and availability
- **admins**: Restaurant administrators for content management
- **qr_codes**: Generated QR codes for restaurant menus

### Indexes

Optimized indexes for:
- Category ordering and lookup
- Menu item ordering, availability, and category filtering
- Admin email and restaurant lookup
- QR code restaurant lookup

### Features

- UUID primary keys for all tables
- Automatic `updated_at` timestamp updates via triggers
- Cascade deletes for referential integrity
- Check constraints for data validation (e.g., price >= 0)
- JSONB support for flexible contact information storage
