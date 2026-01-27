# 🚀 Portfolio Backend - FastAPI

A modern, fast, and easy-to-use backend API for your portfolio website built with **FastAPI** and **Python**.

## ✨ Features

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - Powerful ORM for database operations
- **PostgreSQL** - Robust relational database
- **Automatic API Documentation** - Built-in Swagger UI at `/docs`
- **Pydantic** - Data validation using Python type annotations
- **CORS** - Configured for frontend integration
- **RESTful API** - Clean and intuitive endpoints

## 📋 API Endpoints

### Skills
- `GET /api/skills` - Get all active skills
- `GET /api/skills/all` - Get all skills (including inactive)
- `GET /api/skills/{id}` - Get specific skill
- `POST /api/skills` - Create new skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill

### Projects
- `GET /api/projects` - Get all active projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/{id}` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Work Experience
- `GET /api/work-experience` - Get all work experiences
- `GET /api/work-experience/{id}` - Get specific experience
- `POST /api/work-experience` - Create new experience
- `PUT /api/work-experience/{id}` - Update experience
- `DELETE /api/work-experience/{id}` - Delete experience

### Education
- `GET /api/education` - Get all education records
- `GET /api/education/{id}` - Get specific education
- `POST /api/education` - Create new education
- `PUT /api/education/{id}` - Update education
- `DELETE /api/education/{id}` - Delete education

### Contact
- `POST /api/contact/send` - Send contact message
- `GET /api/contact` - Get all messages (admin)
- `GET /api/contact/{id}` - Get specific message
- `PATCH /api/contact/{id}/read` - Mark as read
- `DELETE /api/contact/{id}` - Delete message

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.9+
- PostgreSQL

### 2. Install Dependencies

```bash
cd portfolio-backend
pip install -r requirements.txt
```

### 3. Setup Database

**Option A: Using PostgreSQL**

Create a database and user:
```sql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

**Option B: Update `.env` file**

Copy `.env.example` to `.env` and update credentials:
```bash
DATABASE_URL=postgresql://portfolio_user:your_password@localhost:5432/portfolio_db
```

### 4. Run the Application

```bash
uvicorn main:app --reload --port 8080
```

The API will be available at:
- **API**: http://localhost:8080
- **Interactive Docs**: http://localhost:8080/docs
- **Alternative Docs**: http://localhost:8080/redoc

## 📝 Database Schema

The database tables are automatically created on first run. The schema includes:
- `skills` - Technical skills with proficiency levels
- `projects` - Portfolio projects with details
- `work_experience` - Work history
- `education` - Educational background
- `contact_messages` - Messages from visitors

## 🛠️ Development

### Add Sample Data

Use the interactive API docs at `/docs` to add data through the UI, or use cURL/Postman:

```bash
# Example: Add a skill
curl -X POST "http://localhost:8080/api/skills" \
  -H "Content-Type: application/json" \
  -d '{
    "name_en": "Python",
    "name_fr": "Python",
    "category": "Programming Languages",
    "proficiency": 90
  }'
```

### Project Structure

```
portfolio-backend/
├── app/
│   ├── __init__.py
│   ├── database.py      # Database configuration
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   └── routers/         # API endpoints
│       ├── skills.py
│       ├── projects.py
│       ├── work_experience.py
│       ├── education.py
│       └── contact.py
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── README.md
```

## 🔗 Frontend Integration

The frontend is already configured to use this API. Make sure:
1. Backend is running on port 8080
2. Frontend `.env` has: `VITE_API_URL=http://localhost:8080/api`

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use for your portfolio!

