-- up
ALTER TABLE user_orders
ALTER COLUMN user_order_status_id SET DEFAULT 1;

-- down
--ALTER TABLE user_orders
--ALTER COLUMN user_order_status_id DROP DEFAULT;