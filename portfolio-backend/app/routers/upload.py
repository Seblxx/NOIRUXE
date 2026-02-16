import os
import uuid
import logging
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.auth import get_current_user

logger = logging.getLogger("upload")

router = APIRouter()

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".avi"}
ALLOWED_DOC_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS | ALLOWED_DOC_EXTENSIONS

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

# Supabase Storage bucket name
STORAGE_BUCKET = "portfolio-files"


def _get_storage_client():
    """Create a Supabase client for storage operations.
    Prefers service-role key (bypasses RLS), falls back to anon key."""
    from supabase import create_client
    url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_KEY", "")
    anon_key = os.getenv("SUPABASE_ANON_KEY", "")
    
    # Use service key only if it looks like a real JWT, otherwise use anon key
    if service_key and service_key.startswith("eyJ"):
        key = service_key
        logger.info("Using service-role key for storage")
    elif anon_key:
        key = anon_key
        logger.info("Using anon key for storage (service key not available)")
    else:
        logger.error("No Supabase keys available for storage")
        return None
    
    if not url:
        logger.error("SUPABASE_URL not set")
        return None
    
    try:
        client = create_client(url, key)
        return client
    except Exception as e:
        logger.error(f"Failed to create Supabase storage client: {e}")
        return None


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a file to Supabase Storage (admin only). Returns the public URL."""
    
    storage_client = _get_storage_client()
    if not storage_client:
        raise HTTPException(
            status_code=503,
            detail="Supabase Storage not configured. Check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables."
        )
    
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
        response = storage_client.storage.from_(STORAGE_BUCKET).upload(
            path=unique_name,
            file=contents,
            file_options={"content-type": file.content_type or "application/octet-stream"}
        )
        
        # Get public URL
        public_url = storage_client.storage.from_(STORAGE_BUCKET).get_public_url(unique_name)
        
        return {
            "url": public_url,
            "filename": unique_name,
            "original_filename": file.filename,
            "size": len(contents)
        }
    
    except Exception as e:
        logger.error(f"Upload to Supabase failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/{filename}")
async def delete_file(
    filename: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a file from Supabase Storage (admin only)."""
    
    supabase_client = _get_storage_client()
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase Storage not configured")
    
    try:
        supabase_client.storage.from_(STORAGE_BUCKET).remove([filename])
        return {"message": f"File {filename} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
