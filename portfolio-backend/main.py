from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.routers import skills, projects, work_experience, education, contact

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="Portfolio Backend API",
    description="Dynamic Portfolio Backend API with FastAPI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(work_experience.router, prefix="/api/work-experience", tags=["Work Experience"])
app.include_router(education.router, prefix="/api/education", tags=["Education"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])

@app.get("/")
async def root():
    return {"message": "Portfolio Backend API is running!", "docs": "/docs"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}
