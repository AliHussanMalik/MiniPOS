DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'inventory_movement_type'
    ) THEN
        CREATE TYPE inventory_movement_type AS ENUM(
            'STOCK_IN',
            'STOCK_OUT',
            'ADJUSTMENT'
        );
    END IF;
END $$ ;

CREATE TABLE IF NOT EXISTS inventory_movements
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    product_id INT NOT NULL
        REFERENCES products(id),

    quantity INT NOT NULL CHECK (quantity >= 0),

    movement_type inventory_movement_type NOT NULL,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
