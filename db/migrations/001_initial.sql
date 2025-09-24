-- TODO: up and down?
-- users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_addresses (
    id BIGSERIAL PRIMARY KEY,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    postcode TEXT NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TYPE user_payment_method_type AS ENUM ('credit_card', 'paypal');
-- TODO: encrypt card numbers
CREATE TABLE user_payment_methods (
    id BIGSERIAL PRIMARY KEY,
    type user_payment_method_type NOT NULL,
    -- credit card
    card_number TEXT UNIQUE,
    cardholder_name TEXT,
    security_code TEXT,
    expiry_month SMALLINT,
    expiry_year SMALLINT,
    -- paypal
    paypal_email TEXT,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE

    CHECK (
        (type = 'credit_card' AND
            card_number IS NOT NULL AND
            cardholder_name IS NOT NULL AND
            security_code IS NOT NULL AND
            expiry_month IS NOT NULL AND
            expiry_year IS NOT NULL AND
            paypal_email IS NULL
        )
        OR
        (type = 'paypal' AND
            paypal_email IS NOT NULL AND
            card_number IS NULL AND
            cardholder_name IS NULL AND
            security_code IS NULL AND
            expiry_month IS NULL AND
            expiry_year IS NULL
        )
    )
);

CREATE TABLE user_subscription_plans (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    duration_days SMALLINT NOT NULL CHECK (duration_days > 0)
);
INSERT INTO user_subscription_plans (name, price, duration_days) VALUES ('Monthly', 9.99, 30), ('Annual', 99.99, 365);

CREATE TABLE user_subscription_statuses (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
INSERT INTO user_subscription_statuses (name) VALUES ('active'), ('expired'), ('cancelled');

CREATE TABLE user_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_subscription_status_id BIGINT NOT NULL REFERENCES user_subscription_statuses(id) ON DELETE CASCADE,
    user_subscription_plan_id BIGINT NOT NULL REFERENCES user_subscription_plans(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions (user_id);
CREATE UNIQUE INDEX one_active_subscription_per_user ON user_subscriptions(user_id) WHERE user_subscription_status_id = 1; -- 1 = active