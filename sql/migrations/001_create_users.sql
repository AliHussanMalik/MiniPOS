    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_type
            WHERE typname = 'user_role'
        ) THEN
            CREATE TYPE user_role AS ENUM (
                'OWNER',
                'CUSTOMER'
            );
        END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS users
    (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

        full_name VARCHAR(100) NOT NULL,

        email VARCHAR(255) NOT NULL UNIQUE,

        password VARCHAR(255) NOT NULL,

        role user_role NOT NULL DEFAULT 'CUSTOMER',

        is_active BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );