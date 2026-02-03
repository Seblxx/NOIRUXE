from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import Testimonial, Admin
from app.schemas import TestimonialCreate, TestimonialUpdate, TestimonialResponse, TestimonialPublicCreate
from app.auth import get_current_active_admin

router = APIRouter()

@router.get("/", response_model=List[TestimonialResponse])
async def get_testimonials(
    skip: int = 0,
    limit: int = 100,
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all testimonials (public endpoint - only shows approved by default)"""
    query = db.query(Testimonial)
    if approved_only:
        query = query.filter(Testimonial.status == 'approved')
    testimonials = query.order_by(Testimonial.display_order, Testimonial.created_at.desc()).offset(skip).limit(limit).all()
    return testimonials

@router.get("/admin/all", response_model=List[TestimonialResponse])
async def get_all_testimonials_admin(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Get all testimonials including pending/rejected (admin only)"""
    query = db.query(Testimonial)
    if status_filter:
        query = query.filter(Testimonial.status == status_filter)
    testimonials = query.order_by(Testimonial.created_at.desc()).offset(skip).limit(limit).all()
    return testimonials

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(testimonial_id: str, db: Session = Depends(get_db)):
    """Get a specific testimonial by ID"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    return testimonial

@router.post("/submit", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def submit_testimonial(testimonial: TestimonialPublicCreate, db: Session = Depends(get_db)):
    """Submit a new testimonial (public endpoint - will be pending approval)"""
    db_testimonial = Testimonial(
        **testimonial.dict(),
        status='pending'
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.post("/", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Create a new testimonial (admin only)"""
    db_testimonial = Testimonial(**testimonial.dict())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.put("/{testimonial_id}/approve", response_model=TestimonialResponse)
async def approve_testimonial(
    testimonial_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Approve a testimonial (admin only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    
    testimonial.status = 'approved'
    testimonial.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.put("/{testimonial_id}/reject", response_model=TestimonialResponse)
async def reject_testimonial(
    testimonial_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Reject a testimonial (admin only)"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    
    testimonial.status = 'rejected'
    testimonial.reviewed_at = datetime.utcnow()
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    testimonial: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Update a testimonial (admin only)"""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    
    for key, value in testimonial.dict(exclude_unset=True).items():
        setattr(db_testimonial, key, value)
    
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    testimonial_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Delete a testimonial (admin only)"""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    
    db.delete(db_testimonial)
    db.commit()
    return None
