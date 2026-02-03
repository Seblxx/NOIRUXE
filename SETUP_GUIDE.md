# Portfolio Setup Guide

This guide will help you set up your dynamic portfolio website with admin panel, bilingual support, and all required features.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Supabase Account

## 1. Supabase Database Setup

### Step 1: Get Your Database Password

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv
2. Navigate to **Settings** > **Database**
3. Copy your database password (or reset it if you don't have it)

### Step 2: Configure Environment Variables

**Backend (.env file):**

Create `portfolio-backend/.env`:

```env
DATABASE_URL=postgresql://postgres.kzkgokdlghefqqhhdqlv:YOUR_DATABASE_PASSWORD_HERE@aws-0-ca-central-1.pooler.supabase.com:6543/postgres
SECRET_KEY=your-secret-key-change-this-use-openssl-rand-hex-32
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co
SUPABASE_ANON_KEY=sb_publishable_KHVdBBSG3Cj-Se4m7jiMxw_tSXuWaoT
```

**Frontend (.env file):**

Create `.env` in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_KHVdBBSG3Cj-Se4m7jiMxw_tSXuWaoT
```

## 2. Backend Setup

### Install Dependencies

```bash
cd portfolio-backend
pip install -r requirements.txt
```

### Initialize Database

The database tables will be created automatically when you start the backend.

### Create Admin User

Run the admin creation script:

```bash
python create_admin.py
```

Follow the prompts to create your admin account.

### Start Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

## 3. Frontend Setup

### Install Dependencies

```bash
npm install
```

### Install Additional Required Packages

```bash
npm install axios react-router-dom
```

### Start Development Server

```bash
npm run dev
```

The website will be available at: http://localhost:5173

## 4. Features Overview

### ✅ Completed Features

#### 1. **Fully Dynamic Content**
- All content retrieved from Supabase database
- No hard-coded content
- Admin panel for content management

#### 2. **Admin Authentication**
- Secure JWT-based authentication
- Protected admin routes
- Session management

#### 3. **Content Management (CRUD)**
Admin can manage:
- ✅ Skills
- ✅ Projects  
- ✅ Work Experience
- ✅ Education
- ✅ Hobbies (NEW)
- ✅ Resume/CV files (NEW)
- ✅ Contact messages
- ✅ Testimonials with approval system (NEW)

#### 4. **Bilingual Support (EN/FR)**
- Language switcher component
- All content has English and French versions
- Language preference saved in localStorage

#### 5. **Testimonials System**
- Public submission form
- Admin approval workflow (pending/approved/rejected)
- Only approved testimonials shown publicly

#### 6. **Contact Form**
- Message submission
- Messages stored in database
- Admin can view and manage messages

#### 7. **Resume/CV Management**
- Upload and manage resumes
- Separate resumes for EN and FR
- Downloadable CV feature

## 5. Using the Admin Panel

### Access Admin Panel

1. Navigate to: http://localhost:5173/admin/login
2. Login with your admin credentials
3. Access the dashboard

### Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard
- `/admin/skills` - Manage skills
- `/admin/projects` - Manage projects
- `/admin/work-experience` - Manage work experience
- `/admin/education` - Manage education
- `/admin/hobbies` - Manage hobbies
- `/admin/resumes` - Manage CV/resume files
- `/admin/testimonials` - Review and manage testimonials
- `/admin/messages` - View contact messages

### Managing Testimonials

1. Navigate to **Testimonials** in the admin panel
2. View all testimonials (pending, approved, rejected)
3. Click **Approve** to publish a testimonial
4. Click **Reject** to decline a testimonial
5. Click **Delete** to permanently remove a testimonial

## 6. API Endpoints

### Public Endpoints
- `GET /api/skills` - Get all skills
- `GET /api/projects` - Get all projects
- `GET /api/work-experience` - Get work experience
- `GET /api/education` - Get education
- `GET /api/hobbies` - Get hobbies
- `GET /api/resumes/active/{language}` - Get active resume
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials/submit` - Submit a testimonial
- `POST /api/contact/send` - Send contact message

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get admin profile
- `POST /api/skills` - Create skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill
- (Similar CRUD endpoints for all resources)
- `GET /api/contact` - Get all messages
- `PUT /api/testimonials/{id}/approve` - Approve testimonial
- `PUT /api/testimonials/{id}/reject` - Reject testimonial

## 7. Deployment

### Backend Deployment

You can deploy the FastAPI backend to:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS EC2/ECS**

Example for Railway:
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy

### Frontend Deployment

You can deploy the React frontend to:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

Example for Vercel:
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

## 8. File Upload for Images

For production, you should use Supabase Storage for image uploads:

### Setting up Supabase Storage

1. Go to Supabase Dashboard > Storage
2. Create buckets for: `skills`, `projects`, `hobbies`, `resumes`, `testimonials`
3. Set appropriate permissions (public read for images)
4. Update your code to upload files to Supabase Storage

### Example Upload Code

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const uploadFile = async (file: File, bucket: string) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
    
  return urlData.publicUrl;
};
```

## 9. Security Best Practices

1. **Change the SECRET_KEY**: Generate a secure key using `openssl rand -hex 32`
2. **Use HTTPS in production**: Enable SSL certificates
3. **Set CORS properly**: Only allow your frontend domain
4. **Validate all inputs**: Backend validation is implemented
5. **Regular backups**: Backup your Supabase database regularly
6. **Rate limiting**: Add rate limiting for API endpoints
7. **Environment variables**: Never commit .env files to git

## 10. Responsive Design

The website is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

## 11. Testing

### Test Admin Login
1. Start backend and frontend
2. Navigate to `/admin/login`
3. Enter your admin credentials
4. Verify you can access the dashboard

### Test CRUD Operations
1. Create a skill through the admin panel
2. Verify it appears on the public site
3. Update the skill
4. Verify changes are reflected
5. Delete the skill
6. Verify it's removed

### Test Testimonials
1. Submit a testimonial through the public form
2. Login to admin panel
3. Navigate to testimonials
4. Approve the testimonial
5. Verify it appears on the public site

### Test Language Switching
1. Click the language switcher
2. Verify all content changes to French
3. Switch back to English
4. Verify content returns to English

## 12. Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check your database password
- Ensure your IP is whitelisted in Supabase (or disable IP restrictions)

### CORS Errors
- Add your frontend URL to CORS_ORIGINS in backend .env
- Restart the backend server

### Authentication Issues
- Clear browser localStorage
- Check token expiration (24 hours by default)
- Verify SECRET_KEY is set

### Build Errors
- Run `npm install` again
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors

## 13. Support

For issues or questions:
1. Check the API documentation: http://localhost:8000/docs
2. Review error messages in browser console
3. Check backend logs for errors
4. Verify all environment variables are set

## Requirements Checklist

✅ Fully dynamic content (no hard-coding)  
✅ Database-driven with admin panel  
✅ Responsive design  
✅ Online hosting ready  
✅ Bilingual support (EN/FR)  
✅ Admin authentication  
✅ Admin dashboard  
✅ CRUD for Skills  
✅ CRUD for Projects  
✅ CRUD for Work Experience  
✅ CRUD for Education  
✅ CRUD for Resume/CV  
✅ CRUD for Contact info  
✅ CRUD for Hobbies  
✅ Downloadable CV  
✅ Contact form with message storage  
✅ Testimonial submission  
✅ Testimonial approval system (accept/reject/delete)  
✅ Public/admin view separation  
✅ Input validation and sanitization  
✅ Secure authentication

---

**Your portfolio is now ready for deployment! 🚀**
