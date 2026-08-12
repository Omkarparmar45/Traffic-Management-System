-- ============================================
-- Traffic Management System - Sample Data
-- ============================================
-- Description: Inserts sample violation records for testing
-- Author: Traffic Management Team
-- Date: February 2026
-- Database: PostgreSQL
-- ============================================

-- Connect to database
-- \c traffic_management_db;

-- ============================================
-- Clear existing data (optional)
-- ============================================
-- TRUNCATE TABLE violations RESTART IDENTITY CASCADE;

-- ============================================
-- Insert Sample Violations
-- ============================================
-- created_at is explicitly provided so this script works even if
-- the table was created by Hibernate without a DEFAULT value.
INSERT INTO violations (
    vehicle_number,
    vehicle_type,
    helmet_violation,
    overloading_violation,
    passenger_count,
    location,
    violation_date_time,
    remarks,
    status,
    created_at
) VALUES
    ('DL-01-AB-1234', 'Motorcycle', TRUE,  FALSE, 1, 'Main Street Junction', '2026-02-08 09:30:00', 'Rider not wearing helmet, moving at moderate speed', 'PENDING',  CURRENT_TIMESTAMP),
    ('MH-02-CD-5678', 'Scooter',    FALSE, TRUE,  3, 'City Center Plaza',   '2026-02-08 10:15:00', 'Three persons on scooter, all wearing helmets',     'PENDING',  CURRENT_TIMESTAMP),
    ('KA-03-EF-9012', 'Motorcycle', TRUE,  TRUE,  3, 'Highway Toll Plaza',  '2026-02-08 11:00:00', 'Three persons, none wearing helmet - serious violation', 'REVIEWED', CURRENT_TIMESTAMP),
    ('TN-04-GH-3456', 'Motorcycle', TRUE,  FALSE, 2, 'Market Road',         '2026-02-07 14:30:00', 'Driver without helmet, pillion rider wearing helmet', 'REVIEWED', CURRENT_TIMESTAMP),
    ('UP-05-IJ-7890', 'Scooter',    FALSE, TRUE,  4, 'School Zone',         '2026-02-07 08:00:00', 'Four persons including children on scooter',         'RESOLVED', CURRENT_TIMESTAMP),
    ('RJ-06-KL-2345', 'Motorcycle', TRUE,  FALSE, 1, 'Railway Station Road','2026-02-08 07:45:00', 'Young rider without helmet',                           'PENDING',  CURRENT_TIMESTAMP),
    ('GJ-07-MN-6789', 'Motorcycle', TRUE,  TRUE,  3, 'Bus Stand Circle',    '2026-02-08 12:30:00', 'Triple riding without helmets - repeated offender',   'PENDING',  CURRENT_TIMESTAMP),
    ('WB-08-OP-1234', 'Scooter',    FALSE, TRUE,  3, 'College Road',        '2026-02-07 16:00:00', 'Students triple riding with helmets',                 'REVIEWED', CURRENT_TIMESTAMP),
    ('MP-09-QR-5678', 'Motorcycle', TRUE,  FALSE, 2, 'IT Park Junction',    '2026-02-08 08:30:00', 'Office goers in hurry, pillion not wearing helmet',   'PENDING',  CURRENT_TIMESTAMP),
    ('AP-10-ST-9012', 'Motorcycle', TRUE,  TRUE,  4, 'Beach Road',          '2026-02-07 18:00:00', 'Family of four on motorcycle, no helmets - very dangerous', 'RESOLVED', CURRENT_TIMESTAMP),
    ('HR-11-UV-3456', 'Moped',      TRUE,  FALSE, 1, 'Hospital Road',       '2026-02-08 13:00:00', 'Delivery person without helmet',                      'PENDING',  CURRENT_TIMESTAMP),
    ('PB-12-WX-7890', 'Scooter',    FALSE, TRUE,  3, 'Shopping Mall',       '2026-02-08 15:30:00', 'Three friends on shopping trip, all with helmets',    'PENDING',  CURRENT_TIMESTAMP),
    ('CG-13-YZ-2345', 'Motorcycle', TRUE,  FALSE, 1, 'Temple Street',       '2026-02-07 19:30:00', 'Rider without helmet in low light conditions',        'REVIEWED', CURRENT_TIMESTAMP),
    ('JH-14-AB-6789', 'Motorcycle', TRUE,  TRUE,  3, 'National Highway',    '2026-02-06 10:00:00', 'High-speed triple riding without helmets - critical', 'RESOLVED', CURRENT_TIMESTAMP),
    ('OR-15-CD-1234', 'Scooter',    FALSE, TRUE,  3, 'Primary School Area', '2026-02-08 14:00:00', 'Parent dropping children - triple riding',            'PENDING',  CURRENT_TIMESTAMP);

-- ============================================
-- Insert Sample Signals
-- ============================================
INSERT INTO signals (
    name,
    location,
    state,
    uptime,
    updated_at
) VALUES
    ('Govardhan Chauraha', 'NH-19, Crossing Point 1', 'GREEN', 99.20, CURRENT_TIMESTAMP),
    ('Chhatikara', 'NH-19, Block A', 'RED', 98.70, CURRENT_TIMESTAMP),
    ('Highway Gate 3', 'Ring Road, Exit 3', 'YELLOW', 97.50, CURRENT_TIMESTAMP),
    ('School Zone East', 'Sector 12, Near DPS', 'GREEN', 99.80, CURRENT_TIMESTAMP),
    ('Industrial Bypass', 'Phase 2, Factory Road', 'RED', 96.40, CURRENT_TIMESTAMP),
    ('Railway Circle', 'Station Link Road', 'GREEN', 97.90, CURRENT_TIMESTAMP),
    ('Bus Stand Junction', 'Central Bus Terminal', 'GREEN', 98.30, CURRENT_TIMESTAMP),
    ('City Mall Square', 'Mall Road Crossing', 'YELLOW', 97.10, CURRENT_TIMESTAMP);

-- ============================================
-- Insert Sample Roads
-- ============================================
INSERT INTO roads (
    name,
    zone,
    status,
    congestion_level,
    speed_limit,
    updated_at
) VALUES
    ('NH-19 Main Corridor', 'North Zone', 'OPEN', 'MEDIUM', 60, CURRENT_TIMESTAMP),
    ('City Center Ring Road', 'Central Zone', 'CONGESTED', 'HIGH', 40, CURRENT_TIMESTAMP),
    ('Govardhan Link Road', 'West Zone', 'OPEN', 'LOW', 50, CURRENT_TIMESTAMP),
    ('Industrial Bypass', 'South Zone', 'MAINTENANCE', 'MEDIUM', 35, CURRENT_TIMESTAMP),
    ('School Belt Connector', 'East Zone', 'OPEN', 'HIGH', 30, CURRENT_TIMESTAMP),
    ('Bus Stand Feeder', 'Central Zone', 'CONGESTED', 'SEVERE', 25, CURRENT_TIMESTAMP);

-- ============================================
-- Verification Queries
-- ============================================

-- Count total records
SELECT COUNT(*) as total_records FROM violations;

-- Show summary by status
SELECT 
    status,
    COUNT(*) as count
FROM violations
GROUP BY status
ORDER BY status;

-- Show summary by violation type
SELECT 
    CASE 
        WHEN helmet_violation AND overloading_violation THEN 'Both'
        WHEN helmet_violation THEN 'Helmet Only'
        WHEN overloading_violation THEN 'Overloading Only'
        ELSE 'None'
    END as violation_type,
    COUNT(*) as count
FROM violations
GROUP BY violation_type
ORDER BY count DESC;

-- Show recent violations (last 5)
SELECT 
    id,
    vehicle_number,
    CASE 
        WHEN helmet_violation AND overloading_violation THEN 'Both Violations'
        WHEN helmet_violation THEN 'No Helmet'
        WHEN overloading_violation THEN 'Overloading'
    END as violation_type,
    location,
    violation_date_time,
    status
FROM violations
ORDER BY violation_date_time DESC
LIMIT 5;

-- Show statistics (portable query; does not depend on an optional view)
SELECT
    COUNT(*) AS total_violations,
    SUM(CASE WHEN helmet_violation = TRUE THEN 1 ELSE 0 END) AS helmet_violations,
    SUM(CASE WHEN overloading_violation = TRUE THEN 1 ELSE 0 END) AS overloading_violations,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending_violations,
    SUM(CASE WHEN status = 'REVIEWED' THEN 1 ELSE 0 END) AS reviewed_violations,
    SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved_violations
FROM violations;

-- Show signal and road counts
SELECT COUNT(*) AS total_signals FROM signals;
SELECT COUNT(*) AS total_roads FROM roads;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Sample data inserted successfully! 15 violation records created.' AS Message;
