# 🚀 Deploy Your Portfolio to Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com with your GitHub)
- Your code pushed to GitHub

---

## 📦 Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 🎨 Part A: Deploy Frontend

### 1. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Click **"Add New"** → **"Project"**

### 2. Import Your Repository
- Select your GitHub repository: **NOIRUXE**
- Click **"Import"**

### 3. Configure Frontend Deployment
- **Framework Preset:** Vite
- **Root Directory:** `./` (leave as root)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4. Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.vercel.app
```
(You'll update this after deploying the backend)

### 5. Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Your frontend will be live at `https://noiruxe.vercel.app` (or similar)

---

## ⚙️ Part B: Deploy Backend (Separate Project)

### 1. Create New Project for Backend
- Go back to Vercel Dashboard
- Click **"Add New"** → **"Project"**
- Select the same repository: **NOIRUXE**

### 2. Configure Backend Deployment
- **Framework Preset:** Other
- **Root Directory:** `portfolio-backend` ⚠️ (Important!)
- **Build Command:** Leave empty
- **Output Directory:** Leave empty
- **Install Command:** `pip install -r requirements.txt`

### 3. Add Environment Variables
Click **"Environment Variables"** and add ALL of these:

```
DATABASE_URL=postgresql://postgres:vaporwave16!@db.kzkgokdlghefqqhhdqlv.supabase.co:5432/postgres

SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6a2dva2RsZ2hlZnFxaGhkcWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDAzMTUsImV4cCI6MjA4NTYxNjMxNX0.2gsHg6iDti92HJWG2Dt8higOoCevjj8q4PGllsM3yLk

SUPABASE_SERVICE_KEY=sb_secret_At5dxWSBebVk2DOB805THg_72zlsE07

SUPABASE_JWT_SECRET=dxFlSeW2XpZNOG3/fOXXPsJdz8Dj5puUlFc3z9XL8LgYXLG5NL0jzgM5NdrMnpG4Zw8oz1y2RdeX1Sp4o1xC0g==

FRONTEND_URL=https://your-frontend-url.vercel.app
```

⚠️ **Important:** Replace `FRONTEND_URL` with your actual frontend URL from Part A

### 4. Deploy Backend
- Click **"Deploy"**
- Wait 2-3 minutes
- Your backend will be live at `https://portfolio-backend-xxx.vercel.app`

---

## 🔗 Part C: Connect Frontend to Backend

### 1. Update Frontend Environment Variable
- Go to your **frontend project** in Vercel
- Go to **Settings** → **Environment Variables**
- Edit `VITE_API_URL` to your backend URL:
  ```
  VITE_API_URL=https://portfolio-backend-xxx.vercel.app
  ```

### 2. Redeploy Frontend
- Go to **Deployments** tab
- Click the **three dots** on the latest deployment
- Click **"Redeploy"**

---

## 🔐 Part D: Update Backend CORS

### 1. Update FRONTEND_URL in Backend
- Go to your **backend project** in Vercel
- Go to **Settings** → **Environment Variables**
- Edit `FRONTEND_URL` with your actual frontend URL:
  ```
  FRONTEND_URL=https://noiruxe.vercel.app
  ```

### 2. Redeploy Backend
- Go to **Deployments** tab
- Click **"Redeploy"**

---

## ✅ Verification

### Test Your Deployed Website:
1. Visit your frontend URL: `https://noiruxe.vercel.app`
2. The website should load completely
3. Try logging in (if you have credentials)
4. Test the contact form
5. Check if projects load from the database

### Verify Backend:
- Visit: `https://your-backend-url.vercel.app`
- Should show: `{"message": "Portfolio Backend API is running!", "docs": "/docs"}`
- Visit: `https://your-backend-url.vercel.app/docs` for API documentation

---

## 🎯 Quick Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel (with root directory set to `portfolio-backend`)
- [ ] All environment variables added to backend
- [ ] `VITE_API_URL` updated in frontend
- [ ] `FRONTEND_URL` updated in backend
- [ ] Both projects redeployed after URL updates
- [ ] Website loads and functions correctly
- [ ] Database connected to Supabase (check PostgreSQL emoji in logs: 🐘)

---

## 🐛 Troubleshooting

### Build Fails?
- Check the build logs in Vercel
- Make sure root directory is correct for backend

### API Not Working?
- Verify CORS settings allow your frontend URL
- Check environment variables are set correctly
- Look at Function logs in Vercel dashboard

### Database Not Connected?
- Verify `DATABASE_URL` is set correctly in backend
- Check Supabase password is correct
- Look for "🐘 Using PostgreSQL database" in logs

---

## 🎉 You're Live!

Your portfolio is now hosted on:
- **Frontend:** https://noiruxe.vercel.app
- **Backend:** https://portfolio-backend-xxx.vercel.app
- **Database:** Supabase PostgreSQL ☁️

All updates you push to GitHub will automatically redeploy! 🔄
