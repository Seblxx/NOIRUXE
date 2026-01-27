from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Skill
from app.schemas import SkillCreate, SkillResponse

router = APIRouter()

@router.get("", response_model=List[SkillResponse])
async def get_skills(db: Session = Depends(get_db)):
    """Get all active skills ordered by display_order"""
    skills = db.query(Skill).filter(Skill.is_active == True).order_by(Skill.display_order).all()
    return skills

@router.get("/all", response_model=List[SkillResponse])
async def get_all_skills(db: Session = Depends(get_db)):
    """Get all skills including inactive ones"""
    skills = db.query(Skill).order_by(Skill.display_order).all()
    return skills

@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: str, db: Session = Depends(get_db)):
    """Get a specific skill by ID"""
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

@router.post("", response_model=SkillResponse, status_code=201)
async def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    """Create a new skill"""
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(skill_id: str, skill: SkillCreate, db: Session = Depends(get_db)):
    """Update an existing skill"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    for key, value in skill.dict().items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/{skill_id}")
async def delete_skill(skill_id: str, db: Session = Depends(get_db)):
    """Delete a skill"""
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(db_skill)
    db.commit()
    return {"success": True, "message": "Skill deleted successfully"}
