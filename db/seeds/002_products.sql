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

-- product product categories (random 1-3 categories per product, ensuring no duplicates)
INSERT INTO product_product_categories (product_id, product_category_id)
SELECT DISTINCT
  p.id,
  cat_id
FROM products p
CROSS JOIN LATERAL (
  SELECT (1 + floor(random() * 10))::int AS cat_id
  UNION ALL
  SELECT (1 + floor(random() * 10))::int AS cat_id
  UNION ALL
  SELECT (1 + floor(random() * 10))::int AS cat_id
) AS categories
WHERE random() < 0.8;  -- roughly 2-3 categories per product on average

COMMIT;