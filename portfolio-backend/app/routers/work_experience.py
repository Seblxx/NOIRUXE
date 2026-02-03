from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import WorkExperience
from app.schemas import WorkExperienceCreate, WorkExperienceResponse
from app.auth import get_current_user

router = APIRouter()

@router.get("", response_model=List[WorkExperienceResponse])
async def get_work_experience(db: Session = Depends(get_db)):
    """Get all active work experiences ordered by start_date (most recent first)"""
    experiences = db.query(WorkExperience).filter(
        WorkExperience.is_active == True
    ).order_by(WorkExperience.start_date.desc()).all()
    return experiences

@router.get("/{experience_id}", response_model=WorkExperienceResponse)
async def get_work_experience_by_id(experience_id: str, db: Session = Depends(get_db)):
    """Get a specific work experience by ID"""
    experience = db.query(WorkExperience).filter(WorkExperience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Work experience not found")
    return experience

@router.post("", response_model=WorkExperienceResponse, status_code=201)
async def create_work_experience(
    experience: WorkExperienceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new work experience (admin only)"""
    db_experience = WorkExperience(**experience.dict())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@router.put("/{experience_id}", response_model=WorkExperienceResponse)
async def update_work_experience(
    experience_id: str,
    experience: WorkExperienceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing work experience (admin only)"""
    db_experience = db.query(WorkExperience).filter(WorkExperience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Work experience not found")
    
    for key, value in experience.dict(exclude_unset=True).items():
        setattr(db_experience, key, value)
    
    db.commit()
    db.refresh(db_experience)
    return db_experience

@router.delete("/{experience_id}")
async def delete_work_experience(
    experience_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a work experience (admin only)"""
    db_experience = db.query(WorkExperience).filter(WorkExperience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Work experience not found")
    
    db.delete(db_experience)
    db.commit()
    return {"success": True, "message": "Work experience deleted successfully"}
