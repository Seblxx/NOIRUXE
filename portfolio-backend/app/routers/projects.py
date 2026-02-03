from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Project
from app.schemas import ProjectCreate, ProjectResponse
from app.auth import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProjectResponse])
async def get_projects(db: Session = Depends(get_db)):
    """Get all active projects ordered by display_order"""
    projects = db.query(Project).filter(Project.is_active == True).order_by(Project.display_order).all()
    return projects

@router.get("/featured", response_model=List[ProjectResponse])
async def get_featured_projects(db: Session = Depends(get_db)):
    """Get featured projects"""
    projects = db.query(Project).filter(
        Project.is_active == True,
        Project.is_featured == True
    ).order_by(Project.display_order).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get a specific project by ID"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new project (admin only)"""
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing project (admin only)"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a project (admin only)"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"success": True, "message": "Project deleted successfully"}
