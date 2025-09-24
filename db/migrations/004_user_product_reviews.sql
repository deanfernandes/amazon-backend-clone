CREATE TABLE user_product_reviews (
    id BIGSERIAL PRIMARY KEY,
    content TEXT CHECK(char_length(content) > 0),
    rating SMALLINT NOT NULL CHECK(rating BETWEEN 0 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);