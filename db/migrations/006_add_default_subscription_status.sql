-- up
ALTER TABLE user_subscriptions
ALTER COLUMN user_subscription_status_id SET DEFAULT 1;

-- down
--ALTER TABLE user_subscriptions
--ALTER COLUMN user_subscription_status_id DROP DEFAULT;