-- ============================================
-- Traffic Management System - Database Schema
-- ============================================
-- Description: Creates the database schema for traffic violation management
-- Author: Traffic Management Team
-- Date: February 2026
-- Database: PostgreSQL
-- ============================================

-- Create database (run this separately if needed)
-- CREATE DATABASE traffic_management_db;

-- Connect to database
-- \c traffic_management_db;

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS roads CASCADE;
DROP TABLE IF EXISTS signals CASCADE;
DROP TABLE IF EXISTS violations CASCADE;

-- ============================================
-- Table: violations
-- Description: Stores all traffic violation records
-- ============================================
CREATE TABLE violations (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Vehicle Information
    vehicle_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    
    -- Violation Details
    helmet_violation BOOLEAN NOT NULL DEFAULT FALSE,
    overloading_violation BOOLEAN NOT NULL DEFAULT FALSE,
    passenger_count INTEGER NOT NULL,
    
    -- Location and Time
    location VARCHAR(100) NOT NULL,
    violation_date_time TIMESTAMP NOT NULL,
    
    -- Additional Information
    remarks VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Add comments to table and columns
COMMENT ON TABLE violations IS 'Traffic violation records';
COMMENT ON COLUMN violations.vehicle_number IS 'Vehicle registration number';
COMMENT ON COLUMN violations.vehicle_type IS 'Type of vehicle (Motorcycle, Scooter, etc.)';
COMMENT ON COLUMN violations.helmet_violation IS 'True if rider not wearing helmet';
COMMENT ON COLUMN violations.overloading_violation IS 'True if more than 2 persons';
COMMENT ON COLUMN violations.passenger_count IS 'Number of persons on vehicle';
COMMENT ON COLUMN violations.location IS 'Location where violation occurred';
COMMENT ON COLUMN violations.violation_date_time IS 'Date and time of violation';
COMMENT ON COLUMN violations.remarks IS 'Additional notes or observations';
COMMENT ON COLUMN violations.status IS 'Status: PENDING, REVIEWED, or RESOLVED';

-- ============================================
-- Create Indexes for Performance
-- ============================================
CREATE INDEX idx_vehicle_number ON violations(vehicle_number);
CREATE INDEX idx_status ON violations(status);
CREATE INDEX idx_violation_date ON violations(violation_date_time);
CREATE INDEX idx_location ON violations(location);
CREATE INDEX idx_helmet_violation ON violations(helmet_violation);
CREATE INDEX idx_overloading_violation ON violations(overloading_violation);

-- ============================================
-- Create Trigger for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_violations_updated_at
    BEFORE UPDATE ON violations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Create a view for statistics
-- ============================================
CREATE OR REPLACE VIEW violation_statistics AS
SELECT 
    COUNT(*) as total_violations,
    SUM(CASE WHEN helmet_violation = TRUE THEN 1 ELSE 0 END) as helmet_violations,
    SUM(CASE WHEN overloading_violation = TRUE THEN 1 ELSE 0 END) as overloading_violations,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_violations,
    SUM(CASE WHEN status = 'REVIEWED' THEN 1 ELSE 0 END) as reviewed_violations,
    SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) as resolved_violations
FROM violations;

-- ============================================
-- Table: signals
-- Description: Stores traffic signal state and uptime
-- ============================================
CREATE TABLE signals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(150) NOT NULL,
    state VARCHAR(20) NOT NULL DEFAULT 'RED',
    uptime NUMERIC(5,2) DEFAULT 99.00,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_signal_state CHECK (state IN ('RED', 'YELLOW', 'GREEN'))
);

CREATE INDEX idx_signals_state ON signals(state);
CREATE INDEX idx_signals_location ON signals(location);

COMMENT ON TABLE signals IS 'Traffic signal control data';
COMMENT ON COLUMN signals.state IS 'Signal state: RED, YELLOW, GREEN';
COMMENT ON COLUMN signals.uptime IS 'Operational uptime percentage';

-- ============================================
-- Table: roads
-- Description: Stores road condition and congestion details
-- ============================================
CREATE TABLE roads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    zone VARCHAR(80) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    congestion_level VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    speed_limit INTEGER NOT NULL DEFAULT 50,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_road_status CHECK (status IN ('OPEN', 'CONGESTED', 'MAINTENANCE', 'CLOSED')),
    CONSTRAINT chk_road_congestion CHECK (congestion_level IN ('LOW', 'MEDIUM', 'HIGH', 'SEVERE'))
);

CREATE INDEX idx_roads_zone ON roads(zone);
CREATE INDEX idx_roads_status ON roads(status);

COMMENT ON TABLE roads IS 'Road network health and congestion details';
COMMENT ON COLUMN roads.status IS 'Road availability status';
COMMENT ON COLUMN roads.congestion_level IS 'Current congestion intensity';

-- ============================================
-- Verification Queries
-- ============================================

-- Show the statistics view
SELECT * FROM violation_statistics;

-- Verify signals and roads tables
SELECT COUNT(*) AS total_signals FROM signals;
SELECT COUNT(*) AS total_roads FROM roads;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Database schema created successfully!' AS message;
