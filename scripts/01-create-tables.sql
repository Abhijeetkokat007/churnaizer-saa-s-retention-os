-- Creating database schema for Churnaizer retention analytics
-- Users table to store customer information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL, -- External user ID from client
  email VARCHAR(255),
  plan VARCHAR(100),
  monthly_revenue DECIMAL(10,2),
  billing_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(user_id),
  last_login TIMESTAMP,
  avg_session_duration INTEGER, -- in minutes
  feature_usage_count INTEGER DEFAULT 0,
  support_tickets INTEGER DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Churn predictions and scores
CREATE TABLE IF NOT EXISTS churn_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(user_id),
  churn_score DECIMAL(3,2), -- 0.00 to 1.00
  risk_level VARCHAR(20), -- 'low', 'medium', 'high'
  prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  model_version VARCHAR(50)
);

-- Cancellation feedback
CREATE TABLE IF NOT EXISTS cancellation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(user_id),
  reason TEXT,
  category VARCHAR(100), -- Will be populated by AI clustering
  feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed BOOLEAN DEFAULT FALSE
);

-- Feature usage tracking
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(user_id),
  feature_name VARCHAR(255),
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Retention recommendations
CREATE TABLE IF NOT EXISTS retention_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(user_id),
  recommendation_type VARCHAR(100), -- 'email', 'discount', 'call', etc.
  recommendation_text TEXT,
  priority INTEGER DEFAULT 1, -- 1-5 scale
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'completed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP
);

-- Industry benchmarks (aggregated data)
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry VARCHAR(100),
  plan_type VARCHAR(100),
  avg_churn_rate DECIMAL(5,2),
  sample_size INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_churn_predictions_user_id ON churn_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_churn_predictions_risk_level ON churn_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_cancellation_feedback_user_id ON cancellation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_recommendations_user_id ON retention_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_recommendations_status ON retention_recommendations(status);
