BEGIN;

-- users (1 million)
INSERT INTO users (email, password_hash, name, is_email_verified, created_at)
SELECT
'user' || i || '@example.com',
md5(random()::text),  -- dummy hashed password
'User ' || i,
(random() < 0.5),
NOW() - (random() * INTERVAL '365 days')
FROM generate_series(1, 1000000) AS i;

-- user addresses
INSERT INTO user_addresses (address_line_1, address_line_2, postcode, user_id)
SELECT
'123 Street #' || id,
NULL,
LPAD((floor(random() * 90000) + 10000)::text, 5, '0'),
id
FROM users;

-- user payment methods (50% credit card, 50% paypal)
INSERT INTO user_payment_methods (
    type, card_number, cardholder_name, security_code,
    expiry_month, expiry_year, paypal_email, user_id
)
SELECT
  type::user_payment_method_type,
  CASE
    WHEN type = 'credit_card'
    THEN '411111111111' || LPAD(id::text, 7, '0')
    ELSE NULL
  END,
  CASE
    WHEN type = 'credit_card'
    THEN 'Cardholder ' || id
    ELSE NULL
  END,
  CASE
    WHEN type = 'credit_card'
    THEN LPAD((floor(random()*900)+100)::text, 3, '0')
    ELSE NULL
  END,
  CASE
    WHEN type = 'credit_card'
    THEN (1 + floor(random()*12))::int
    ELSE NULL
  END,
  CASE
    WHEN type = 'credit_card'
    THEN (2025 + floor(random()*5))::int
    ELSE NULL
  END,
  CASE
    WHEN type = 'paypal'
    THEN 'paypal' || id || '@example.com'
    ELSE NULL
  END,
  id
FROM (
  SELECT
    id,
    CASE WHEN random() < 0.5 THEN 'credit_card' ELSE 'paypal' END AS type
  FROM users
) AS u;

-- user subscriptions
INSERT INTO user_subscriptions (
    start_date, end_date, user_id,
    user_subscription_status_id, user_subscription_plan_id
)
SELECT
NOW() - (random() * INTERVAL '365 days') AS start_date,
NOW() + (random() * INTERVAL '30 days') AS end_date,
id,
(1 + floor(random() * 3))::int,  -- 1 to 3: active, expired, cancelled
(1 + floor(random() * 2))::int   -- 1 or 2: Monthly, Annual
FROM users;

-- user wishlists (one per user)
INSERT INTO user_wishlists (user_id)
SELECT id FROM users;

COMMIT;