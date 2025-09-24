CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK(price > 0),
    stock INTEGER NOT NULL CHECK(stock >= 0),
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_options (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE product_product_options (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_option_id BIGINT NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,

    PRIMARY KEY (product_id, product_option_id)
);

CREATE TABLE product_option_values (
    id BIGSERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    product_option_id BIGINT NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
    UNIQUE(value, product_option_id)
);

CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE product_product_categories (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_category_id BIGINT NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,

    PRIMARY KEY (product_id, product_category_id)
);