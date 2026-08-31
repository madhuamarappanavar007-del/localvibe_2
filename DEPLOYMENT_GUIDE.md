# LocalVibe Production Deployment Guide

## Current Status

**Code Status:** ✅ Production Ready
**Git Status:** ✅ Clean (commit 868fc8c)
**Frontend Build:** ✅ Successful
**Backend Code:** ✅ Production Ready
**MongoDB:** ⚠️ Credentials need update
**Render Config:** ⚠️ Environment variables need update

---

## Critical Manual Actions Required

### Step 1: Update MongoDB Atlas Credentials

The current MongoDB credentials are returning "bad auth : authentication failed". You need to:

1. **Go to MongoDB Atlas Dashboard**
   - Log in to https://cloud.mongodb.com
   - Navigate to your cluster (cluster0.pvldsaj)

2. **Update Database User Password**
   - Go to Database Access
   - Find user: `madhuamarappanavar007_db_user`
   - Either:
     - Reset the password to a new secure password, OR
     - Create a new database user with a strong password

3. **Update Local .env File**
   - Open `backend/.env`
   - Replace the MONGODB_URI with the new connection string:
   ```
   MONGODB_URI=mongodb+srv://madhuamarappanavar007_db_user:NEW_PASSWORD@cluster0.pvldsaj.mongodb.net/localvibe?retryWrites=true&w=majority
   ```

4. **Test Local Connection**
   ```bash
   cd C:\Users\HP\Projects\localvibe_2\backend
   npm run dev
   ```
   - Should see "MongoDB connected successfully"

### Step 2: Configure Render Backend Environment Variables

1. **Go to Render Dashboard**
   - Navigate to: https://dashboard.render.com
   - Find your backend service: `localvibe-backend-2026`

2. **Add/Update Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://madhuamarappanavar007_db_user:NEW_PASSWORD@cluster0.pvldsaj.mongodb.net/localvibe?retryWrites=true&w=majority
   FRONTEND_URL=https://localvibe-frontend-a2x1.onrender.com
   ```

3. **Trigger Manual Deploy**
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Wait for deployment to complete

4. **Verify Backend Health**
   - Open: https://localvibe-backend-2026.onrender.com/api/health
   - Should return: `{"status":"ok","service":"LocalVibe API"}`

### Step 3: Configure Render Frontend Environment Variables

1. **Go to Render Dashboard**
   - Find your frontend service: `localvibe-frontend-a2x1`

2. **Add/Update Environment Variable**
   ```
   VITE_API_URL=https://localvibe-backend-2026.onrender.com/api
   ```

3. **Trigger Manual Deploy**
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Wait for deployment to complete

### Step 4: Whitelist Render IP in MongoDB Atlas

1. **Go to MongoDB Atlas Network Access**
   - Navigate to Security → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) OR
   - Add the specific Render deployment IP

2. **Verify Connection**
   - After Render redeploys, check backend logs for successful MongoDB connection

---

## Production Verification Checklist

After completing the above steps:

### Backend Verification
- [ ] https://localvibe-backend-2026.onrender.com/api/health returns 200
- [ ] https://localvibe-backend-2026.onrender.com/api/events returns events
- [ ] https://localvibe-backend-2026.onrender.com/api/events/categories returns categories
- [ ] Backend logs show "MongoDB connected successfully"

### Frontend Verification
- [ ] https://localvibe-frontend-a2x1.onrender.com loads
- [ ] Events display on the page
- [ ] No CORS errors in browser console
- [ ] Map markers appear
- [ ] Filters work

### Functional Testing
- [ ] Discover events loads successfully
- [ ] Event creation works
- [ ] RSVP functionality works
- [ ] User profile loads
- [ ] Geolocation works (when allowed)
- [ ] Filters work correctly
- [ ] Technology category displays correctly

---

## Troubleshooting

### Backend Returns 503
- Check Render logs for MongoDB connection errors
- Verify MONGODB_URI is correct in Render environment variables
- Ensure MongoDB Atlas IP whitelist includes Render deployment IP

### Frontend Shows "Cannot connect to backend"
- Verify VITE_API_URL is set in Render frontend environment variables
- Check that backend is returning 200 on /api/health
- Verify FRONTEND_URL is set in Render backend environment variables

### CORS Errors
- Ensure FRONTEND_URL matches the deployed frontend URL exactly
- Verify NODE_ENV=production is set in backend
- Check backend CORS configuration in server.js

### MongoDB Authentication Failed
- Verify username and password in connection string
- Check that database user exists in MongoDB Atlas
- Ensure password was recently reset and connection string updated

---

## Local Development Commands

### Backend
```bash
cd C:\Users\HP\Projects\localvibe_2\backend
npm install
npm run dev
```

### Frontend
```bash
cd C:\Users\HP\Projects\localvibe_2\frontend
npm install
npm run dev
```

### Seed Database
```bash
cd C:\Users\HP\Projects\localvibe_2
npm run seed
```

### Production Build
```bash
cd C:\Users\HP\Projects\localvibe_2\frontend
npm run build
```

---

## Security Notes

- ✅ .env files are excluded from Git
- ✅ .env.example files contain only placeholders
- ✅ No credentials committed to repository
- ✅ CORS is properly configured
- ✅ Security headers are enabled
- ⚠️ Update MongoDB password immediately
- ⚠️ Never commit real credentials

---

## Deployment URLs

**Frontend:** https://localvibe-frontend-a2x1.onrender.com
**Backend:** https://localvibe-backend-2026.onrender.com
**Git Repository:** https://github.com/madhuamarappanavar007-del/localvibe_2.git

---

## Next Steps

1. Update MongoDB credentials in Atlas
2. Update local backend/.env with new credentials
3. Test local development to verify MongoDB connection
4. Update Render backend environment variables
5. Update Render frontend environment variables
6. Whitelist Render IP in MongoDB Atlas
7. Trigger manual deploys on Render
8. Verify production deployment
9. Complete functional testing in production
10. Project is ready for submission
