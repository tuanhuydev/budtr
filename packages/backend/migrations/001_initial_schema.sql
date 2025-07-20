-- Initial database schema for Budtr
-- This file will be executed when PostgreSQL container starts

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(50) DEFAULT 'monthly', -- monthly, weekly, yearly
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    transaction_type VARCHAR(20) DEFAULT 'expense', -- expense, income
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- Insert sample data for development
INSERT INTO users (email, password_hash, name) VALUES 
('demo@budtr.com', '$2a$10$dummy.hash.for.demo.user', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO budgets (user_id, name, amount, period) VALUES 
(1, 'Monthly Groceries', 500.00, 'monthly'),
(1, 'Entertainment', 200.00, 'monthly')
ON CONFLICT DO NOTHING;
