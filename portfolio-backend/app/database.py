from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to local SQLite if no DATABASE_URL is set
    print("⚠️ WARNING: No DATABASE_URL environment variable found!")
    print("⚠️ Using local SQLite database - this won't work in production!")
    DATABASE_URL = "sqlite:///./portfolio.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
elif DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    print(f"📁 Using SQLite database")
else:
    # PostgreSQL (Supabase or other)
    # For serverless: smaller pool, shorter timeout, aggressive recycling
    try:
        engine = create_engine(
            DATABASE_URL, 
            pool_pre_ping=True,
            pool_size=2,
            max_overflow=3,
            pool_recycle=300,
            pool_timeout=30
        )
        print(f"🐘 Using PostgreSQL database")
    except Exception as e:
        print(f"❌ Failed to create database engine: {e}")
        # Fallback to SQLite to prevent complete failure
        DATABASE_URL = "sqlite:///./portfolio.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        print("⚠️ Falling back to SQLite database")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
