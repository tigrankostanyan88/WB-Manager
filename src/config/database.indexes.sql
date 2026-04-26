-- Users table indexes
ALTER TABLE users ADD INDEX idx_users_email (email);
ALTER TABLE users ADD INDEX idx_users_role (role);
ALTER TABLE users ADD INDEX idx_users_deleted (deleted);
ALTER TABLE users ADD INDEX idx_users_email_deleted (email, deleted);

-- Files table indexes (frequently joined)
ALTER TABLE files ADD INDEX idx_files_table (table_name, row_id);
ALTER TABLE files ADD INDEX idx_files_name_used (name_used);
ALTER TABLE files ADD INDEX idx_files_table_name_used (table_name, row_id, name_used);

-- Reviews table indexes
ALTER TABLE reviews ADD INDEX idx_reviews_user_id (user_id);
ALTER TABLE reviews ADD INDEX idx_reviews_created (createdAt);
ALTER TABLE reviews ADD INDEX idx_reviews_user_created (user_id, createdAt);

-- Student Courses table indexes
ALTER TABLE student_courses ADD INDEX idx_student_courses_user (user_id);
ALTER TABLE student_courses ADD INDEX idx_student_courses_course (course_id);
ALTER TABLE student_courses ADD INDEX idx_student_courses_user_course (user_id, course_id);
ALTER TABLE student_courses ADD INDEX idx_student_courses_status (status);
ALTER TABLE student_courses ADD INDEX idx_student_courses_user_status (user_id, status);

-- Courses table indexes
ALTER TABLE courses ADD INDEX idx_courses_slug (slug);
ALTER TABLE courses ADD INDEX idx_courses_status (status);

-- Modules table indexes
ALTER TABLE modules ADD INDEX idx_modules_course (course_id);
ALTER TABLE modules ADD INDEX idx_modules_order (course_id, `order`);

-- FAQ table indexes
ALTER TABLE faqs ADD INDEX idx_faqs_order (`order`);

-- Contact Messages table indexes
ALTER TABLE contact_messages ADD INDEX idx_contact_created (createdAt);

-- Hero Content - usually single row, but add index for consistency
ALTER TABLE hero_contents ADD INDEX idx_hero_id (id);

-- Settings - singleton pattern
ALTER TABLE settings ADD INDEX idx_settings_id (id);

-- Instructor table indexes
ALTER TABLE instructors ADD INDEX idx_instructor_id (id);

-- Payment/Bank Card indexes (if used frequently)
ALTER TABLE payments ADD INDEX idx_payments_user (user_id);
ALTER TABLE payments ADD INDEX idx_payments_status (status);
ALTER TABLE bank_cards ADD INDEX idx_bank_cards_user (user_id);

-- Composite indexes for common query patterns
-- For review queries with user and file info
ALTER TABLE files ADD INDEX idx_files_user_avatar (table_name, row_id, name_used) 
    WHERE table_name = 'users' AND name_used = 'user_img';

-- For course listing with modules
ALTER TABLE modules ADD INDEX idx_modules_course_order (course_id, `order`, createdAt);

-- For student dashboard queries
ALTER TABLE student_courses ADD INDEX idx_student_dashboard 
    (user_id, status, createdAt DESC);

-- Full-text search indexes (for search functionality)
ALTER TABLE users ADD FULLTEXT INDEX ft_users_name_email (name, email);
ALTER TABLE courses ADD FULLTEXT INDEX ft_courses_title_desc (title, description);
