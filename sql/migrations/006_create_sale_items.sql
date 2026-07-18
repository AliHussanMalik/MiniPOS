CREATE TABLE IF NOT EXISTS sale_items
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sale_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL CHECK (quantity > 0),

    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),

    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sale_items_sale
        FOREIGN KEY (sale_id)
        REFERENCES sales(id),

    CONSTRAINT fk_sale_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);