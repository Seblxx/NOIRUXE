# 🚀 Quick Start Guide

Get your Spring Boot portfolio backend running in **10 minutes**!

---

## ⚡ Super Quick Start (Copy & Paste)

### Step 1: Install Prerequisites (if not already installed)

```bash
# Check if installed (should show versions)
java -version    # Need Java 17+
mvn -version     # Need Maven 3.8+
psql --version   # Need PostgreSQL 15+
```

If missing, install:
- **Java 17**: https://adoptium.net/
- **Maven**: https://maven.apache.org/download.cgi
- **PostgreSQL**: https://www.postgresql.org/download/

---

### Step 2: Set Up Database (2 minutes)

```bash
# Create database and user
psql -U postgres -c "CREATE DATABASE portfolio_db;"
psql -U postgres -c "CREATE USER portfolio_user WITH PASSWORD 'Portfolio123!';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"

# Run schema
cd C:\Users\seblxx\Documents\GitHub\NOIRUXE\portfolio-backend
psql -U portfolio_user -d portfolio_db -f database\schema.sql
```

---

### Step 3: Configure Application (1 minute)

Edit `src/main/resources/application.properties`:

```properties
# Change these three lines:
spring.datasource.password=Portfolio123!
jwt.secret=my-super-secret-jwt-key-for-development-change-in-production-256-bits
cors.allowed.origins=http://localhost:5173,http://localhost:3000
```

---

### Step 4: Create Upload Directories (30 seconds)

```bash
mkdir uploads
mkdir uploads\resumes
mkdir uploads\projects
mkdir uploads\avatars
mkdir uploads\general
```

---

### Step 5: Build & Run (2 minutes)

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

**That's it!** 🎉

---

## ✅ Verify It's Working

### 1. Check Console Output

You should see:
```
Portfolio Backend API is running!
Swagger UI: http://localhost:8080/api/swagger-ui.html
```

### 2. Open Swagger UI

Visit: **http://localhost:8080/api/swagger-ui.html**

You should see the API documentation.

### 3. Test Login

In Swagger UI:
1. Find `/api/auth/login` endpoint
2. Click "Try it out"
3. Use these credentials:
   ```json
   {
     "email": "admin@portfolio.com",
     "password": "admin123"
   }
   ```
4. Click "Execute"
5. You should get a JWT token!

### 4. Test Public Endpoint

Visit: **http://localhost:8080/api/skills**

Should return: `{"success":true,"data":[]}`

---

## 🎯 What's Next?

### Option 1: Add Test Data via Swagger UI

1. Login to get token
2. Copy the token
3. Click "Authorize" button in Swagger
4. Paste token as: `Bearer YOUR_TOKEN`
5. Try creating a skill, project, etc.

### Option 2: Connect Your Frontend

Follow `FRONTEND_INTEGRATION.md` to connect your React app.

### Option 3: Build the Controllers

The entities are ready! Now implement:
- Controllers
- Services  
- Repositories
- Security configuration

See `README.md` for the complete roadmap.

---

## 🆘 Quick Fixes

### Database Connection Failed?
```bash
# Make sure PostgreSQL is running
# Windows:
net start postgresql-x64-15

# Or check in Services (services.msc)
```

### Port 8080 Already in Use?
Change in `application.properties`:
```properties
server.port=8081
```

### Can't Find `mvn` Command?
Add Maven to your PATH or use the full path:
```bash
C:\apache-maven-3.9.x\bin\mvn spring-boot:run
```

---

## 📝 Commands Cheat Sheet

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Package as JAR
mvn clean package

# Run JAR
java -jar target/portfolio-backend-1.0.0.jar

# Skip tests
mvn clean install -DskipTests

# Run only tests
mvn test

# Check for updates
mvn versions:display-dependency-updates
```

---

## 🎓 Learning Path

### Beginner
1. ✅ Get backend running (you're here!)
2. Test all endpoints with Swagger
3. Understand the entity structure
4. Connect a simple frontend

### Intermediate
1. Implement controllers and services
2. Add custom endpoints
3. Implement file upload
4. Add validation rules

### Advanced
1. Add caching
2. Implement rate limiting
3. Add monitoring
4. Deploy to cloud

---

## 📚 Essential Documentation

| File | When to Read |
|------|--------------|
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `FRONTEND_INTEGRATION.md` | Connecting React frontend |
| `BACKEND_README.md` | Complete backend documentation |
| `README.md` | Project overview |

---

## 💡 Pro Tips

1. **Use Swagger UI** for testing - it's faster than Postman
2. **Check logs** if something fails - they're very detailed
3. **Hot reload** works - just save Java files while running
4. **Database changes** - Hibernate will auto-update schema
5. **Token expires** after 24 hours - just login again

---

## 🎉 Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `portfolio_db` created
- [ ] Schema loaded from `database/schema.sql`
- [ ] `application.properties` configured
- [ ] Upload directories created
- [ ] Project builds without errors (`mvn clean install`)
- [ ] Application starts (`mvn spring-boot:run`)
- [ ] Swagger UI accessible
- [ ] Can login with admin credentials
- [ ] Can see empty skills list

**All checked?** You're ready to rock! 🚀

---

## 📞 Need Help?

1. **Check the logs** - they usually tell you exactly what's wrong
2. **Read SETUP_GUIDE.md** - step-by-step instructions
3. **Test with Swagger** - easier than coding right away
4. **Google the error** - Spring Boot has great community support

---

**Happy coding! Your portfolio backend is ready to go! 💪**

