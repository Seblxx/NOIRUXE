# Quick Commands

## Install Supabase Clients

```bash
# Frontend
npm install @supabase/supabase-js

# Backend (already in requirements.txt)
cd portfolio-backend
pip install supabase PyJWT
```

## Get Supabase Credentials

1. **Service Role Key**: https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv/settings/api
   - Copy the `service_role` key (secret!)

2. **JWT Secret**: https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv/settings/api
   - Scroll down to "JWT Settings"
   - Copy the secret

3. Add to `portfolio-backend/.env`:
```env
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

## Create Admin User

### Via Supabase Dashboard (Easiest)
1. Go to: https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv/auth/users
2. Click "Add user" > "Create new user"
3. Enter email and password
4. Done! Use these to login at `/admin/login`

### Via API
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"securepassword"}'
```

## Start Application

```bash
# Backend
cd portfolio-backend
uvicorn main:app --reload

# Frontend (new terminal)
npm run dev
```

## Login

1. Go to: http://localhost:5173/admin/login
2. Enter the email/password you created in Supabase
3. Access admin dashboard!

---

**That's it! No more custom JWT, no more create_admin.py - Supabase handles everything! 🎉**
