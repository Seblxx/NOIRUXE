import os
import uuid
import logging
import httpx
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


def _get_supabase_config():
    """Get Supabase URL and key for storage operations."""
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    # Prefer service key if it's a real JWT, otherwise use anon key
    service_key = os.getenv("SUPABASE_SERVICE_KEY", "")
    anon_key = os.getenv("SUPABASE_ANON_KEY", "")
    key = service_key if service_key.startswith("eyJ") else anon_key
    if not url or not key:
        logger.error(f"Missing Supabase config: URL={'set' if url else 'MISSING'}, KEY={'set' if key else 'MISSING'}")
        return None, None
    return url, key


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a file to Supabase Storage via REST API (admin only). Returns the public URL."""

    supabase_url, supabase_key = _get_supabase_config()
    if not supabase_url or not supabase_key:
        raise HTTPException(
            status_code=503,
            detail="Supabase Storage not configured. SUPABASE_URL and SUPABASE_ANON_KEY must be set."
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

    # Generate unique filename (no spaces, safe for URLs)
    safe_filename = (file.filename or "file").replace(" ", "_")
    unique_name = f"{uuid.uuid4().hex[:12]}_{safe_filename}"
    content_type = file.content_type or "application/octet-stream"

    # Upload via Supabase Storage REST API
    upload_url = f"{supabase_url}/storage/v1/object/{STORAGE_BUCKET}/{unique_name}"
    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "apikey": supabase_key,
        "Content-Type": content_type,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(upload_url, content=contents, headers=headers)

        if resp.status_code not in (200, 201):
            detail = resp.text
            logger.error(f"Supabase upload failed ({resp.status_code}): {detail}")
            raise HTTPException(
                status_code=502,
                detail=f"Supabase Storage error ({resp.status_code}): {detail}"
            )

        # Build public URL
        public_url = f"{supabase_url}/storage/v1/object/public/{STORAGE_BUCKET}/{unique_name}"

        return {
            "url": public_url,
            "filename": unique_name,
            "original_filename": file.filename,
            "size": len(contents),
        }

    except httpx.HTTPError as e:
        logger.error(f"HTTP error uploading to Supabase: {e}")
        raise HTTPException(status_code=502, detail=f"Could not reach Supabase Storage: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/{filename}")
async def delete_file(
    filename: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a file from Supabase Storage via REST API (admin only)."""

    supabase_url, supabase_key = _get_supabase_config()
    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=503, detail="Supabase Storage not configured")

    delete_url = f"{supabase_url}/storage/v1/object/{STORAGE_BUCKET}"
    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "apikey": supabase_key,
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.request("DELETE", delete_url, json={"prefixes": [filename]}, headers=headers)

        if resp.status_code not in (200, 201, 204):
            raise HTTPException(status_code=502, detail=f"Supabase delete error: {resp.text}")

        return {"message": f"File {filename} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
