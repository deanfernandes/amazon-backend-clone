-- orders (100 records)
INSERT INTO user_orders (
    created_at,
    user_id,
    user_order_delivery_option_id,
    user_order_status_id
)
SELECT
    NOW() - (random() * INTERVAL '30 days'),  -- random created_at in last 30 days
    (SELECT id FROM users ORDER BY random() LIMIT 1),  -- random existing user_id
    (1 + floor(random() * 2))::bigint,  -- delivery option id: 1 to 2 (corrected range)
    (1 + floor(random() * 4))::bigint   -- status id: 1 to 4 (corrected range)
FROM generate_series(1, 100);