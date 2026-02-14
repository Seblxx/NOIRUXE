from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Date, JSON
from sqlalchemy.sql import func
from app.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name_en = Column(String(100), nullable=False)
    name_fr = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    proficiency = Column(Integer, nullable=False)
    icon_url = Column(String(500))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title_en = Column(String(200), nullable=False)
    title_fr = Column(String(200), nullable=False)
    description_en = Column(Text, nullable=False)
    description_fr = Column(Text, nullable=False)
    short_description_en = Column(String(500))
    short_description_fr = Column(String(500))
    image_url = Column(String(500))
    video_url = Column(String(500))
    gallery_urls = Column(JSON)
    project_url = Column(String(500))
    github_url = Column(String(500))
    technologies = Column(JSON)
    category = Column(String(50))
    start_date = Column(Date)
    end_date = Column(Date)
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class WorkExperience(Base):
    __tablename__ = "work_experience"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    company_name = Column(String(200), nullable=False)
    position_en = Column(String(200), nullable=False)
    position_fr = Column(String(200), nullable=False)
    description_en = Column(Text, nullable=False)
    description_fr = Column(Text, nullable=False)
    location = Column(String(200))
    employment_type = Column(String(50))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    company_logo_url = Column(String(500))
    company_website = Column(String(500))
    achievements_en = Column(JSON)
    achievements_fr = Column(JSON)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Education(Base):
    __tablename__ = "education"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    institution_name = Column(String(200), nullable=False)
    degree_en = Column(String(200), nullable=False)
    degree_fr = Column(String(200), nullable=False)
    field_of_study_en = Column(String(200), nullable=False)
    field_of_study_fr = Column(String(200), nullable=False)
    description_en = Column(Text)
    description_fr = Column(Text)
    location = Column(String(200))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    grade = Column(String(50))
    logo_url = Column(String(500))
    achievements_en = Column(JSON)
    achievements_fr = Column(JSON)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    hashed_password = Column(String(500), nullable=False)
    full_name = Column(String(200))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))

class Hobby(Base):
    __tablename__ = "hobbies"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name_en = Column(String(200), nullable=False)
    name_fr = Column(String(200), nullable=False)
    description_en = Column(Text, nullable=False)
    description_fr = Column(Text, nullable=False)
    icon_url = Column(String(500))
    image_url = Column(String(500))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title_en = Column(String(200), nullable=False)
    title_fr = Column(String(200), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_name = Column(String(200), nullable=False)
    language = Column(String(10), nullable=False)  # 'en' or 'fr'
    file_size = Column(Integer)  # in bytes
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    author_name = Column(String(200), nullable=False)
    author_email = Column(String(200), nullable=False)
    author_position_en = Column(String(200))
    author_position_fr = Column(String(200))
    author_company = Column(String(200))
    author_image_url = Column(String(500))
    testimonial_text_en = Column(Text, nullable=False)
    testimonial_text_fr = Column(Text)
    rating = Column(Integer, default=5)  # 1-5 stars
    status = Column(String(20), default='pending')  # 'pending', 'approved', 'rejected'
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
