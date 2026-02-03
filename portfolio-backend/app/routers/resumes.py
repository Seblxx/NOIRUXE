from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Resume, Admin
from app.schemas import ResumeCreate, ResumeUpdate, ResumeResponse
from app.auth import get_current_active_admin

router = APIRouter()

@router.get("/", response_model=List[ResumeResponse])
async def get_resumes(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    language: str = None,
    db: Session = Depends(get_db)
):
    """Get all resumes (public endpoint)"""
    query = db.query(Resume)
    if active_only:
        query = query.filter(Resume.is_active == True)
    if language:
        query = query.filter(Resume.language == language)
    resumes = query.offset(skip).limit(limit).all()
    return resumes

@router.get("/active/{language}", response_model=ResumeResponse)
async def get_active_resume(language: str, db: Session = Depends(get_db)):
    """Get the active resume for a specific language"""
    resume = db.query(Resume).filter(
        Resume.language == language,
        Resume.is_active == True
    ).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No active resume found for language: {language}"
        )
    return resume

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str, db: Session = Depends(get_db)):
    """Get a specific resume by ID"""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    resume: ResumeCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Create a new resume (admin only)"""
    db_resume = Resume(**resume.dict())
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    resume: ResumeUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Update a resume (admin only)"""
    db_resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    
    for key, value in resume.dict(exclude_unset=True).items():
        setattr(db_resume, key, value)
    
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Delete a resume (admin only)"""
    db_resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    
    db.delete(db_resume)
    db.commit()
    return None
