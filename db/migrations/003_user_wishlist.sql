CREATE TABLE user_wishlist (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_wishlist_products (
    user_wishlist_id BIGINT NOT NULL REFERENCES user_wishlist(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    PRIMARY KEY (user_wishlist_id, product_id)
);