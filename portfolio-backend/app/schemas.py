from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import date, datetime

# Skill Schemas
class SkillBase(BaseModel):
    name_en: str
    name_fr: str
    category: str
    proficiency: int = Field(ge=0, le=100, description="Proficiency level from 0 to 100")
    icon_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title_en: str
    title_fr: str
    description_en: str
    description_fr: str
    short_description_en: Optional[str] = None
    short_description_fr: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    category: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_featured: bool = False
    display_order: int = 0
    is_active: bool = True

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Work Experience Schemas
class WorkExperienceBase(BaseModel):
    company_name: str
    position_en: str
    position_fr: str
    description_en: str
    description_fr: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    company_logo_url: Optional[str] = None
    company_website: Optional[str] = None
    achievements_en: Optional[List[str]] = None
    achievements_fr: Optional[List[str]] = None
    display_order: int = 0
    is_active: bool = True

class WorkExperienceCreate(WorkExperienceBase):
    pass

class WorkExperienceResponse(WorkExperienceBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Education Schemas
class EducationBase(BaseModel):
    institution_name: str
    degree_en: str
    degree_fr: str
    field_of_study_en: str
    field_of_study_fr: str
    description_en: Optional[str] = None
    description_fr: Optional[str] = None
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    grade: Optional[str] = None
    logo_url: Optional[str] = None
    achievements_en: Optional[List[str]] = None
    achievements_fr: Optional[List[str]] = None
    display_order: int = 0
    is_active: bool = True

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Contact Schemas
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Generic Response
class GenericResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# Update Schemas (for PATCH operations)
class SkillUpdate(BaseModel):
    name_en: Optional[str] = None
    name_fr: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = Field(None, ge=0, le=100, description="Proficiency level from 0 to 100")
    icon_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class ProjectUpdate(BaseModel):
    title_en: Optional[str] = None
    title_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_fr: Optional[str] = None
    short_description_en: Optional[str] = None
    short_description_fr: Optional[str] = None
    image_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    category: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class WorkExperienceUpdate(BaseModel):
    company_name: Optional[str] = None
    position_en: Optional[str] = None
    position_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_fr: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    company_logo_url: Optional[str] = None
    company_website: Optional[str] = None
    achievements_en: Optional[List[str]] = None
    achievements_fr: Optional[List[str]] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class EducationUpdate(BaseModel):
    institution_name: Optional[str] = None
    degree_en: Optional[str] = None
    degree_fr: Optional[str] = None
    field_of_study_en: Optional[str] = None
    field_of_study_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_fr: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    grade: Optional[str] = None
    logo_url: Optional[str] = None
    achievements_en: Optional[List[str]] = None
    achievements_fr: Optional[List[str]] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

# Admin Schemas
class AdminBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class AdminCreate(AdminBase):
    password: str

class AdminResponse(AdminBase):
    id: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Hobby Schemas
class HobbyBase(BaseModel):
    name_en: str
    name_fr: str
    description_en: str
    description_fr: str
    icon_url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class HobbyCreate(HobbyBase):
    pass

class HobbyUpdate(BaseModel):
    name_en: Optional[str] = None
    name_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_fr: Optional[str] = None
    icon_url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class HobbyResponse(HobbyBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Resume Schemas
class ResumeBase(BaseModel):
    title_en: str
    title_fr: str
    file_url: str
    file_name: str
    language: str = Field(pattern="^(en|fr)$", description="Language code: 'en' or 'fr'")
    file_size: Optional[int] = Field(None, ge=0, description="File size in bytes")
    is_active: bool = True

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title_en: Optional[str] = None
    title_fr: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    language: Optional[str] = None
    file_size: Optional[int] = None
    is_active: Optional[bool] = None

class ResumeResponse(ResumeBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialBase(BaseModel):
    author_name: str
    author_email: EmailStr
    author_position_en: Optional[str] = None
    author_position_fr: Optional[str] = None
    author_company: Optional[str] = None
    author_image_url: Optional[str] = None
    testimonial_text_en: str
    testimonial_text_fr: Optional[str] = None
    rating: int = Field(ge=1, le=5, default=5, description="Rating from 1 to 5 stars")
    display_order: int = 0

class TestimonialPublicCreate(BaseModel):
    """Schema for public testimonial submission"""
    author_name: str
    author_email: EmailStr
    author_position_en: Optional[str] = None
    author_company: Optional[str] = None
    author_image_url: Optional[str] = None
    testimonial_text_en: str
    testimonial_text_fr: Optional[str] = None
    rating: int = Field(ge=1, le=5, default=5, description="Rating from 1 to 5 stars")

class TestimonialCreate(TestimonialBase):
    status: str = Field(default='pending', pattern="^(pending|approved|rejected)$", description="Status: pending, approved, or rejected")

class TestimonialUpdate(BaseModel):
    author_name: Optional[str] = None
    author_email: Optional[EmailStr] = None
    author_position_en: Optional[str] = None
    author_position_fr: Optional[str] = None
    author_company: Optional[str] = None
    author_image_url: Optional[str] = None
    testimonial_text_en: Optional[str] = None
    testimonial_text_fr: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating from 1 to 5 stars")
    status: Optional[str] = Field(None, pattern="^(pending|approved|rejected)$", description="Status: pending, approved, or rejected")
    display_order: Optional[int] = None

class TestimonialResponse(TestimonialBase):
    id: str
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
