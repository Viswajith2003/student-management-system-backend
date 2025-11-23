# Backend Deployment Guide

## ✅ Fixed Issues

- Added MongoDB connection timeout handling
- Set server to bind to `0.0.0.0` for cloud hosting
- Added Node.js version specification
- Created deployment config files (render.yaml, vercel.json, Procfile)

## 🚀 Deployment Instructions

### Option 1: Render.com (Recommended - Already Setup)

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Fix backend hosting configuration"
   git push origin main
   ```

2. **On Render Dashboard:**

   - Go to your service: https://dashboard.render.com/
   - Click on your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - OR: It will auto-deploy if you have auto-deploy enabled

3. **Environment Variables** (Set in Render Dashboard):

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_management
   JWT_SECRET=your_secure_random_string_here
   PORT=5001
   NODE_ENV=production
   ```

4. **Verify Deployment:**
   - Visit: https://student-management-system-backend-91iw.onrender.com/
   - Should see: `{"message": "Student Management System API is running"}`

### Option 2: Railway.app (Alternative)

1. **Install Railway CLI** (optional):

   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**

   - Visit: https://railway.app/
   - Click "New Project" → "Deploy from GitHub"
   - Select your backend repository
   - Add environment variables (same as above)

3. **Get your URL:**
   - Copy the generated URL
   - Update frontend `api.js` with new URL

### Option 3: Vercel (Serverless)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   cd backend
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel dashboard

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"

**Solution:**

- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)
- Check connection string is correct
- Verify credentials are correct

### Issue 2: "Application failed to respond"

**Solution:**

- Ensure `PORT` is set correctly (Render uses dynamic PORT)
- Server must bind to `0.0.0.0` not `localhost`
- Check build logs for errors

### Issue 3: "Free tier spins down"

**Solution:**

- Use UptimeRobot to ping server every 5 minutes
- Or upgrade to paid tier ($7/month on Render)
- Frontend now has auto-wake feature

### Issue 4: "CORS errors"

**Solution:**

- Ensure `cors()` middleware is enabled
- Add specific origins if needed:
  ```javascript
  app.use(
    cors({
      origin: ["https://your-frontend.vercel.app"],
      credentials: true,
    })
  );
  ```

## 📝 Environment Variables Checklist

Make sure these are set on your hosting platform:

- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Random secure string (generate with: `openssl rand -base64 32`)
- [ ] `PORT` - Port number (usually auto-set by platform)
- [ ] `NODE_ENV` - Set to "production"

## 🧪 Testing Deployment

Test these endpoints after deployment:

1. **Health Check:**

   ```bash
   curl https://your-backend-url.com/
   ```

2. **API Routes:**
   ```bash
   curl https://your-backend-url.com/api/auth/admin-login
   ```

## 🔄 Update Frontend

After successful backend deployment, update frontend API URL:

**File:** `frontend/src/services/api.js`

```javascript
const api = axios.create({
  baseURL: "https://your-new-backend-url.com/api",
});
```

## 📊 Monitoring

- **Render Logs:** Dashboard → Your Service → Logs
- **MongoDB Metrics:** MongoDB Atlas → Metrics tab
- **Uptime Monitoring:** Use UptimeRobot (free tier available)

---

**Current Status:**

- ✅ Code fixed for hosting compatibility
- ✅ Config files created
- ⏳ Ready to deploy/redeploy
