-- Performance Optimization Indexes
-- Run this script to add indexes for frequently queried fields

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Files table indexes
CREATE INDEX IF NOT EXISTS idx_files_row_id ON files(row_id);
CREATE INDEX IF NOT EXISTS idx_files_name_used ON files(name_used);
CREATE INDEX IF NOT EXISTS idx_files_table_name ON files(table_name);
CREATE INDEX IF NOT EXISTS idx_files_row_name_used ON files(row_id, name_used); -- Composite index for user avatar queries

-- Courses table indexes
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Instructor table indexes
CREATE INDEX IF NOT EXISTS idx_instructor_created_at ON instructor(createdAt);

-- Note: This script should be run in production after deployment
-- Use: mysql -u username -p database_name < src/config/performance-indexes.sql
