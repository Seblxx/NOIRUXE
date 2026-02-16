import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.auth import get_current_user, supabase

router = APIRouter()

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".avi"}
ALLOWED_DOC_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS | ALLOWED_DOC_EXTENSIONS

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

# Supabase Storage bucket name
STORAGE_BUCKET = "portfolio-files"


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a file to Supabase Storage (admin only). Returns the public URL."""
    
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase Storage not configured")
    
    # Validate extension
    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    # Read contents and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)} MB.",
        )

    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex[:12]}_{file.filename}"

    try:
        # Upload to Supabase Storage
        response = supabase.storage.from_(STORAGE_BUCKET).upload(
            path=unique_name,
            file=contents,
            file_options={"content-type": file.content_type or "application/octet-stream"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(STORAGE_BUCKET).get_public_url(unique_name)
        
        return {
            "url": public_url,
            "filename": unique_name,
            "original_filename": file.filename,
            "size": len(contents)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/{filename}")
async def delete_file(
    filename: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a file from Supabase Storage (admin only)."""
    
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase Storage not configured")
    
    try:
        supabase.storage.from_(STORAGE_BUCKET).remove([filename])
        return {"message": f"File {filename} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
        f.write(contents)

    # Return the URL path (frontend will prepend API host if needed)
    return {
        "url": f"/uploads/{unique_name}",
        "filename": file.filename,
        "size": len(contents),
    }
