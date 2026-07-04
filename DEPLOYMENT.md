# Render Deployment Guide for Skill2Career

## Overview
This guide will help you deploy Skill2Career to Render, a modern cloud platform. The project consists of:
- **Backend**: Express.js API (Node.js)
- **Frontend**: React with Vite (static files)
- **Database**: JSON file-based storage

## Prerequisites
- Render account (sign up at https://render.com)
- GitHub account with the repository pushed
- GitHub repository: https://github.com/PratapMeenatchisundharam/skill2career

## Deployment Steps

### Step 1: Create Backend Service on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect Repository**:
   - Select "GitHub" and authorize if needed
   - Choose `PratapMeenatchisundharam/skill2career`
4. **Configure Web Service**:
   - **Name**: `skill2career-backend`
   - **Environment**: Node
   - **Region**: Oregon (or closest to you)
   - **Branch**: master
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or Paid for production)

5. **Add Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   JWT_SECRET=generate_a_random_secret_key_here
   ```

6. **Click "Create Web Service"**
7. **Wait for deployment** (~5-10 minutes)
8. **Note your backend URL** from the Render dashboard (e.g., `https://skill2career-backend.onrender.com`)

### Step 2: Create Frontend Service on Render

1. **In Render Dashboard**, Click "New +" → Select **"Static Site"**
2. **Connect Repository**:
   - Select "GitHub" and choose `PratapMeenatchisundharam/skill2career`
3. **Configure Static Site**:
   - **Name**: `skill2career-frontend`
   - **Region**: Oregon (same as backend)
   - **Branch**: master
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

4. **Click "Create Static Site"**
5. **Wait for deployment** (~3-5 minutes)
6. **Note your frontend URL** from the Render dashboard (e.g., `https://skill2career-frontend.onrender.com`)

### Step 3: Update Backend Environment Variables

1. Go back to **Backend Service** → **Settings**
2. Update the `CORS_ORIGIN` environment variable with your actual frontend URL:
   ```
   CORS_ORIGIN=https://skill2career-frontend.onrender.com
   ```
3. **Click "Save"** and wait for redeploy

### Step 4: Update Frontend API Configuration (if needed)

If your frontend API calls don't work after deployment:

1. **Update Frontend API URL**:
   - Edit `frontend/src/api/axios.js`
   - Change baseURL if relative paths don't work:
   ```javascript
   const api = axios.create({
     baseURL: 'https://skill2career-backend.onrender.com/api'
   });
   ```

2. **Commit and push** to GitHub:
   ```bash
   git add frontend/src/api/axios.js
   git commit -m "Update API URL for production"
   git push
   ```

3. Render will **auto-redeploy** the frontend

### Step 5: Test Your Deployment

1. **Open your frontend URL**: https://skill2career-frontend.onrender.com
2. **Try registering a new account**
3. **Search for jobs**
4. **Test all major features**

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Ensure all environment variables are set
- Verify `backend/server.js` exists and is valid

### Frontend shows blank page
- Check browser console for errors (F12)
- Verify `frontend/dist` folder is being built
- Check if API calls are reaching the backend

### API calls failing
- Check CORS_ORIGIN environment variable matches frontend URL
- Verify backend service is running
- Check network tab in browser DevTools

### Database issues
- Render creates `/data` folder automatically
- JSON database files will persist on the same Render instance
- For production, consider migrating to a proper database

## Production Recommendations

### For Better Performance:
1. **Upgrade to Paid Plans** on Render for:
   - Always-on services (no spin-down)
   - Better performance and resources
   - Priority support

2. **Use a Real Database**:
   - Migrate from JSON to PostgreSQL/MongoDB
   - Update database configuration in backend

3. **Add Environment-Specific Config**:
   - Different settings for dev/prod
   - Secure sensitive credentials

4. **Enable Caching**:
   - Use CDN for static assets
   - Optimize API responses

## Deployment URLs After Setup

- **Frontend**: https://skill2career-frontend.onrender.com
- **Backend API**: https://skill2career-backend.onrender.com/api
- **Health Check**: https://skill2career-backend.onrender.com/api/health

## What's Next?

✅ Your Skill2Career app is now live and accessible worldwide!

### To make changes:
1. Edit code locally
2. Commit to GitHub
3. Push to GitHub
4. Render auto-deploys (within 5-10 minutes)

### To monitor:
- Use Render Dashboard for logs and metrics
- Check service status anytime

---

Need help? Check Render docs: https://render.com/docs
