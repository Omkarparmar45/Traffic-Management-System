# API Testing Guide 🧪

Complete guide for testing the Traffic Management System REST APIs.

## 🔧 Testing Tools

You can use any of these tools:
- **Browser** (for GET requests)
- **curl** (command line)
- **Postman** (recommended)
- **Thunder Client** (VS Code extension)
- **Insomnia**

---

## 📍 Base URL

```
http://localhost:8080/api/violations
```

---

## 📝 API Endpoints

### 1. Record a New Violation

**Endpoint:** `POST /api/violations`

**Request Body:**
```json
{
  "vehicleNumber": "DL-01-AB-1234",
  "vehicleType": "Motorcycle",
  "helmetViolation": true,
  "overloadingViolation": false,
  "passengerCount": 1,
  "location": "Main Street Junction",
  "violationDateTime": "2026-02-08T10:30:00",
  "remarks": "Rider not wearing helmet",
  "status": "PENDING"
}
```

**curl Command:**
```bash
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "DL-01-AB-1234",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": false,
    "passengerCount": 1,
    "location": "Main Street Junction",
    "violationDateTime": "2026-02-08T10:30:00",
    "remarks": "Rider not wearing helmet"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Violation recorded successfully",
  "data": {
    "id": 1,
    "vehicleNumber": "DL-01-AB-1234",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": false,
    "passengerCount": 1,
    "location": "Main Street Junction",
    "violationDateTime": "2026-02-08T10:30:00",
    "remarks": "Rider not wearing helmet",
    "status": "PENDING",
    "createdAt": "2026-02-08T10:30:00",
    "updatedAt": null
  }
}
```

---

### 2. Get All Violations

**Endpoint:** `GET /api/violations`

**curl Command:**
```bash
curl http://localhost:8080/api/violations
```

**Browser:**
```
http://localhost:8080/api/violations
```

**Expected Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 1,
      "vehicleNumber": "DL-01-AB-1234",
      "vehicleType": "Motorcycle",
      "helmetViolation": true,
      "overloadingViolation": false,
      "passengerCount": 1,
      "location": "Main Street Junction",
      "violationDateTime": "2026-02-08T10:30:00",
      "remarks": "Rider not wearing helmet",
      "status": "PENDING",
      "createdAt": "2026-02-08T10:30:00",
      "updatedAt": null
    }
    // ... more violations
  ]
}
```

---

### 3. Get Violation by ID

**Endpoint:** `GET /api/violations/{id}`

**curl Command:**
```bash
curl http://localhost:8080/api/violations/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vehicleNumber": "DL-01-AB-1234",
    // ... other fields
  }
}
```

---

### 4. Search by Vehicle Number

**Endpoint:** `GET /api/violations/search?vehicleNumber={query}`

**curl Command:**
```bash
curl "http://localhost:8080/api/violations/search?vehicleNumber=DL"
```

**Browser:**
```
http://localhost:8080/api/violations/search?vehicleNumber=DL
```

---

### 5. Get Violations by Status

**Endpoint:** `GET /api/violations/status/{status}`

Status values: `PENDING`, `REVIEWED`, `RESOLVED`

**curl Command:**
```bash
curl http://localhost:8080/api/violations/status/PENDING
```

**Browser:**
```
http://localhost:8080/api/violations/status/PENDING
```

---

### 6. Get Helmet Violations

**Endpoint:** `GET /api/violations/helmet`

**curl Command:**
```bash
curl http://localhost:8080/api/violations/helmet
```

---

### 7. Get Overloading Violations

**Endpoint:** `GET /api/violations/overloading`

**curl Command:**
```bash
curl http://localhost:8080/api/violations/overloading
```

---

### 8. Get Violations by Location

**Endpoint:** `GET /api/violations/location?name={location}`

**curl Command:**
```bash
curl "http://localhost:8080/api/violations/location?name=Main Street"
```

---

### 9. Update Violation Status

**Endpoint:** `PATCH /api/violations/{id}/status`

**Request Body:**
```json
{
  "status": "REVIEWED"
}
```

**curl Command:**
```bash
curl -X PATCH http://localhost:8080/api/violations/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "REVIEWED"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": 1,
    "status": "REVIEWED",
    // ... other fields
  }
}
```

---

### 10. Delete Violation

**Endpoint:** `DELETE /api/violations/{id}`

**curl Command:**
```bash
curl -X DELETE http://localhost:8080/api/violations/1
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Violation deleted successfully"
}
```

---

### 11. Get Statistics

**Endpoint:** `GET /api/violations/stats/summary`

**curl Command:**
```bash
curl http://localhost:8080/api/violations/stats/summary
```

**Browser:**
```
http://localhost:8080/api/violations/stats/summary
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalViolations": 15,
    "helmetViolations": 10,
    "overloadingViolations": 8,
    "pendingViolations": 7,
    "reviewedViolations": 5,
    "resolvedViolations": 3
  }
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Record Helmet Violation

```bash
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "TEST-001",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": false,
    "passengerCount": 1,
    "location": "Test Location",
    "violationDateTime": "2026-02-08T12:00:00",
    "remarks": "Test helmet violation"
  }'
```

### Scenario 2: Record Overloading Violation

```bash
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "TEST-002",
    "vehicleType": "Scooter",
    "helmetViolation": false,
    "overloadingViolation": true,
    "passengerCount": 3,
    "location": "Test Location",
    "violationDateTime": "2026-02-08T12:00:00",
    "remarks": "Test overloading"
  }'
```

### Scenario 3: Record Both Violations

```bash
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "TEST-003",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": true,
    "passengerCount": 3,
    "location": "Test Location",
    "violationDateTime": "2026-02-08T12:00:00",
    "remarks": "Test both violations"
  }'
```

### Scenario 4: Update Status Flow

```bash
# 1. Record violation
RESPONSE=$(curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "TEST-004",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": false,
    "passengerCount": 1,
    "location": "Test Location",
    "violationDateTime": "2026-02-08T12:00:00"
  }')

# 2. Extract ID and update status to REVIEWED
curl -X PATCH http://localhost:8080/api/violations/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "REVIEWED"}'

# 3. Update status to RESOLVED
curl -X PATCH http://localhost:8080/api/violations/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "RESOLVED"}'
```

---

## 🔍 Validation Tests

### Test 1: Invalid Vehicle Number (Empty)

```bash
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": false,
    "passengerCount": 1,
    "location": "Test",
    "violationDateTime": "2026-02-08T12:00:00"
  }'
```

**Expected:** HTTP 400 - Validation error

### Test 2: Invalid Passenger Count (Negative)

```bash
curl -X POST http://localhost:8080/api/violations \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "TEST-005",
    "vehicleType": "Motorcycle",
    "helmetViolation": true,
    "overloadingViolation": false,
    "passengerCount": -1,
    "location": "Test",
    "violationDateTime": "2026-02-08T12:00:00"
  }'
```

**Expected:** HTTP 400 - Validation error

### Test 3: Non-existent Violation ID

```bash
curl http://localhost:8080/api/violations/99999
```

**Expected:** HTTP 404 - Not found

---

## 📊 Performance Tests

### Bulk Insert Test

Create a script to insert multiple violations:

```bash
#!/bin/bash
for i in {1..100}
do
  curl -X POST http://localhost:8080/api/violations \
    -H "Content-Type: application/json" \
    -d "{
      \"vehicleNumber\": \"BULK-$i\",
      \"vehicleType\": \"Motorcycle\",
      \"helmetViolation\": true,
      \"overloadingViolation\": false,
      \"passengerCount\": 1,
      \"location\": \"Test Location\",
      \"violationDateTime\": \"2026-02-08T12:00:00\"
    }"
  echo "Created violation $i"
done
```

---

## 🐛 Error Response Examples

### 400 Bad Request
```json
{
  "success": false,
  "message": "Vehicle number is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Violation not found with ID: 999"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to record violation: Database connection error"
}
```

---

## 📦 Postman Collection

Import this into Postman:

1. Create new collection: "Traffic Management System"
2. Add requests for all endpoints above
3. Set environment variable: `baseUrl = http://localhost:8080/api/violations`
4. Use `{{baseUrl}}` in request URLs

---

## ✅ Testing Checklist

After backend deployment, verify:

- [ ] Can record new violation
- [ ] Can retrieve all violations
- [ ] Can get violation by ID
- [ ] Can search by vehicle number
- [ ] Can filter by status
- [ ] Can filter by violation type
- [ ] Can update violation status
- [ ] Can delete violation
- [ ] Statistics are accurate
- [ ] Validation works correctly
- [ ] Error handling is proper
- [ ] CORS is configured for frontend

---

## 💡 Tips

1. **Use Postman Collections**: Save time by creating request collections
2. **Environment Variables**: Use variables for base URL and test data
3. **Automated Testing**: Write scripts for regression testing
4. **Load Testing**: Use tools like JMeter or Apache Bench
5. **Monitor Logs**: Check backend console for detailed error messages

---

**Happy Testing! 🚀**
