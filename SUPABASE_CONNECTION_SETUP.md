# Supabase Database Connection Setup

## Step 1: Get Your Database Password

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **kzkgokdlghefqqhhdqlv**
3. Go to **Settings** (gear icon in sidebar)
4. Click on **Database**
5. Scroll down to **Connection string** section
6. Look for **Connection pooling** → **Transaction mode**
7. You'll see a connection string like:
   ```
   postgresql://postgres.kzkgokdlghefqqhhdqlv:[YOUR-PASSWORD]@aws-0-ca-central-1.pooler.supabase.com:6543/postgres
   ```
8. Copy the **[YOUR-PASSWORD]** part (it should be visible or you may need to reset it)

## Step 2: Update Your .env File

Open `portfolio-backend/.env` and replace the DATABASE_URL with your actual password:

```env
DATABASE_URL=postgresql://postgres.kzkgokdlghefqqhhdqlv:[YOUR-ACTUAL-PASSWORD]@aws-0-ca-central-1.pooler.supabase.com:6543/postgres
```

Replace `[YOUR-ACTUAL-PASSWORD]` with the password you copied from the dashboard.

## Step 3: Verify Other Credentials

Make sure these are correct in your `.env`:
- ✅ `SUPABASE_URL=https://kzkgokdlghefqqhhdqlv.supabase.co`
- ✅ `SUPABASE_ANON_KEY` (already set)
- ✅ `SUPABASE_SERVICE_KEY` (already set)
- ✅ `SUPABASE_JWT_SECRET` (already set)

## Step 4: Test the Connection

After updating the password, restart your backend:
```bash
cd portfolio-backend
python start_server.py
```

You should see:
```
🐘 Using PostgreSQL database
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Alternative: Reset Database Password

If you don't have the password:
1. Go to **Settings** → **Database** in Supabase
2. Click **Reset database password**
3. Copy the new password
4. Update your `.env` file with the new password

---

**Once connected, all your data will be stored in Supabase PostgreSQL, perfect for hosting!** 🚀
