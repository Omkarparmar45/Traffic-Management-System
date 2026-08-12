# Traffic Management System 🚦

A comprehensive web-based application for monitoring and managing traffic rule violations, specifically focusing on helmet violations and overloading on two-wheelers.

## 📋 Project Overview

This mini project addresses common traffic violations that are major causes of accidents:

- **Helmet Violations**: Detecting motorcycle riders not wearing helmets
- **Overloading Violations**: Identifying cases where more than 2 persons are riding on a two-wheeler

The system records all violations and provides an admin interface for monitoring and managing them.

## 🛠️ Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL Database**
- **Maven** (Build Tool)
- **Lombok** (Code Generation)

### Frontend

- **React.js 18.2.0**
- **Vite 5.0** (Build Tool)
- **Axios** (HTTP Client)
- **HTML5 & CSS3**
- **JavaScript (ES6+)**

### Database

- **PostgreSQL 16+**

## 📁 Project Structure

```
traffic-project/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/traffic/
│   │   │   │   ├── TrafficManagementApplication.java
│   │   │   │   ├── controller/         # REST Controllers
│   │   │   │   ├── service/            # Business Logic
│   │   │   │   ├── repository/         # Data Access Layer
│   │   │   │   ├── model/              # Entity Classes
│   │   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   └── config/             # Configuration Classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── services/           # API Services
│   │   ├── App.js              # Main App Component
│   │   ├── App.css             # Main Styles
│   │   └── index.js            # Entry Point
│   ├── public/
│   ├── package.json
│   └── README.md
├── database/                   # Database Scripts
│   ├── schema.sql
│   └── sample_data.sql
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 16+ and npm
- PostgreSQL 16+
- Maven 3.6+

### Database Setup

1. **Create PostgreSQL Database:**

```sql
CREATE DATABASE traffic_management_db;
```

2. **Run the schema script:**

```bash
cd database
psql -U postgres -d traffic_management_db -f schema.sql
```

3. **(Optional) Load sample data:**

```bash
psql -U postgres -d traffic_management_db -f sample_data.sql
```

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Database configuration:**
   Already configured in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/traffic_management_db
spring.datasource.username=postgres
spring.datasource.password=1234
```

3. **Build the project:**

```bash
mvn clean install
```

4. **Run the application:**

```bash
mvn spring-boot:run
```

The backend server will start at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
# or
npm start
```

The frontend will open automatically at `http://localhost:3000` with Vite's blazing fast HMR

## 📖 API Documentation

### Base URL

```
http://localhost:8080/api/violations
```

### Endpoints

#### 1. Record Violation

- **POST** `/api/violations`
- **Body:**

```json
{
  "vehicleNumber": "ABC-1234",
  "vehicleType": "Motorcycle",
  "helmetViolation": true,
  "overloadingViolation": false,
  "passengerCount": 1,
  "location": "Main Street Junction",
  "violationDateTime": "2026-02-08T10:30:00",
  "remarks": "Rider without helmet"
}
```

#### 2. Get All Violations

- **GET** `/api/violations`

#### 3. Get Violation by ID

- **GET** `/api/violations/{id}`

#### 4. Search by Vehicle Number

- **GET** `/api/violations/search?vehicleNumber=ABC`

#### 5. Get by Status

- **GET** `/api/violations/status/{status}`
- Status values: `PENDING`, `REVIEWED`, `RESOLVED`

#### 6. Get Helmet Violations

- **GET** `/api/violations/helmet`

#### 7. Get Overloading Violations

- **GET** `/api/violations/overloading`

#### 8. Update Status

- **PATCH** `/api/violations/{id}/status`
- **Body:**

```json
{
  "status": "REVIEWED"
}
```

#### 9. Delete Violation

- **DELETE** `/api/violations/{id}`

#### 10. Get Statistics

- **GET** `/api/violations/stats/summary`

## 🎯 Features

### Current Features

- ✅ Record traffic violations (helmet and overloading)
- ✅ View all violations in a table
- ✅ Filter violations by status and type
- ✅ Search violations by vehicle number
- ✅ Update violation status (Pending/Reviewed/Resolved)
- ✅ Delete violations
- ✅ Admin dashboard with statistics
- ✅ Recent violations display
- ✅ Responsive design for mobile devices
- ✅ Beautiful gradient UI with modern design

### Future Enhancements

- 🔄 Camera-based automatic detection using AI/ML
- 🔄 Number plate recognition (OCR)
- 🔄 Automated fine generation and notification
- 🔄 SMS/Email alerts to vehicle owners
- 🔄 Integration with RTO database
- 🔄 Report generation (PDF/Excel)
- 🔄 User authentication and role-based access
- 🔄 Real-time monitoring dashboard
- 🔄 Mobile application

## 🎨 Application Screenshots

### Dashboard

- View overall statistics
- Recent violations overview
- Safety tips and reminders

### Record Violation

- User-friendly form
- Automatic overloading detection
- Real-time validation

### View Violations

- Searchable table
- Filterable by status and type
- Inline status updates
- Delete functionality

## 🔐 Security Considerations

For production deployment:

- Implement Spring Security for authentication
- Add JWT-based authorization
- Enable HTTPS
- Implement rate limiting
- Add input validation and sanitization
- Secure database credentials using environment variables

## 🧪 Testing

### Backend Testing

```bash
cd backend
mvn test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📝 License

This is an educational mini project created for academic purposes.

## 👥 Contributors

- Traffic Management System Team

## 📞 Support

For issues or questions, please contact the development team.

## 🙏 Acknowledgments

- Spring Boot community
- React.js community
- All contributors to open-source libraries used in this project

---

**Note**: This is a mini project for educational purposes. For real-world deployment, additional features like proper authentication, authorization, and security measures should be implemented.
