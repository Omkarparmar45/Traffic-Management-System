# Traffic Management System - Backend

## Spring Boot REST API

This is the backend service for the Traffic Management System built with Spring Boot.

## 🏗️ Architecture

The application follows a layered architecture:

```
Controller Layer (REST API)
      ↓
Service Layer (Business Logic)
      ↓
Repository Layer (Data Access)
      ↓
Database (PostgreSQL)
```

## 📦 Dependencies

- **Spring Boot Starter Web**: REST API development
- **Spring Boot Starter Data JPA**: Database operations
- **Spring Boot Starter Validation**: Input validation
- **PostgreSQL Driver**: PostgreSQL database driver
- **Lombok**: Reduce boilerplate code

## 🔧 Configuration

### Application Properties

Key configurations in `application.properties`:

```properties
# Server Port
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/traffic_management_db
spring.datasource.username=postgres
spring.datasource.password=1234

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
```

### Database Auto-Creation

The application automatically creates/updates database tables based on entity definitions thanks to `spring.jpa.hibernate.ddl-auto=update`.

## 🚀 Running the Application

### Option 1: Using Maven

```bash
mvn spring-boot:run
```

### Option 2: Using JAR

```bash
mvn clean package
java -jar target/traffic-management-system-1.0.0.jar
```

### Option 3: Using IDE

Run the `TrafficManagementApplication` class

## 📊 Database Schema

### Violations Table

| Column                | Type         | Description                  |
| --------------------- | ------------ | ---------------------------- |
| id                    | BIGINT       | Primary Key (Auto-increment) |
| vehicle_number        | VARCHAR(20)  | Vehicle registration number  |
| vehicle_type          | VARCHAR(50)  | Type of vehicle              |
| helmet_violation      | BOOLEAN      | Helmet violation flag        |
| overloading_violation | BOOLEAN      | Overloading violation flag   |
| passenger_count       | INTEGER      | Number of passengers         |
| location              | VARCHAR(100) | Violation location           |
| violation_date_time   | DATETIME     | When violation occurred      |
| remarks               | VARCHAR(500) | Additional notes             |
| status                | VARCHAR(20)  | PENDING/REVIEWED/RESOLVED    |
| created_at            | DATETIME     | Record creation time         |
| updated_at            | DATETIME     | Last update time             |

## 🔌 API Endpoints

Base URL: `http://localhost:8080/api/violations`

### Violation Management

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | `/`            | Record new violation    |
| GET    | `/`            | Get all violations      |
| GET    | `/{id}`        | Get violation by ID     |
| PATCH  | `/{id}/status` | Update violation status |
| DELETE | `/{id}`        | Delete violation        |

### Search & Filter

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| GET    | `/search?vehicleNumber=ABC` | Search by vehicle          |
| GET    | `/status/{status}`          | Filter by status           |
| GET    | `/location?name=Downtown`   | Filter by location         |
| GET    | `/helmet`                   | Get helmet violations      |
| GET    | `/overloading`              | Get overloading violations |

### Statistics

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/stats/summary` | Get violation statistics |

## 🧩 Package Structure

```
com.traffic
├── TrafficManagementApplication.java    # Main application class
├── controller
│   └── ViolationController.java         # REST controllers
├── service
│   ├── ViolationService.java            # Service interface
│   └── ViolationServiceImpl.java        # Service implementation
├── repository
│   └── ViolationRepository.java         # JPA repository
├── model
│   └── Violation.java                   # Entity class
├── dto
│   ├── ViolationRequest.java            # Request DTO
│   └── ViolationResponse.java           # Response DTO
└── config
    └── CorsConfig.java                  # CORS configuration
```

## 🔍 Key Features

### Service Layer

- Business logic separation
- Transaction management
- Automatic overloading detection
- Data mapping between entities and DTOs

### Repository Layer

- JPA repository with custom queries
- Support for complex search operations
- Optimized database queries

### Controller Layer

- RESTful API design
- Proper HTTP status codes
- Consistent response format
- Exception handling

## 🛡️ Error Handling

All API responses follow this format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description"
}
```

## 🧪 Testing

Run tests:

```bash
mvn test
```

## 📝 Logging

The application uses SLF4J with Logback for logging:

- DEBUG level for application logs
- INFO level for Spring logs
- Logs include timestamps and formatted SQL queries

## 🔒 Security Notes

For production:

1. Add Spring Security dependency
2. Implement JWT authentication
3. Enable HTTPS
4. Use environment variables for sensitive data
5. Implement rate limiting
6. Add request validation

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 💡 Tips

- Use Postman or curl to test APIs
- Check application logs for debugging
- Use H2 database for development/testing
- Enable Spring Boot DevTools for faster development
