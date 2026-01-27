# 🚀 Spring Boot Portfolio Backend - Setup Guide

Complete step-by-step guide to set up the Spring Boot backend for your portfolio website.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Java 17+** installed ([Download](https://adoptium.net/))
- ✅ **Maven 3.8+** installed ([Download](https://maven.apache.org/download.cgi))
- ✅ **PostgreSQL 15+** installed ([Download](https://www.postgresql.org/download/))
- ✅ **IDE** (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

### Verify Installation

```bash
# Check Java version
java -version
# Should show: openjdk version "17" or higher

# Check Maven version
mvn -version
# Should show: Apache Maven 3.8.x or higher

# Check PostgreSQL
psql --version
# Should show: psql (PostgreSQL) 15.x or higher
```

---

## 🗄️ Step 1: Database Setup

### 1.1 Create PostgreSQL Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
-- Create database
CREATE DATABASE portfolio_db;

-- Create user
CREATE USER portfolio_user WITH PASSWORD 'YourStrongPassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;

-- Connect to the database
\c portfolio_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO portfolio_user;
```

### 1.2 Run Database Schema

Navigate to the project directory and run the schema:

```bash
cd C:\Users\seblxx\Documents\GitHub\NOIRUXE\portfolio-backend

# Run the schema file
psql -U portfolio_user -d portfolio_db -f database/schema.sql
```

Or copy the contents of `database/schema.sql` and run it in pgAdmin.

### 1.3 Verify Database Setup

```sql
-- Connect to database
\c portfolio_db

-- List all tables
\dt

-- Should show:
-- users, skills, projects, work_experience, education, 
-- hobbies, resume_files, contact_info, contact_messages, testimonials
```

---

## ⚙️ Step 2: Configure Application

### 2.1 Update application.properties

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio_db
spring.datasource.username=portfolio_user
spring.datasource.password=YourStrongPassword123!

# JWT Secret (CHANGE THIS!)
jwt.secret=your-super-secret-key-at-least-256-bits-long-change-in-production

# CORS (add your frontend URL)
cors.allowed.origins=http://localhost:5173,http://localhost:3000
```

### 2.2 Create upload directories

```bash
cd C:\Users\seblxx\Documents\GitHub\NOIRUXE\portfolio-backend

# Create upload directories
mkdir uploads
mkdir uploads\resumes
mkdir uploads\projects
mkdir uploads\avatars
mkdir uploads\general
```

---

## 🔨 Step 3: Build the Project

### 3.1 Clean and Install Dependencies

```bash
cd C:\Users\seblxx\Documents\GitHub\NOIRUXE\portfolio-backend

# Clean and install
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests (if any)
- Create a JAR file in `target/` directory

### 3.2 Verify Build

You should see:

```
[INFO] BUILD SUCCESS
[INFO] Total time:  XX s
[INFO] Finished at: YYYY-MM-DD...
```

---

## 🚀 Step 4: Run the Application

### Option 1: Using Maven (Development)

```bash
mvn spring-boot:run
```

### Option 2: Using JAR file

```bash
java -jar target/portfolio-backend-1.0.0.jar
```

### Option 3: Using IDE

- **IntelliJ IDEA**: Right-click `PortfolioApplication.java` → Run
- **Eclipse**: Right-click project → Run As → Spring Boot App
- **VS Code**: Press F5 or use Spring Boot Dashboard

---

## ✅ Step 5: Verify Installation

### 5.1 Check Server is Running

You should see in console:

```
Portfolio Backend API is running!
Swagger UI: http://localhost:8080/api/swagger-ui.html
```

### 5.2 Test API Endpoints

Open your browser and visit:

1. **Swagger UI**: http://localhost:8080/api/swagger-ui.html
   - Should show all API endpoints with documentation

2. **Health Check**: http://localhost:8080/api/actuator/health
   - Should return: `{"status":"UP"}`

3. **Get Skills** (Public): http://localhost:8080/api/skills
   - Should return: `[]` (empty array initially)

---

## 🔐 Step 6: Test Authentication

### 6.1 Login as Admin

Use Postman, curl, or Swagger UI to login:

**Default Admin Credentials:**
- Email: `admin@portfolio.com`
- Password: `admin123`

**Using curl:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@portfolio.com\",\"password\":\"admin123\"}"
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "admin@portfolio.com",
    "role": "ADMIN"
  }
}
```

### 6.2 Use Token for Authenticated Requests

Copy the token and use it in Authorization header:

```bash
curl -X GET http://localhost:8080/api/skills/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Step 7: Test CRUD Operations

### Create a Skill

```bash
curl -X POST http://localhost:8080/api/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nameEn": "React",
    "nameFr": "React",
    "category": "frontend",
    "proficiency": 90,
    "displayOrder": 1,
    "isActive": true
  }'
```

### Get All Skills (Public)

```bash
curl http://localhost:8080/api/skills
```

### Update a Skill

```bash
curl -X PUT http://localhost:8080/api/skills/SKILL_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "proficiency": 95
  }'
```

### Delete a Skill

```bash
curl -X DELETE http://localhost:8080/api/skills/SKILL_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 Project Structure Overview

```
portfolio-backend/
├── src/main/java/com/portfolio/
│   ├── PortfolioApplication.java      # Main application class
│   ├── config/                         # Security, CORS, JWT configs
│   ├── controller/                     # REST API endpoints
│   ├── dto/                            # Request/Response objects
│   ├── entity/                         # Database entities (JPA)
│   ├── repository/                     # Data access layer (JPA)
│   ├── service/                        # Business logic
│   ├── security/                       # JWT & authentication
│   ├── exception/                      # Error handling
│   └── util/                           # Helper classes
├── src/main/resources/
│   ├── application.properties          # Main configuration
│   ├── application-dev.properties      # Dev environment
│   └── application-prod.properties     # Production environment
├── database/
│   └── schema.sql                      # Database schema
├── uploads/                            # File storage
├── pom.xml                            # Maven dependencies
└── README.md
```

---

## 🌐 API Endpoints Summary

### Public Endpoints (No Authentication)

```
GET    /api/skills                 # Get all active skills
GET    /api/projects               # Get all active projects
GET    /api/projects/featured      # Get featured projects
GET    /api/work-experience        # Get all work experience
GET    /api/education              # Get all education
GET    /api/hobbies                # Get all hobbies
GET    /api/resume                 # Get active resume by language
GET    /api/contact-info           # Get all contact information
GET    /api/testimonials           # Get approved testimonials
POST   /api/contact/send           # Send contact message
POST   /api/testimonials           # Submit testimonial
POST   /api/auth/login             # Login
```

### Admin Endpoints (Requires Authentication)

```
POST   /api/skills                 # Create skill
PUT    /api/skills/{id}            # Update skill
DELETE /api/skills/{id}            # Delete skill

POST   /api/projects               # Create project
PUT    /api/projects/{id}          # Update project
DELETE /api/projects/{id}          # Delete project

GET    /api/contact/messages       # Get all messages
PATCH  /api/contact/messages/{id}  # Update message status

GET    /api/testimonials/all       # Get all testimonials
PATCH  /api/testimonials/{id}/approve  # Approve testimonial
PATCH  /api/testimonials/{id}/reject   # Reject testimonial

# ... similar for other entities
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to database"

**Solution:**
- Verify PostgreSQL is running: `pg_ctl status`
- Check database exists: `psql -l`
- Verify credentials in `application.properties`

### Issue: "Port 8080 already in use"

**Solution:**
Change port in `application.properties`:
```properties
server.port=8081
```

### Issue: "JWT token invalid"

**Solution:**
- Token may be expired (24 hours default)
- Login again to get a new token
- Check JWT secret is set correctly

### Issue: "File upload fails"

**Solution:**
- Verify `uploads/` directory exists
- Check file size is under 10MB
- Verify file permissions

---

## 📦 Deployment

### Build for Production

```bash
# Build JAR file
mvn clean package -DskipTests

# JAR will be created at:
# target/portfolio-backend-1.0.0.jar
```

### Run in Production

```bash
# Set production profile
java -jar -Dspring.profiles.active=prod target/portfolio-backend-1.0.0.jar
```

### Environment Variables for Production

Set these in your hosting platform:

```bash
DATABASE_URL=jdbc:postgresql://your-db-host:5432/portfolio_db
DB_USERNAME=portfolio_user
DB_PASSWORD=your_production_password
JWT_SECRET=your-super-strong-production-secret-key
CORS_ORIGINS=https://yourdomain.com
```

---

## 🎉 Next Steps

1. ✅ Backend is running
2. ✅ Database is set up
3. ✅ API is accessible
4. ✅ Authentication works

Now you can:

- 📱 **Build the frontend** using the React hooks provided
- 🧪 **Test all endpoints** using Swagger UI
- 📝 **Add content** via API calls
- 🚀 **Deploy to production**

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)

---

## 🆘 Getting Help

If you encounter issues:

1. Check console logs for error messages
2. Verify all steps were followed correctly
3. Check the API documentation at `/swagger-ui.html`
4. Review `application.properties` configuration

---

**✨ Your Spring Boot backend is ready! Start building your amazing frontend! 🚀**

