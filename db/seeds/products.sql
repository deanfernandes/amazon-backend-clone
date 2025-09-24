BEGIN;

-- products
INSERT INTO products (
  name,
  description,
  price,
  stock,
  image_url,
  created_at
)
SELECT
  'Product #' || i,
  'This is a description for product #' || i,
  ROUND((random() * 100 + 1)::numeric, 2),  -- price between 1.00 and 100.99
  (random() * 100)::int,                   -- stock between 0 and 100
  'https://example.com/images/product_' || i || '.jpg',
  NOW() - (random() * INTERVAL '365 days')
FROM generate_series(1, 10000) AS s(i);

-- product product options (all 4 options)
INSERT INTO product_product_options (product_id, product_option_id)
SELECT
  p.id,
  o.id
FROM products p
CROSS JOIN product_options o;

-- product product categories (random 1-3 categories)
-- For simplicity: 2 random categories per product
INSERT INTO product_product_categories (product_id, product_category_id)
SELECT
  p.id,
  (1 + floor(random() * 10))::int  -- 10 categories (IDs 1–10)
FROM products p
UNION ALL
SELECT
  p.id,
  (1 + floor(random() * 10))::int
FROM products p;

COMMIT;