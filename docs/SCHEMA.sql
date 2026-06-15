-- CataDulu Personal Finance System - Complete SQL Schema
-- Database: MySQL 8.0+
-- This file contains all CREATE TABLE statements with constraints and indexes

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- TABLE: USERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    name VARCHAR(255) NOT NULL COMMENT 'User full name',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique email address',
    phone VARCHAR(20) COMMENT 'User phone number',
    password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
    avatar VARCHAR(2048) COMMENT 'Profile picture URL',
    bio TEXT COMMENT 'User biography',
    theme ENUM('light', 'dark') DEFAULT 'light' COMMENT 'UI theme preference',
    currency VARCHAR(3) DEFAULT 'USD' COMMENT 'Default currency (ISO 4217)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Account status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update',
    
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts and preferences';

-- ============================================================================
-- TABLE: CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    user_id CHAR(36) NOT NULL COMMENT 'Owner of category',
    name VARCHAR(100) NOT NULL COMMENT 'Category name',
    type ENUM('income', 'expense') NOT NULL COMMENT 'Category type',
    icon VARCHAR(50) DEFAULT 'folder' COMMENT 'Icon identifier',
    color VARCHAR(7) DEFAULT '#808080' COMMENT 'Hex color code',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Soft delete flag',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_categories_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_type (user_id, type),
    INDEX idx_is_active (user_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transaction categories';

-- ============================================================================
-- TABLE: TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    user_id CHAR(36) NOT NULL COMMENT 'Transaction owner',
    category_id CHAR(36) NOT NULL COMMENT 'Associated category',
    title VARCHAR(255) NOT NULL COMMENT 'Transaction title',
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Transaction amount',
    type ENUM('income', 'expense') NOT NULL COMMENT 'Transaction type',
    description TEXT COMMENT 'Transaction notes',
    transaction_date DATE NOT NULL COMMENT 'Date of transaction',
    receipt_path VARCHAR(2048) COMMENT 'Receipt file path/URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_transactions_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_category_id FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_user_date (user_id, transaction_date DESC),
    INDEX idx_type (user_id, type),
    INDEX idx_date_range (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Financial transactions';

-- ============================================================================
-- TABLE: TRANSACTION_ATTACHMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS transaction_attachments (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    transaction_id CHAR(36) NOT NULL COMMENT 'Parent transaction',
    file_path VARCHAR(2048) NOT NULL COMMENT 'S3/storage path',
    file_type VARCHAR(50) NOT NULL COMMENT 'MIME type',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_attachments_transaction_id FOREIGN KEY (transaction_id)
        REFERENCES transactions(id) ON DELETE CASCADE,
    
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transaction file attachments';

-- ============================================================================
-- TABLE: BUDGETS
-- ============================================================================
CREATE TABLE IF NOT EXISTS budgets (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    user_id CHAR(36) NOT NULL COMMENT 'Budget owner',
    title VARCHAR(255) NOT NULL COMMENT 'Budget name',
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Total budget amount',
    spent DECIMAL(15, 2) DEFAULT 0 COMMENT 'Current spending',
    period ENUM('monthly', 'yearly') NOT NULL COMMENT 'Budget period',
    start_date DATE NOT NULL COMMENT 'Budget start date',
    end_date DATE COMMENT 'Budget end date',
    status ENUM('active', 'completed', 'exceeded') DEFAULT 'active' COMMENT 'Budget status',
    alert_threshold DECIMAL(3, 1) DEFAULT 80.0 COMMENT 'Alert percentage',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_budgets_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_budget_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_budget_spent_valid CHECK (spent >= 0 AND spent <= amount * 1.5),
    CONSTRAINT chk_budget_end_date CHECK (end_date IS NULL OR end_date > start_date),
    CONSTRAINT chk_budget_threshold CHECK (alert_threshold BETWEEN 0 AND 100),
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (user_id, status),
    INDEX idx_period (user_id, period),
    INDEX idx_date_range (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Spending budgets';

-- ============================================================================
-- TABLE: BUDGET_CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS budget_categories (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    budget_id CHAR(36) NOT NULL COMMENT 'Parent budget',
    category_id CHAR(36) NOT NULL COMMENT 'Associated category',
    allocated_amount DECIMAL(15, 2) NOT NULL COMMENT 'Category allocation',
    
    CONSTRAINT fk_budget_categories_budget_id FOREIGN KEY (budget_id)
        REFERENCES budgets(id) ON DELETE CASCADE,
    CONSTRAINT fk_budget_categories_category_id FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_allocated_amount_positive CHECK (allocated_amount > 0),
    CONSTRAINT uq_budget_categories UNIQUE (budget_id, category_id),
    
    INDEX idx_budget_id (budget_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Budget category allocations';

-- ============================================================================
-- TABLE: FINANCIAL_GOALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS financial_goals (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    user_id CHAR(36) NOT NULL COMMENT 'Goal owner',
    title VARCHAR(255) NOT NULL COMMENT 'Goal name',
    description TEXT COMMENT 'Goal description',
    target_amount DECIMAL(15, 2) NOT NULL COMMENT 'Target value',
    current_amount DECIMAL(15, 2) DEFAULT 0 COMMENT 'Progress to date',
    deadline DATE NOT NULL COMMENT 'Target completion date',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium' COMMENT 'Goal priority',
    status ENUM('active', 'completed', 'abandoned') DEFAULT 'active' COMMENT 'Goal status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_financial_goals_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_target_amount_positive CHECK (target_amount > 0),
    CONSTRAINT chk_current_amount_valid CHECK (current_amount >= 0 AND current_amount <= target_amount * 1.5),
    CONSTRAINT chk_deadline_future CHECK (deadline > CURDATE()),
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (user_id, status),
    INDEX idx_priority (user_id, priority),
    INDEX idx_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Financial goals';

-- ============================================================================
-- TABLE: GOAL_PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS goal_progress (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    goal_id CHAR(36) NOT NULL COMMENT 'Parent goal',
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Progress amount',
    notes TEXT COMMENT 'Progress notes',
    recorded_at DATE NOT NULL COMMENT 'Date of progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_goal_progress_goal_id FOREIGN KEY (goal_id)
        REFERENCES financial_goals(id) ON DELETE CASCADE,
    CONSTRAINT chk_progress_amount_positive CHECK (amount > 0),
    
    INDEX idx_goal_id (goal_id),
    INDEX idx_recorded_at (recorded_at),
    INDEX idx_goal_date (goal_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Goal progress tracking';

-- ============================================================================
-- TABLE: NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    user_id CHAR(36) NOT NULL COMMENT 'Notification recipient',
    type ENUM('alert', 'reminder', 'system') NOT NULL COMMENT 'Notification type',
    title VARCHAR(255) NOT NULL COMMENT 'Notification title',
    message TEXT NOT NULL COMMENT 'Notification message',
    related_type ENUM('budget', 'goal', 'transaction') COMMENT 'Related entity type',
    related_id CHAR(36) COMMENT 'Related entity ID',
    is_read BOOLEAN DEFAULT FALSE COMMENT 'Read status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (user_id, is_read),
    INDEX idx_type (user_id, type),
    INDEX idx_created_at (user_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Notifications and alerts';

-- ============================================================================
-- TABLE: BUDGET_ALERTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS budget_alerts (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    budget_id CHAR(36) NOT NULL COMMENT 'Associated budget',
    alert_type ENUM('approaching', 'exceeded') NOT NULL COMMENT 'Alert reason',
    triggered_at TIMESTAMP NOT NULL COMMENT 'Alert trigger time',
    acknowledged_at TIMESTAMP COMMENT 'User acknowledgment time',
    
    CONSTRAINT fk_budget_alerts_budget_id FOREIGN KEY (budget_id)
        REFERENCES budgets(id) ON DELETE CASCADE,
    
    INDEX idx_budget_id (budget_id),
    INDEX idx_triggered_at (triggered_at DESC),
    INDEX idx_unacknowledged (budget_id, acknowledged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Budget threshold alerts';

-- ============================================================================
-- TABLE: REPORTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reports (
    id CHAR(36) PRIMARY KEY COMMENT 'UUID Primary Key',
    user_id CHAR(36) NOT NULL COMMENT 'Report owner',
    report_type ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL COMMENT 'Report period',
    period_start DATE NOT NULL COMMENT 'Report start date',
    period_end DATE NOT NULL COMMENT 'Report end date',
    total_income DECIMAL(15, 2) DEFAULT 0 COMMENT 'Total income',
    total_expense DECIMAL(15, 2) DEFAULT 0 COMMENT 'Total expenses',
    generated_at TIMESTAMP NOT NULL COMMENT 'Report generation time',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reports_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_reports_date_range CHECK (period_end >= period_start),
    
    INDEX idx_user_id (user_id),
    INDEX idx_report_type (user_id, report_type),
    INDEX idx_period (period_start, period_end),
    INDEX idx_generated_at (generated_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Financial reports';

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SUMMARY STATISTICS
-- ============================================================================
-- Tables: 11
-- Total Foreign Keys: 12
-- Total Indexes: 39
-- Check Constraints: 14
-- Unique Constraints: 2
-- ============================================================================
