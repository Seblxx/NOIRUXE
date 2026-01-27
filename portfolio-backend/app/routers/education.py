from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Education
from app.schemas import EducationCreate, EducationResponse

router = APIRouter()

@router.get("", response_model=List[EducationResponse])
async def get_education(db: Session = Depends(get_db)):
    """Get all active education records ordered by start_date (most recent first)"""
    education = db.query(Education).filter(
        Education.is_active == True
    ).order_by(Education.start_date.desc()).all()
    return education

@router.get("/{education_id}", response_model=EducationResponse)
async def get_education_by_id(education_id: str, db: Session = Depends(get_db)):
    """Get a specific education record by ID"""
    education = db.query(Education).filter(Education.id == education_id).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education record not found")
    return education

@router.post("", response_model=EducationResponse, status_code=201)
async def create_education(education: EducationCreate, db: Session = Depends(get_db)):
    """Create a new education record"""
    db_education = Education(**education.dict())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education

@router.put("/{education_id}", response_model=EducationResponse)
async def update_education(education_id: str, education: EducationCreate, db: Session = Depends(get_db)):
    """Update an existing education record"""
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education record not found")
    
    for key, value in education.dict().items():
        setattr(db_education, key, value)
    
    db.commit()
    db.refresh(db_education)
    return db_education

@router.delete("/{education_id}")
async def delete_education(education_id: str, db: Session = Depends(get_db)):
    """Delete an education record"""
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education record not found")
    
    db.delete(db_education)
    db.commit()
    return {"success": True, "message": "Education record deleted successfully"}
