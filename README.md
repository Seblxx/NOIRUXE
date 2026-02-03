# 🎨 Dynamic Portfolio Website with Admin Panel

Modern, fully dynamic, bilingual portfolio website with complete admin panel for content management.

---

## ✅ All Requirements Implemented

- ✅ **Fully Dynamic** - All content from database (no hard-coded content)
- ✅ **Admin Panel** - Complete CRUD for all content types
- ✅ **Bilingual** - English/French language switching
- ✅ **Responsive** - Works on mobile, tablet, and desktop
- ✅ **Testimonials** - User submissions with admin approval
- ✅ **Supabase Authentication** - Secure, built-in auth system
- ✅ **Ready to Deploy** - Production-ready configuration

---

## 🔐 Authentication

Uses **Supabase Authentication** for:
- ✅ User management via dashboard
- ✅ Secure JWT tokens
- ✅ Email verification (optional)
- ✅ Password reset (built-in)
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ No custom JWT management needed!

**See:** [SUPABASE_AUTH_GUIDE.md](SUPABASE_AUTH_GUIDE.md) for setup instructions.

---

## 🚀 Quick Start (5 Minutes)

See **[QUICKSTART.md](QUICKSTART.md)** for fast setup!

### 1. Backend Setup

```bash
cd portfolio-backend

# Create .env with your Supabase password
echo "DATABASE_URL=postgresql://postgres.kzkgokdlghefqqhhdqlv:YOUR_PASSWORD@aws-0-ca-central-1.pooler.supabase.com:6543/postgres" > .env
echo "SECRET_KEY=$(openssl rand -hex 32)" >> .env

pip install -r requirements.txt
python create_admin.py
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
# Create .env
echo "VITE_API_URL=http://localhost:8000/api" > .env

npm install
npm install react-router-dom
npm run dev
```

### 3. Access

- **Portfolio**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **API Docs**: http://localhost:8000/docs

---

## 📂 Project Structure

```
NOIRUXE/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin panel components
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── LanguageSwitcher.tsx
│   │   └── ... (other components)
│   ├── contexts/
│   │   └── LanguageContext.tsx # Bilingual support
│   ├── services/               # API services
│   │   ├── authService.ts
│   │   ├── skillsService.ts
│   │   ├── projectsService.ts
│   │   ├── hobbiesService.ts
│   │   ├── resumesService.ts
│   │   └── testimonialsService.ts
│   ├── AppRouter.tsx          # Routing configuration
│   └── App.tsx
├── portfolio-backend/         # FastAPI Backend
│   ├── app/
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── auth.py            # Authentication
│   │   ├── database.py        # Supabase connection
│   │   └── routers/           # API endpoints
│   │       ├── auth.py
│   │       ├── skills.py
│   │       ├── projects.py
│   │       ├── hobbies.py
│   │       ├── resumes.py
│   │       └── testimonials.py
│   ├── create_admin.py        # Admin creation script
│   └── main.py
├── SETUP_GUIDE.md             # Complete setup guide
├── QUICKSTART.md              # 5-minute quick start
└── IMPLEMENTATION_SUMMARY.md  # What's implemented
```

---

## ✨ Features

### 🌍 Bilingual Support (EN/FR)
- Language switcher component
- All content in English and French
- Persistent language preference

### 🔐 Admin Panel
- Secure JWT authentication
- Dashboard with statistics
- CRUD operations for:
  - Skills
  - Projects
  - Work Experience
  - Education
  - Hobbies
  - Resume/CV files
  - Contact messages
  - Testimonials

### ⭐ Testimonials System
- Public submission form
- Admin approval workflow
- Three states: Pending, Approved, Rejected
- Only approved testimonials visible publicly

### 📧 Contact System
- Contact form for visitors
- Messages stored in database
- Admin can view and manage messages

### 📄 Resume Management
- Upload CVs in English and French
- Downloadable for visitors
- Version control

### 🎨 Modern UI
- Responsive design
- Custom cursor and ASCII effects
- Smooth animations with GSAP
- shadcn/ui components

---
- TypeScript
- Vite
- TailwindCSS
- GSAP
- Motion (Framer Motion)
- Axios

**Backend:**
- Spring Boot 3
- Java 17+
- PostgreSQL
- JWT Authentication
- Maven

---

## 📝 Environment Setup

Create `.env` file in root:
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📦 Build & Deploy

### Frontend
```bash
npm run build
```
Deploy `dist/` folder to Vercel, Netlify, or any static host.

### Backend
See `portfolio-backend/SETUP_GUIDE.md` for deployment instructions.

---

## 👤 Author

Built with ❤️ using modern web technologies

---

## 📄 License

MIT License
