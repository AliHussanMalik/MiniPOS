CREATE TABLE IF NOT EXISTS store_users
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    store_id INT NOT NULL
        REFERENCES stores(id)
        ON DELETE CASCADE,

    user_id INT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_store_user UNIQUE (store_id, user_id)
);