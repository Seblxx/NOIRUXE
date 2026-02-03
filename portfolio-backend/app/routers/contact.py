from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ContactMessage, Admin
from app.schemas import ContactMessageCreate, ContactMessageResponse
from app.auth import get_current_active_admin

router = APIRouter()

@router.post("/send", status_code=201)
async def send_contact_message(message: ContactMessageCreate, db: Session = Depends(get_db)):
    """Receive a contact message from the frontend"""
    db_message = ContactMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return {
        "success": True,
        "message": "Message sent successfully",
        "data": {"id": db_message.id}
    }

@router.get("", response_model=List[ContactMessageResponse])
async def get_contact_messages(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Get all contact messages (admin only)"""
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return messages

@router.get("/{message_id}", response_model=ContactMessageResponse)
async def get_contact_message(
    message_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Get a specific contact message by ID (admin only)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.patch("/{message_id}/read")
async def mark_message_as_read(
    message_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Mark a contact message as read (admin only)"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    db.commit()
    return {"success": True, "message": "Message marked as read"}

@router.delete("/{message_id}")
async def delete_contact_message(
    message_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_active_admin)
):
    """Delete a contact message"""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    return {"success": True, "message": "Message deleted successfully"}
