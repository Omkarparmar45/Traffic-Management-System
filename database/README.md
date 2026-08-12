# Database Scripts

This folder contains SQL scripts for the Traffic Management System database.

## Files

### 1. schema.sql

Creates the database structure including:

- `traffic_management_db` database
- `violations` table with all required columns
- Indexes for optimized queries
- `violation_statistics` view for easy statistics retrieval

### 2. sample_data.sql

Inserts 15 sample violation records for testing:

- Various violation types (helmet, overloading, both)
- Different statuses (PENDING, REVIEWED, RESOLVED)
- Different locations and times
- Realistic scenarios

## Usage

### Setup Database

1. **Login to PostgreSQL:**

```bash
psql -U postgres
```

2. **Create database and schema:**

```sql
CREATE DATABASE traffic_management_db;
\c traffic_management_db
\i schema.sql
```

3. **Insert sample data (optional):**

```sql
\i sample_data.sql
\q
```

### Alternative Method

```bash
# Create database
psql -U postgres -c "CREATE DATABASE traffic_management_db;"

# Create schema
psql -U postgres -d traffic_management_db -f schema.sql

# Insert sample data
psql -U postgres -d traffic_management_db -f sample_data.sql
```

## Verification

After running the scripts, verify the setup:

```sql
\c traffic_management_db

-- Check table structure
\d violations

-- Check data
SELECT COUNT(*) FROM violations;

-- Check statistics
SELECT * FROM violation_statistics;
```

## Database Details

### Violations Table Structure

| Column                | Type         | Description                 |
| --------------------- | ------------ | --------------------------- |
| id                    | BIGINT       | Auto-increment primary key  |
| vehicle_number        | VARCHAR(20)  | Vehicle registration number |
| vehicle_type          | VARCHAR(50)  | Type of vehicle             |
| helmet_violation      | BOOLEAN      | Helmet violation flag       |
| overloading_violation | BOOLEAN      | Overloading violation flag  |
| passenger_count       | INT          | Number of passengers        |
| location              | VARCHAR(100) | Violation location          |
| violation_date_time   | DATETIME     | Violation timestamp         |
| remarks               | VARCHAR(500) | Additional notes            |
| status                | VARCHAR(20)  | PENDING/REVIEWED/RESOLVED   |
| created_at            | DATETIME     | Record creation time        |
| updated_at            | DATETIME     | Last update time            |

### Indexes

The following indexes are created for performance:

- `idx_vehicle_number` - For vehicle searches
- `idx_status` - For status filtering
- `idx_violation_date` - For date range queries
- `idx_location` - For location filtering
- `idx_helmet_violation` - For helmet violation queries
- `idx_overloading_violation` - For overloading queries

### Statistics View

The `violation_statistics` view provides:

- Total violations count
- Helmet violations count
- Overloading violations count
- Pending violations count
- Reviewed violations count
- Resolved violations count

## Sample Queries

### Get all pending violations

```sql
SELECT * FROM violations WHERE status = 'PENDING';
```

### Get helmet violations

```sql
SELECT * FROM violations WHERE helmet_violation = TRUE;
```

### Get violations by vehicle

```sql
SELECT * FROM violations WHERE vehicle_number LIKE 'DL%';
```

### Get violations in date range

```sql
SELECT * FROM violations
WHERE violation_date_time BETWEEN '2026-02-07' AND '2026-02-08';
```

### Get statistics

```sql
SELECT * FROM violation_statistics;
```

## Backup and Restore

### Backup Database

```bash
pg_dump -U postgres traffic_management_db > backup.sql
```

### Restore Database

```bash
psql -U postgres -d traffic_management_db < backup.sql
```

## Troubleshooting

### Error: Database already exists

- Drop the existing database: `DROP DATABASE traffic_management_db;`
- Then run schema.sql again

### Error: Access denied

- Check PostgreSQL username and password (default: postgres/1234)
- Ensure user has CREATE, INSERT, SELECT permissions

### Error: Table doesn't exist

- Ensure schema.sql was run successfully
- Check for any SQL errors in the script execution

## Notes

- PostgreSQL uses transaction support by default
- UTF-8 encoding is used for international character support
- Timestamps are automatically managed by PostgreSQL triggers
- The application will auto-create tables if `spring.jpa.hibernate.ddl-auto=update` is set
