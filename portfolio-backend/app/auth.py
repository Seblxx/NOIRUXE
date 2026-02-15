from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import logging
import requests as http_requests
from dotenv import load_dotenv
from supabase import create_client, Client
import jwt
from jwt import PyJWKClient

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("auth")

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

if not all([SUPABASE_URL, SUPABASE_ANON_KEY]):
    raise ValueError("Missing Supabase configuration. Check .env file.")

# JWKS endpoint for verifying ES256 tokens
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
jwks_client = None
try:
    jwks_client = PyJWKClient(JWKS_URL)
    logger.info(f"JWKS client initialized for {JWKS_URL}")
except Exception as e:
    logger.warning(f"Could not initialize JWKS client: {e}")

# Create Supabase client with anon key (for authentication)
try:
    supabase: Client = create_client(
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_ANON_KEY
    )
except Exception as e:
    print(f"Warning: Could not initialize Supabase client: {e}")
    print("JWT verification will still work for authentication.")
    supabase = None
    supabase = None

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Verify Supabase JWT token and return user info"""
    token = credentials.credentials
    
    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg", "HS256")
        
        if alg == "ES256" and jwks_client:
            # New ECC key — verify using JWKS public key
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                audience="authenticated"
            )
        elif SUPABASE_JWT_SECRET:
            # Legacy HS256 — verify using shared secret
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
        else:
            raise jwt.InvalidTokenError(f"Cannot verify token with alg={alg}: no key available")
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        logger.info(f"Auth success: user={email}, alg={alg}")
        return {
            "id": user_id,
            "email": email,
            "role": payload.get("role", "user")
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )

# Alias for compatibility
get_current_active_admin = get_current_user
