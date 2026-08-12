# 🚀 Running the Traffic Management System

## Current Status

✅ **Java 25** - Installed  
✅ **Node.js v25.6.0** - Installed  
✅ **npm 11.9.0** - Installed  
❌ **Maven** - Not installed  
✅ **PostgreSQL** - Installed (Password: 1234)

---

## Quick Start Options

### Option 1: Run Frontend Only (Quickest) ⚡

You can run the frontend first to see the UI, then set up backend later.

```powershell
# Navigate to frontend
cd d:\traffic-project\frontend

# Install dependencies (first time only)
npm install

# Start the app
npm run dev
```

**Note**: Without backend, you'll see "Failed to connect" errors, but you can see the UI design.

---

### Option 2: Full Setup (Recommended) 🎯

#### Step 1: Install Maven

**Download & Install:**

1. Go to: https://maven.apache.org/download.cgi
2. Download `apache-maven-3.9.6-bin.zip`
3. Extract to `C:\Program Files\Apache\maven`
4. Add to PATH:
   - Search "Environment Variables" in Windows
   - Edit `Path` variable
   - Add: `C:\Program Files\Apache\maven\bin`
5. Restart terminal and verify: `mvn -version`

**OR use Chocolatey (if installed):**

```powershell
choco install maven
```

#### Step 2: Install PostgreSQL

**Download & Install:**

1. Go to: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 16+ installer
3. During setup:
   - Set postgres user password: **1234**
   - Port: 5432 (default)
   - Start PostgreSQL as Windows Service

**OR use Chocolatey:**

```powershell
choco install postgresql
```

#### Step 3: Setup Database

```powershell
# Login to PostgreSQL (password: 1234)
psql -U postgres

# In PostgreSQL prompt:
CREATE DATABASE traffic_management_db;
\q

# Run schema script
cd d:\traffic-project\database
psql -U postgres -d traffic_management_db -f schema.sql

# Optional: Load sample data
psql -U postgres -d traffic_management_db -f sample_data.sql
```

**Note**: Database credentials are already configured in `application.properties`:

- Username: `postgres`
- Password: `1234`
- Port: `5432`

#### Step 4: Run Backend

```powershell
cd d:\traffic-project\backend
mvn clean install
```

Backend will start at: `http://localhost:8080`

#### Step 5: Run Frontend

Open **NEW terminal**:

```powershell
cd d:\traffic-project\frontend
npm install
npm run dev
```

Frontend will open at: `http://localhost:3000`

---

## Option 3: Quick Test Mode 💡

You already have PostgreSQL configured in the project! The database connection is set up with:

- **Username**: `postgres`
- **Password**: `1234`
- **Port**: `5432`
- **Database**: `traffic_management_db`

Just install Maven and PostgreSQL to get started!

---

## Troubleshooting

### Maven Command Not Found

- Ensure Maven is in PATH
- Restart terminal after installation
- Try: `mvn --version`

### PostgreSQL Connection Error

- Check PostgreSQL service is running: `net start postgresql-x64-16`
- Verify password is set to `1234`
- Test connection: `psql -U postgres`
- If password prompt appears, enter: `1234`

### Port Already in Use

- **8080 in use**: Change backend port in `application.properties`
- **3000 in use**: Close other apps or run: `PORT=3001 npm run dev`

### Frontend Shows API Errors

- Ensure backend is running first
- Check console at `http://localhost:8080/api/violations`
- Verify proxy in `vite.config.js`

---

## Quick Commands Reference

### Frontend

```powershell
cd d:\traffic-project\frontend
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

### Backend (after Maven & PostgreSQL setup)

```powershell
cd d:\traffic-project\backend
mvn clean install       # Build project
mvn spring-boot:run     # Run application
mvn test               # Run tests
```

### Database

```powershell
psql -U postgres        # Login to PostgreSQL (password: 1234)
```

---

## What Works Right Now?

Since you have Java and Node.js, we can:

1. ✅ **Run Frontend** - See the UI (without data)
2. ❌ **Run Backend** - Need Maven
3. ❌ **Use Database** - Need PostgreSQL

**Recommendation**: Start with frontend to see the app, then install Maven and PostgreSQL to get full functionality.

---

## Next Steps

1. **Quick Preview**: Run frontend now with `npm run dev`
2. **Full Setup**: Install Maven → Install PostgreSQL → Run full stack
3. **Database**: PostgreSQL is configured with password `1234`

Let me know which option you'd like to proceed with! 🚀
