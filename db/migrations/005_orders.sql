CREATE TABLE user_order_delivery_options (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL CHECK(price > 0)
);
INSERT INTO user_order_delivery_options (name, price) VALUES
  ('Standard Shipping', 5.00),
  ('Premium Shipping', 15.00),
  ('Digital Shipping', 0.00);

CREATE TABLE user_order_statuses (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO user_order_statuses (name) VALUES
  ('processing'),
  ('shipped'),
  ('delivered'),
  ('cancelled'),
  ('returned');

CREATE TABLE user_orders (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_order_delivery_option_id BIGINT NOT NULL REFERENCES user_order_delivery_options(id) ON DELETE CASCADE,
    user_order_status_id BIGINT NOT NULL REFERENCES user_order_statuses(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_orders_user_id ON user_orders(user_id);