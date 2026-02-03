# 🚀 Quick Start Guide

## Get Started in 5 Minutes

### 1. Backend Setup

```bash
cd portfolio-backend

# Create .env file
cat > .env << EOL
DATABASE_URL=postgresql://postgres.kzkgokdlghefqqhhdqlv:YOUR_DB_PASSWORD@aws-0-ca-central-1.pooler.supabase.com:6543/postgres
SECRET_KEY=$(openssl rand -hex 32)
CORS_ORIGINS=http://localhost:5173
SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co
SUPABASE_ANON_KEY=sb_publishable_KHVdBBSG3Cj-Se4m7jiMxw_tSXuWaoT
EOL

# Install dependencies
pip install -r requirements.txt

# Create admin user
python create_admin.py

# Start server
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
# In project root
cat > .env << EOL
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_KHVdBBSG3Cj-Se4m7jiMxw_tSXuWaoT
EOL

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 3. Access Your Site

- **Public Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **API Docs**: http://localhost:8000/docs

## ⚠️ Important: Replace YOUR_DB_PASSWORD

Get your database password from:
1. Go to https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv
2. Settings > Database
3. Copy or reset your password
4. Replace `YOUR_DB_PASSWORD` in the DATABASE_URL

## 📚 Full Documentation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete setup instructions and features.

## ✅ What's Included

✅ Admin authentication & dashboard  
✅ CRUD for all content (Skills, Projects, Experience, Education, Hobbies, Resumes)  
✅ Testimonials with approval system  
✅ Contact form with admin viewing  
✅ Bilingual support (EN/FR)  
✅ Responsive design  
✅ Supabase PostgreSQL database  
✅ FastAPI backend with JWT auth  
✅ React + TypeScript frontend  

## 🎯 Next Steps

1. Login to admin panel
2. Add your content (skills, projects, etc.)
3. Test the language switcher
4. Submit a test testimonial and approve it
5. Ready to deploy! 🚀
