CREATE TABLE IF NOT EXISTS products
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    category_id INT NOT NULL 
    references categories(id),
    barcode VARCHAR(150) UNIQUE,
    sku VARCHAR(50) UNIQUE,
    description TEXT ,
    cost_price numeric(10,2) NOT NULL CHECK (cost_price >= 0 ) ,
    selling_price numeric(10,2) not NULL CHECK (selling_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    minimum_stock INT NOT NULL DEFAULT 0 CHECK ( minimum_stock >= 0),
    unit VARCHAR(20) NOT NULL,
    is_active BOOLEAN not null DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    deleted_at TIMESTAMPTZ  
);