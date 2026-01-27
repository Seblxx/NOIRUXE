from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# Skill Schemas
class SkillBase(BaseModel):
    name_en: str
    name_fr: str
    category: str
    proficiency: int
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
