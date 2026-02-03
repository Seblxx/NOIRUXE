# 📋 Installation Checklist

Follow this checklist to ensure your portfolio is set up correctly.

## Prerequisites

- [ ] Node.js v18+ installed
- [ ] Python 3.9+ installed
- [ ] Supabase account created
- [ ] Database password from Supabase dashboard

---

## Backend Setup

### 1. Install Dependencies
```bash
cd portfolio-backend
pip install -r requirements.txt
```
- [ ] All packages installed successfully
- [ ] No error messages

### 2. Configure Environment
- [ ] Created `portfolio-backend/.env` file
- [ ] Set `DATABASE_URL` with your Supabase password
- [ ] Generated `SECRET_KEY` using `openssl rand -hex 32`
- [ ] Set `CORS_ORIGINS` to match your frontend URL
- [ ] Set `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### 3. Create Admin User
```bash
python create_admin.py
```
- [ ] Admin user created successfully
- [ ] Credentials saved securely

### 4. Start Backend Server
```bash
uvicorn main:app --reload
```
- [ ] Server starts without errors
- [ ] Can access http://localhost:8000
- [ ] API docs available at http://localhost:8000/docs
- [ ] Health check passes: http://localhost:8000/api/health

---

## Frontend Setup

### 1. Install Dependencies
```bash
# In project root
npm install
```
- [ ] All packages installed successfully
- [ ] No vulnerability warnings (or acceptable ones)

### 2. Install Additional Packages
```bash
npm install react-router-dom
```
- [ ] react-router-dom installed

### 3. Configure Environment
- [ ] Created `.env` file in project root
- [ ] Set `VITE_API_URL=http://localhost:8000/api`
- [ ] Set `VITE_SUPABASE_URL`
- [ ] Set `VITE_SUPABASE_ANON_KEY`

### 4. Start Frontend Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Can access http://localhost:5173
- [ ] No console errors in browser

---

## Testing

### Basic Functionality
- [ ] Can view portfolio homepage
- [ ] Can navigate to admin login: http://localhost:5173/admin/login
- [ ] Can login with admin credentials
- [ ] Dashboard loads successfully
- [ ] Can see admin sidebar menu

### API Connection
- [ ] Skills load on homepage
- [ ] Projects load on homepage
- [ ] Work experience displays
- [ ] Education displays
- [ ] No CORS errors in console

### Admin Features
- [ ] Can access admin dashboard
- [ ] Sidebar navigation works
- [ ] Can logout successfully
- [ ] Protected routes redirect to login when not authenticated

### Language Support
- [ ] Language switcher component exists
- [ ] Can switch between EN and FR
- [ ] Language preference persists

### Contact Form
- [ ] Contact form is visible
- [ ] Can submit a test message
- [ ] Message stored in database
- [ ] Admin can view messages (when UI is built)

### Testimonials
- [ ] Can submit a public testimonial
- [ ] Testimonial stored with "pending" status
- [ ] Admin can access testimonials section (when UI is built)

---

## Common Issues & Solutions

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Ensure you're in the `portfolio-backend` directory and run `pip install -r requirements.txt`

**Issue**: Database connection error
- **Solution**: Check your `DATABASE_URL` in `.env` - ensure password is correct

**Issue**: `SECRET_KEY not found`
- **Solution**: Add `SECRET_KEY` to your `.env` file

**Issue**: CORS errors
- **Solution**: Add your frontend URL to `CORS_ORIGINS` in `.env` and restart backend

### Frontend Issues

**Issue**: `Cannot find module 'react-router-dom'`
- **Solution**: Run `npm install react-router-dom`

**Issue**: API connection errors
- **Solution**: 
  1. Verify backend is running on port 8000
  2. Check `VITE_API_URL` in `.env`
  3. Verify CORS settings in backend

**Issue**: Blank admin dashboard
- **Solution**: Check browser console for errors. Ensure JWT token is being stored.

**Issue**: Language switcher not working
- **Solution**: Ensure `LanguageProvider` wraps your app in `AppRouter.tsx`

### Database Issues

**Issue**: Tables not created
- **Solution**: Restart backend - tables are auto-created on startup

**Issue**: Can't create admin user
- **Solution**: 
  1. Verify database connection
  2. Check if admin already exists
  3. Try resetting database password in Supabase

---

## Verification Checklist

### Backend
- [ ] Backend runs on http://localhost:8000
- [ ] API docs accessible at /docs
- [ ] Health endpoint returns healthy status
- [ ] Can create admin user
- [ ] Database tables created automatically
- [ ] API endpoints respond correctly

### Frontend
- [ ] Frontend runs on http://localhost:5173
- [ ] Homepage loads without errors
- [ ] Can navigate to admin login
- [ ] Console shows no critical errors
- [ ] API requests work (check Network tab)

### Authentication
- [ ] Can login to admin panel
- [ ] Token stored in localStorage
- [ ] Protected routes work
- [ ] Can logout
- [ ] Unauthorized access redirects to login

### Database
- [ ] Supabase connection successful
- [ ] All tables created:
  - [ ] skills
  - [ ] projects
  - [ ] work_experience
  - [ ] education
  - [ ] contact_messages
  - [ ] admins
  - [ ] hobbies
  - [ ] resumes
  - [ ] testimonials

---

## Next Steps

Once everything is checked:

1. **Add Sample Data**
   - Add a few skills through admin panel
   - Add a sample project
   - Test data appears on public site

2. **Build Admin UI Components**
   - Create CRUD interfaces for each content type
   - Build testimonial approval interface
   - Build message viewer

3. **Test Thoroughly**
   - Test all CRUD operations
   - Test bilingual content
   - Test on mobile devices
   - Test testimonial workflow

4. **Prepare for Deployment**
   - Choose hosting platforms
   - Set up production environment variables
   - Configure Supabase for production
   - Set up domain and SSL

5. **Deploy**
   - Deploy backend first
   - Update frontend API URL
   - Deploy frontend
   - Test production environment

---

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review the relevant documentation file:
   - `SETUP_GUIDE.md` - Detailed setup
   - `QUICKSTART.md` - Quick start guide
   - `IMPLEMENTATION_SUMMARY.md` - What's implemented
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all environment variables are set
6. Ensure all dependencies are installed

---

## Success Indicators

Your setup is complete when:

✅ Backend API running and accessible  
✅ Frontend loading without errors  
✅ Can login to admin panel  
✅ Database connected and tables created  
✅ Admin user created and working  
✅ API endpoints responding correctly  
✅ No CORS errors  
✅ Language switching works  
✅ Ready to add content and build remaining UI  

---

**Congratulations!** If all checkboxes are checked, your portfolio is ready for development! 🎉
