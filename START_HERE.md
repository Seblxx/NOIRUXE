# 🚀 YOUR SETUP - Ready to Start!

## ✅ What's Already Done

1. ✅ `.env` files created with your Supabase credentials
2. ✅ Admin user created in Supabase:
   - **Email:** admin@admin.com
   - **Password:** admin
3. ✅ JWT Secret configured
4. ✅ Service Role Key configured

---

## 🎯 Next Steps (3 Commands)

### 1. Install Dependencies

```bash
# Backend
cd portfolio-backend
pip install -r requirements.txt

# Frontend (in new terminal, from project root)
npm install @supabase/supabase-js
```

### 2. Get Your Database Password

⚠️ **Important:** You need to add your database password to the `.env` file

1. Go to: https://supabase.com/dashboard/project/kzkgokdlghefqqhhdqlv/settings/database
2. Copy your database password (or reset it)
3. Open `portfolio-backend/.env`
4. Replace `YOUR_DATABASE_PASSWORD` with your actual password in this line:
   ```
   DATABASE_URL=postgresql://postgres.kzkgokdlghefqqhhdqlv:YOUR_PASSWORD_HERE@aws-0-ca-central-1.pooler.supabase.com:6543/postgres
   ```

### 3. Start Everything

```bash
# Terminal 1 - Backend
cd portfolio-backend
uvicorn main:app --reload

# Terminal 2 - Frontend
npm run dev
```

---

## 🔐 Login to Admin Panel

1. Go to: **http://localhost:5173/admin/login**
2. Enter:
   - **Email:** `admin@admin.com`
   - **Password:** `admin`
3. Click Login ✅

---

## 🎉 You're Ready!

- **Public Site:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login
- **API Docs:** http://localhost:8000/docs

### Admin Credentials
- Email: admin@admin.com
- Password: admin

---

## 🔧 Troubleshooting

### Backend won't start?
- Make sure you added your database password to `portfolio-backend/.env`
- Run: `pip install -r requirements.txt`

### Frontend login doesn't work?
- Check browser console for errors
- Make sure backend is running on port 8000
- Verify Supabase credentials in both `.env` files

### Can't access database?
- Go to Supabase Dashboard > Settings > Database
- Copy/reset your password
- Update it in `portfolio-backend/.env`

---

## 📝 What's Configured

✅ Supabase URL: `https://kzkgokdlghefqqhhdqlv.supabase.co`  
✅ JWT Secret: `D1BEf19C-C4FC-4226-8B3F-A2C86ECD313F`  
✅ Service Key: `sb_secret_At5dxWSBebVk2DOB805THg_72zlsE07`  
✅ Anon Key: `sb_publishable_KHVdBBSG3Cj-Se4m7jiMxw_tSXuWaoT`  
✅ Admin User: admin@admin.com  

**Just add your database password and you're ready to go! 🚀**
