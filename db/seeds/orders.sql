-- orders (100 records)
INSERT INTO user_orders (
    created_at,
    user_id,
    user_order_delivery_option_id,
    user_order_status_id
)
SELECT
    NOW() - (random() * INTERVAL '30 days'),  -- random created_at in last 30 days
    (1 + floor(random() * (SELECT MAX(id) FROM users)))::bigint,  -- random user_id from users
    (1 + floor(random() * 2))::bigint,  -- delivery option id: 1 to 3 (your 3 delivery options)
    (1 + floor(random() * 4))::bigint   -- status id: 1 to 5 (your 5 statuses)
FROM generate_series(1, 100);
