# 🔐 Supabase Authentication Setup Guide

Yes! Your portfolio now uses **Supabase Authentication** instead of custom JWT. This is much better because:

✅ Built-in user management  
✅ Email verification  
✅ Password reset  
✅ OAuth providers (Google, GitHub, etc.)  
✅ Row Level Security (RLS)  
✅ No need to manage JWT secrets  

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv

2. **Settings > API**
   - Copy `URL` (you already have this)
   - Copy `anon public` key (you already have this)
   - Copy `service_role` key (⚠️ Keep this secret!)

3. **Settings > API > JWT Settings**
   - Copy `JWT Secret`

### Step 2: Update Backend .env

Create/update `portfolio-backend/.env`:

```env
# Database
DATABASE_URL=postgresql://postgres.kzkgokdlghefqqhhdqlv:YOUR_DB_PASSWORD@aws-0-ca-central-1.pooler.supabase.com:6543/postgres

# Supabase Auth
SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co
SUPABASE_ANON_KEY=sb_publishable_KHVdBBSG3Cj-Se4m7jiMxw_tSXuWaoT
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
SUPABASE_JWT_SECRET=YOUR_JWT_SECRET_HERE

# CORS
CORS_ORIGINS=http://localhost:5173
```

### Step 3: Create Admin User in Supabase

**Option A: Via Supabase Dashboard (Easiest)**

1. Go to **Authentication > Users**
2. Click **Add user**
3. Choose **Create new user**
4. Enter email and password
5. ✅ Done! This is your admin account

**Option B: Via Your Frontend**

1. Start your backend and frontend
2. Go to http://localhost:5173/admin/login
3. Click "Don't have an account? Sign up" (if you add this link)
4. Or use the register endpoint directly:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your-password"}'
```

---

## 📦 Install Dependencies

### Backend

```bash
cd portfolio-backend
pip install -r requirements.txt
```

New packages installed:
- `supabase` - Supabase Python client
- `PyJWT` - JWT token verification

### Frontend

```bash
npm install @supabase/supabase-js
```

---

## 🔒 How It Works

### Authentication Flow

1. **User logs in** with email/password
2. **Supabase** validates credentials
3. **Returns** access token + refresh token
4. **Frontend** stores tokens (handled automatically)
5. **API calls** include token in Authorization header
6. **Backend** verifies token with Supabase JWT secret

### Token Handling

**Frontend (Automatic)**
```typescript
// Login
await login({ email, password });
// Token is automatically stored and used for API calls

// Logout
await logout();
// Token is automatically removed
```

**Backend (Automatic)**
```python
# Protected endpoint
@router.post("/skills")
async def create_skill(
    skill: SkillCreate,
    current_user: dict = Depends(get_current_user)  # ✅ Requires auth
):
    # current_user = { "id": "...", "email": "...", "role": "..." }
    pass
```

---

## 🎯 Usage Examples

### Frontend Login

```typescript
import { login, logout, getProfile } from './services/authService';

// Login
try {
  await login({ 
    email: 'admin@example.com', 
    password: 'password123' 
  });
  // Redirected to dashboard
} catch (error) {
  console.error(error.message);
}

// Get current user
const profile = await getProfile();
console.log(profile.email);

// Logout
await logout();
```

### Backend Protected Route

```python
from app.auth import get_current_user

@router.post("/admin-only")
async def admin_endpoint(
    current_user: dict = Depends(get_current_user)
):
    # Only accessible with valid Supabase token
    return {"message": f"Hello {current_user['email']}"}
```

---

## 🔧 Advanced Features

### Enable Email Verification

1. **Supabase Dashboard > Authentication > Settings**
2. Enable **Confirm email**
3. Users must verify email before logging in

### Enable OAuth (Google, GitHub, etc.)

1. **Supabase Dashboard > Authentication > Providers**
2. Enable desired providers
3. Configure credentials
4. Use in frontend:

```typescript
// Google sign in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

### Password Reset

```typescript
// Send reset email
await supabase.auth.resetPasswordForEmail('user@example.com', {
  redirectTo: 'http://localhost:5173/reset-password',
});

// Update password (after clicking email link)
await supabase.auth.updateUser({
  password: 'new-password'
});
```

---

## 🛡️ Security Best Practices

### ✅ Do's

- ✅ Keep `SERVICE_ROLE_KEY` secret (never expose to frontend)
- ✅ Use `ANON_KEY` in frontend
- ✅ Enable Row Level Security (RLS) in Supabase
- ✅ Verify tokens on backend for protected routes
- ✅ Use HTTPS in production

### ❌ Don'ts

- ❌ Never commit `.env` files
- ❌ Never expose service role key to frontend
- ❌ Don't disable email verification in production
- ❌ Don't skip token verification on backend

---

## 🔐 Row Level Security (Optional but Recommended)

Protect your database with RLS policies:

### Example: Only authenticated users can modify data

```sql
-- Enable RLS on skills table
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  TO public
  USING (is_active = true);

-- Only authenticated can insert/update/delete
CREATE POLICY "Authenticated can modify skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

Apply similar policies to all tables for maximum security!

---

## 🧪 Testing

### Test Login

```bash
# Register new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Response:
# {
#   "access_token": "eyJ...",
#   "refresh_token": "...",
#   "user": { "id": "...", "email": "..." }
# }
```

### Test Protected Endpoint

```bash
# Get token from login response
TOKEN="your-access-token-here"

# Call protected endpoint
curl http://localhost:8000/api/skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name_en":"Python","name_fr":"Python","category":"Backend","proficiency":90}'
```

---

## 🐛 Troubleshooting

### Error: "Missing Supabase configuration"

**Solution**: Check your `.env` file has all required variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_JWT_SECRET`

### Error: "Invalid token"

**Solution**: 
1. Verify `SUPABASE_JWT_SECRET` matches your Supabase project
2. Ensure token is passed in header: `Authorization: Bearer <token>`
3. Check token hasn't expired (tokens expire after 1 hour by default)

### Error: "Token has expired"

**Solution**: Use refresh token to get new access token:

```typescript
const { data, error } = await supabase.auth.refreshSession();
// New access token in data.session.access_token
```

### Can't login in frontend

**Solution**:
1. Check browser console for errors
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in frontend `.env`
3. Check Network tab to see API response
4. Ensure user exists in Supabase Dashboard > Authentication > Users

---

## 📝 Migration from Custom JWT

If you had custom JWT authentication before:

1. ✅ Remove `create_admin.py` (no longer needed)
2. ✅ Remove `Admin` model from database (optional)
3. ✅ Create admin users in Supabase Dashboard
4. ✅ Update all router dependencies from `get_current_active_admin` to `get_current_user`
5. ✅ Remove `passlib` and `python-jose` from requirements.txt (already done)

---

## 🎉 Benefits of Supabase Auth

✅ **No user table management** - Supabase handles it  
✅ **Email verification** - Built-in  
✅ **Password reset** - Built-in  
✅ **OAuth providers** - Easy to add  
✅ **Session management** - Automatic  
✅ **Token refresh** - Automatic  
✅ **Rate limiting** - Built-in  
✅ **Security** - Industry standard  

---

## 📚 More Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Python Client](https://supabase.com/docs/reference/python/introduction)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your authentication is now powered by Supabase! 🚀**
