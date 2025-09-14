-- Adding sample data for Churnaizer demo
-- Insert sample users
INSERT INTO users (user_id, email, plan, monthly_revenue, billing_status) VALUES
('user_001', 'john@startup.com', 'Pro', 99.00, 'active'),
('user_002', 'sarah@techco.com', 'Enterprise', 299.00, 'active'),
('user_003', 'mike@saasapp.com', 'Basic', 29.00, 'past_due'),
('user_004', 'lisa@growth.com', 'Pro', 99.00, 'active'),
('user_005', 'david@scale.com', 'Enterprise', 299.00, 'cancelled'),
('user_006', 'emma@innovate.com', 'Basic', 29.00, 'active'),
('user_007', 'alex@build.com', 'Pro', 99.00, 'active'),
('user_008', 'rachel@create.com', 'Basic', 29.00, 'past_due');

-- Insert user activities
INSERT INTO user_activities (user_id, last_login, avg_session_duration, feature_usage_count, support_tickets) VALUES
('user_001', NOW() - INTERVAL '2 hours', 45, 23, 0),
('user_002', NOW() - INTERVAL '1 day', 120, 67, 1),
('user_003', NOW() - INTERVAL '7 days', 15, 3, 2),
('user_004', NOW() - INTERVAL '3 hours', 60, 34, 0),
('user_005', NOW() - INTERVAL '30 days', 5, 1, 3),
('user_006', NOW() - INTERVAL '1 hour', 30, 12, 0),
('user_007', NOW() - INTERVAL '4 hours', 75, 45, 1),
('user_008', NOW() - INTERVAL '14 days', 10, 2, 1);

-- Insert churn predictions
INSERT INTO churn_predictions (user_id, churn_score, risk_level, model_version) VALUES
('user_001', 0.15, 'low', 'v1.0'),
('user_002', 0.25, 'low', 'v1.0'),
('user_003', 0.85, 'high', 'v1.0'),
('user_004', 0.20, 'low', 'v1.0'),
('user_005', 0.95, 'high', 'v1.0'),
('user_006', 0.30, 'medium', 'v1.0'),
('user_007', 0.18, 'low', 'v1.0'),
('user_008', 0.75, 'high', 'v1.0');

-- Insert sample cancellation feedback
INSERT INTO cancellation_feedback (user_id, reason, category) VALUES
('user_005', 'Too expensive for our current needs', 'Pricing'),
('user_003', 'Missing key features we need', 'Features'),
('user_008', 'Found a better alternative', 'Competition');

-- Insert feature usage data
INSERT INTO feature_usage (user_id, feature_name, usage_count, last_used) VALUES
('user_001', 'dashboard', 45, NOW() - INTERVAL '2 hours'),
('user_001', 'reports', 12, NOW() - INTERVAL '1 day'),
('user_002', 'dashboard', 89, NOW() - INTERVAL '1 day'),
('user_002', 'api', 234, NOW() - INTERVAL '3 hours'),
('user_002', 'integrations', 23, NOW() - INTERVAL '2 days'),
('user_003', 'dashboard', 3, NOW() - INTERVAL '7 days'),
('user_004', 'dashboard', 34, NOW() - INTERVAL '3 hours'),
('user_004', 'reports', 8, NOW() - INTERVAL '1 day');

-- Insert retention recommendations
INSERT INTO retention_recommendations (user_id, recommendation_type, recommendation_text, priority, status) VALUES
('user_003', 'email', 'Send reactivation email with feature highlights', 5, 'pending'),
('user_003', 'discount', 'Offer 20% discount for next 3 months', 4, 'pending'),
('user_008', 'call', 'Priority customer success call to understand needs', 5, 'pending'),
('user_006', 'email', 'Send feature adoption email', 2, 'pending');

-- Insert industry benchmarks
INSERT INTO industry_benchmarks (industry, plan_type, avg_churn_rate, sample_size) VALUES
('SaaS Tools', 'Basic', 8.5, 1250),
('SaaS Tools', 'Pro', 5.2, 890),
('SaaS Tools', 'Enterprise', 3.1, 340),
('Analytics', 'Basic', 12.3, 670),
('Analytics', 'Pro', 7.8, 450),
('Analytics', 'Enterprise', 4.2, 180);
