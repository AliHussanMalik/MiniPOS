CREATE TYPE inventory_movement_type AS ENUM
(
    'STOCK_IN',
    'STOCK_OUT',
    'ADJUSTMENT'
);

CREATE TABLE inventory_movements
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
