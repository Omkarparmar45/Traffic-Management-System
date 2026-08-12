# 🚀 Quick Start Guide - Traffic Management System

## Complete Setup Instructions

Follow these steps to get the Traffic Management System up and running on your machine.

---

## ✅ Prerequisites Checklist

Before starting, ensure you have installed:

- [ ] **Java 17** or higher - [Download](https://www.oracle.com/java/technologies/downloads/)
- [ ] **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- [ ] **PostgreSQL 16+** - [Download](https://www.postgresql.org/download/)
- [ ] **Node.js 16+** and npm - [Download](https://nodejs.org/)
- [ ] **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installations

Open terminal/command prompt and run:

```bash
java -version
mvn -version
psql --version
node -version
npm -version
```

---

## 📦 Step 1: Database Setup (5 minutes)

### 1.1 Start PostgreSQL Server

**Windows:**

```cmd
net start postgresql-x64-16
```

**macOS/Linux:**

```bash
sudo systemctl start postgresql
# or
brew services start postgresql
```

### 1.2 Create Database

Open PostgreSQL command line:

```bash
psql -U postgres
```

Then run:

```sql
CREATE DATABASE traffic_management_db;
\q
```

**Note**: The default password for this project is **1234**.

### 1.3 Run Database Scripts

Navigate to database folder:

```bash
cd database
```

Create schema:

```bash
psql -U postgres -d traffic_management_db -f schema.sql
```

Insert sample data (optional):

```bash
psql -U postgres -d traffic_management_db -f sample_data.sql
```

**Verification:**

```sql
psql -U postgres -d traffic_management_db
SELECT COUNT(*) FROM violations;
\q
```

---

## 🔧 Step 2: Backend Setup (5 minutes)

### 2.1 Database Configuration

Database connection is already configured in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/traffic_management_db
spring.datasource.username=postgres
spring.datasource.password=1234
```

**Note**: Password is set to **1234**. No changes needed unless you used a different password.

### 2.2 Build the Project

```bash
mvn clean install
```

This will:

- Download all dependencies
- Compile the code
- Run tests
- Package the application

### 2.3 Run the Backend

```bash
mvn spring-boot:run
```

**Success indicators:**

- You'll see: "Traffic Management System Started Successfully!"
- Server runs on: `http://localhost:8080`
- No error messages in console

**Test the API:**
Open browser and visit: `http://localhost:8080/api/violations`

---

## ⚛️ Step 3: Frontend Setup (5 minutes)

### 3.1 Install Dependencies

Open a **new terminal** window and navigate to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

This will download all React and Vite dependencies (may take 2-3 minutes).

### 3.2 Start Development Server

```bash
npm run dev
# or
npm start
```

**Success indicators:**

- Console shows: "Local: http://localhost:3000/"
- Browser automatically opens
- Application loads instantly with Vite's fast HMR
- No compilation errors

---

## 🎉 Step 4: Verify Everything Works

### 4.1 Check Dashboard

1. Dashboard should show statistics
2. If sample data was loaded, you'll see violations

### 4.2 Record a Test Violation

1. Click "Record Violation" tab
2. Fill in the form:
   - Vehicle Number: `TEST-1234`
   - Vehicle Type: `Motorcycle`
   - Number of Persons: `3`
   - Location: `Test Location`
   - Date & Time: Select current date/time
   - Check "No Helmet" and "Overloading"
3. Click "Record Violation"
4. Success message should appear

### 4.3 View Violations

1. Click "View Violations" tab
2. Your test violation should appear in the table
3. Try searching, filtering, and status updates

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error: "Could not connect to database"**

- ✅ Check PostgreSQL is running: `psql -U postgres`
- ✅ Verify database exists: `\l` in psql prompt
- ✅ Check password is set to `1234` in `application.properties`

**Error: "Port 8080 already in use"**

- ✅ Stop other applications using port 8080
- ✅ Or change port in `application.properties`: `server.port=8081`

**Error: "Maven not found"**

- ✅ Install Maven
- ✅ Add Maven to PATH

### Issue: Frontend won't start

**Error: "npm: command not found"**

- ✅ Install Node.js and npm
- ✅ Restart terminal after installation

**Error: "Port 3000 already in use"**

- ✅ Stop other apps using port 3000
- ✅ Or run: `PORT=3001 npm start`

**Error: "Failed to fetch"**

- ✅ Ensure backend is running on port 8080
- ✅ Check browser console for CORS errors
- ✅ Verify API URL in `violationService.js`

### Issue: CORS Errors

If you see CORS errors in browser console:

- ✅ Check backend `CorsConfig.java` includes `http://localhost:3000`
- ✅ Restart backend after any config changes
- ✅ Clear browser cache (Ctrl+F5)

---

## 📱 Testing the Application

### Test Scenario 1: Helmet Violation

1. Record violation with "No Helmet" checked
2. Passenger count: 1
3. Verify it appears in dashboard statistics
4. Check "Helmet Violations" count increases

### Test Scenario 2: Overloading

1. Record violation with passenger count > 2
2. System should auto-detect overloading
3. Verify in violations list

### Test Scenario 3: Both Violations

1. Record with both checkboxes
2. Passenger count: 3
3. Verify violation type shows "Both"

### Test Scenario 4: Status Management

1. View violations list
2. Change status from "PENDING" to "REVIEWED"
3. Verify status badge color changes
4. Check dashboard statistics update

### Test Scenario 5: Search & Filter

1. Record multiple violations
2. Search by vehicle number
3. Filter by status
4. Filter by violation type

---

## 🔐 Production Deployment Notes

For deploying to production:

### Backend

1. Change database to production server
2. Set `spring.profiles.active=prod`
3. Use environment variables for credentials
4. Enable HTTPS
5. Add Spring Security
6. Build WAR/JAR: `mvn clean package`
7. Deploy to Tomcat/Cloud platform

### Frontend

1. Update API URL to production backend
2. Build optimized bundle: `npm run build`
3. Deploy `build/` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Firebase Hosting
   - Nginx server

### Database

1. Secure PostgreSQL postgres password
2. Create application-specific user
3. Regular backups
4. Enable SSL connections
5. Firewall configuration

---

## 📚 Useful Commands

### Backend Commands

```bash
# Clean build
mvn clean install

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run tests only
mvn test

# Package as JAR
mvn package

# Skip tests during build
mvn clean install -DskipTests
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Database Commands

```bash
# Backup database
pg_dump -U postgres traffic_management_db > backup.sql

# Restore database
psql -U postgres -d traffic_management_db < backup.sql

# View logs (Windows)
type "C:\Program Files\PostgreSQL\16\data\log\postgresql-*.log"

# View logs (Linux)
tail -f /var/log/postgresql/postgresql-16-main.log
```

---

## 🎯 Next Steps

After successful setup:

1. **Read the Documentation**
   - Main README.md
   - backend/README.md
   - frontend/README.md

2. **Explore the Code**
   - Review component structure
   - Understand API endpoints
   - Study database schema

3. **Customize**
   - Add new violation types
   - Enhance UI design
   - Add more statistics

4. **Enhance**
   - Implement authentication
   - Add reporting features
   - Integrate with cameras (future)

---

## 💡 Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Debugging**: Use browser DevTools (F12) for frontend, IDE debugger for backend
3. **Logging**: Check console logs for both applications
4. **API Testing**: Use Postman or curl to test APIs directly
5. **Database GUI**: Use pgAdmin or DBeaver for easier database management

---

## 📞 Support

If you encounter issues:

1. Check console logs (both backend and frontend)
2. Review error messages carefully
3. Verify all prerequisites are installed
4. Check firewall/antivirus settings
5. Ensure ports 3000, 8080, 5432 are available

---

## ✅ Setup Complete!

If all steps completed successfully:

- ✅ PostgreSQL database is running
- ✅ Backend API is accessible at `http://localhost:8080`
- ✅ Frontend UI is accessible at `http://localhost:3000`
- ✅ You can record and view violations
- ✅ Statistics are displaying correctly

**Congratulations! Your Traffic Management System is ready to use! 🎉**

---

**Last Updated**: February 2026
**Version**: 1.0.0
