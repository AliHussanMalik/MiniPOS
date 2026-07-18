DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'payment_method'
    ) THEN
        CREATE TYPE payment_method AS ENUM (
            'CASH',
            'CARD',
            'ONLINE'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'sale_status'
    ) THEN
        CREATE TYPE sale_status AS ENUM (
            'COMPLETED',
            'CANCELLED'
        );
    END IF;
END $$ ;


CREATE TABLE IF NOT EXISTS sales
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    customer_id INT
        REFERENCES customers(id),

    user_id INT NOT NULL
        REFERENCES users(id),

    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),

    discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),

    tax NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),

    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),

    payment_method payment_method NOT NULL,

    status sale_status NOT NULL DEFAULT 'COMPLETED',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);