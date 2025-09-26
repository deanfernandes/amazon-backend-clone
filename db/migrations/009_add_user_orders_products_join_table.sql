-- up
CREATE TABLE user_order_products (
    user_order_id BIGINT NOT NULL REFERENCES user_orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    product_price NUMERIC(10, 2) NOT NULL CHECK(product_price > 0),
    quantity SMALLINT NOT NULL CHECK(quantity > 0),
    PRIMARY KEY (user_order_id, product_id)
);

-- down
--DROP TABLE user_order_products;
