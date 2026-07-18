-- Migration to add store_id to tables and adjust unique constraints to store level

-- 1. Alter categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS store_id INT REFERENCES stores(id) ON DELETE CASCADE;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE categories ADD CONSTRAINT uq_store_category UNIQUE (store_id, name);

-- 2. Alter products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id INT REFERENCES stores(id) ON DELETE CASCADE;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_name_key;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_barcode_key;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sku_key;
ALTER TABLE products ADD CONSTRAINT uq_store_product_name UNIQUE (store_id, name);
ALTER TABLE products ADD CONSTRAINT uq_store_product_barcode UNIQUE (store_id, barcode);
ALTER TABLE products ADD CONSTRAINT uq_store_product_sku UNIQUE (store_id, sku);

-- 3. Alter customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS store_id INT REFERENCES stores(id) ON DELETE CASCADE;
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_phone_key;
ALTER TABLE customers ADD CONSTRAINT uq_store_customer_phone UNIQUE (store_id, phone);

-- 4. Alter sales table
ALTER TABLE sales ADD COLUMN IF NOT EXISTS store_id INT REFERENCES stores(id) ON DELETE CASCADE;
