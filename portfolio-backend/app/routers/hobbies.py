from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Hobby, Admin
from app.schemas import HobbyCreate, HobbyUpdate, HobbyResponse
from app.auth import get_current_active_admin

router = APIRouter()

@router.get("/", response_model=List[HobbyResponse])
async def get_hobbies(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all hobbies (public endpoint)"""
    query = db.query(Hobby)
    if active_only:
        query = query.filter(Hobby.is_active == True)
    hobbies = query.order_by(Hobby.display_order).offset(skip).limit(limit).all()
    return hobbies

@router.get("/{hobby_id}", response_model=HobbyResponse)
async def get_hobby(hobby_id: str, db: Session = Depends(get_db)):
    """Get a specific hobby by ID"""
    hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
    if not hobby:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hobby not found")
    return hobby

@router.post("/", response_model=HobbyResponse, status_code=status.HTTP_201_CREATED)
async def create_hobby(
    hobby: HobbyCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Create a new hobby (admin only)"""
    db_hobby = Hobby(**hobby.dict())
    db.add(db_hobby)
    db.commit()
    db.refresh(db_hobby)
    return db_hobby

@router.put("/{hobby_id}", response_model=HobbyResponse)
async def update_hobby(
    hobby_id: str,
    hobby: HobbyUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Update a hobby (admin only)"""
    db_hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
    if not db_hobby:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hobby not found")
    
    for key, value in hobby.dict(exclude_unset=True).items():
        setattr(db_hobby, key, value)
    
    db.commit()
    db.refresh(db_hobby)
    return db_hobby

@router.delete("/{hobby_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hobby(
    hobby_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Delete a hobby (admin only)"""
    db_hobby = db.query(Hobby).filter(Hobby.id == hobby_id).first()
    if not db_hobby:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hobby not found")
    
    db.delete(db_hobby)
    db.commit()
    return None
