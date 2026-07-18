-- Forward-only fixes for databases that have already applied the original migrations.

ALTER TABLE sale_items DROP CONSTRAINT IF EXISTS fk_sale_items_sale;
ALTER TABLE sale_items
  ADD CONSTRAINT fk_sale_items_sale
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories(store_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_customers_store_id ON customers(store_id);
CREATE INDEX IF NOT EXISTS idx_sales_store_id_created_at ON sales(store_id, created_at);
CREATE INDEX IF NOT EXISTS idx_sales_store_id_status ON sales(store_id, status);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_store_users_user_id_store_id ON store_users(user_id, store_id);
