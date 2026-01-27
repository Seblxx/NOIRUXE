# 🎨 Portfolio Website

Modern full-stack portfolio website with React/Vite frontend and Spring Boot backend.

---

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Backend
```bash
cd portfolio-backend
mvn spring-boot:run
```
Backend API runs on `http://localhost:8080`

See **[PORTFOLIO_INTEGRATION.md](PORTFOLIO_INTEGRATION.md)** for complete setup guide.

---

## 📂 Project Structure

```
NOIRUXE/
├── src/
│   ├── components/         # React components
│   │   ├── AsciiText3D.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── DownloadCVButton.tsx
│   │   ├── SimpleMenu.tsx
│   │   ├── TiltedCard.tsx
│   │   └── ui/            # Shadcn UI components
│   ├── services/          # Backend API services
│   │   ├── skillsService.ts
│   │   ├── projectsService.ts
│   │   ├── workExperienceService.ts
│   │   ├── educationService.ts
│   │   └── contactService.ts
│   ├── lib/
│   │   └── api.ts         # Axios client
│   └── App.tsx            # Main application
├── portfolio-backend/     # Spring Boot API
│   ├── src/main/java/
│   ├── database/
│   └── documentation/
└── public/Media/          # CV and assets
```

---

## ✨ Features

### Frontend
- 🎨 Modern design with custom cursor and ASCII effects
- 📱 Fully responsive
- ⚡ Smooth scroll animations with GSAP
- 🎯 TypeScript for type safety
- 🎭 Motion animations

### Backend
- 🔐 JWT Authentication
- 📊 Skills & Projects management
- 💼 Work Experience & Education
- 📝 Contact form
- 📄 CV download
- 🗄️ PostgreSQL database

---

## 📚 Documentation

- **[PORTFOLIO_INTEGRATION.md](PORTFOLIO_INTEGRATION.md)** - Complete integration guide
- **[Backend README](portfolio-backend/README.md)** - Backend API overview
- **[Backend Setup](portfolio-backend/SETUP_GUIDE.md)** - Detailed setup
- **[Frontend Integration](portfolio-backend/FRONTEND_INTEGRATION.md)** - API usage

---

## 🎯 Sections

1. **Home** - ASCII 3D hero section
2. **About** - Personal introduction
3. **Skills** - Technical skills with proficiency bars
4. **Projects** - Portfolio projects showcase
5. **Experience** - Work history with CV download
6. **Education** - Academic background
7. **Contact** - Contact form & social links

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
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
