# Railway Deployment Configuration Guide

## 🚨 **CRITICAL: Root Directory Must Be Empty**

Both backend and frontend services **MUST** have an **EMPTY Root Directory** setting in Railway.

### Why?
- This is a **monorepo** with workspaces
- Railway needs to run from the repository root to access all workspaces
- The `cd backend` and `cd frontend` commands in the start scripts handle navigation

---

## 🔧 **Backend Service Configuration**

### In Railway Dashboard → Backend Service:

#### 1. **Settings → Source**
   - **Root Directory:** ← **LEAVE COMPLETELY EMPTY** (or set to `.`)
   - Click **Save**

#### 2. **Settings → Build**
   - **Build Command:** (leave empty, nixpacks handles it)
   - **Install Command:** (leave empty, nixpacks handles it)

#### 3. **Settings → Deploy**
   - **Start Command:** `cd backend && bun server.js`
   - Click **Save**

#### 4. **Settings → Environment Variables**
   - `NODE_ENV` = `production` (optional)
   - `PORT` = (Railway sets automatically)

---

## 🎨 **Frontend Service Configuration**

### In Railway Dashboard → Frontend Service:

#### 1. **Settings → Source**
   - **Root Directory:** ← **LEAVE COMPLETELY EMPTY** (or set to `.`)
   - Click **Save**

#### 2. **Settings → Build**
   - **Build Command:** (leave empty, nixpacks handles it)
   - **Install Command:** (leave empty, nixpacks handles it)

#### 3. **Settings → Deploy**
   - **Start Command:** `cd frontend && bun serve.js`
   - ⚠️ **CRITICAL:** If this field shows anything else (like `vite` or `bun run dev`), manually change it!
   - Click **Save**

#### 4. **Settings → Environment Variables**
   - **MUST ADD THIS:**
   - `VITE_CONSTRUCT_FLOW_API_URL` = `https://construct-flowbackend-production.up.railway.app/trpc`
   - Click **Add**

---

## 📋 **Deployment Checklist**

### Before Deploying:

- [ ] Backend Root Directory is **EMPTY**
- [ ] Frontend Root Directory is **EMPTY**  
- [ ] Frontend has `VITE_CONSTRUCT_FLOW_API_URL` environment variable set
- [ ] All changes committed and pushed to GitHub

### Deploy:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Railway configuration"
   git push
   ```

2. **Watch Deployments:**
   - Go to **Backend Service → Deployments**
   - Click latest deployment
   - Check **Build Logs** for errors
   - Check **Deploy Logs** for startup errors

3. **Verify Backend:**
   - Visit: `https://construct-flowbackend-production.up.railway.app/`
   - Should see: `OK`

4. **Verify Frontend:**
   - Visit: `https://construct-flowfrontend-production.up.railway.app/`
   - Should see: Your app UI

---

## 🐛 **Troubleshooting**

### "Script not found 'start'" or "Script not found 'build'"
- ✅ **Verify:** Root Directory is **EMPTY** in Railway dashboard
- ✅ **Verify:** You've committed and pushed latest code
- ✅ **Try:** Manually trigger redeploy

### Frontend shows blank page
- ✅ **Check:** Build logs show `vite build` completed successfully
- ✅ **Check:** Deploy logs show `🚀 Starting Construct Flow Frontend Server...`
- ✅ **Check:** `VITE_CONSTRUCT_FLOW_API_URL` environment variable is set
- ✅ **Try:** Hard refresh browser (Ctrl+Shift+R) or open in incognito

### Backend crashes on start
- ✅ **Check:** Deploy logs for error messages
- ✅ **Verify:** Start command is `cd backend && bun server.js`
- ✅ **Verify:** `server.js` exists in backend folder

---

## 📁 **Expected File Structure on Railway**

```
/app/                          ← Railway starts here (repo root)
├── backend/
│   ├── server.js              ← Backend start script
│   ├── package.json
│   └── nixpacks.toml
├── frontend/
│   ├── serve.js               ← Frontend start script  
│   ├── dist/                  ← Built files
│   ├── package.json
│   └── nixpacks.toml
├── shared/
│   ├── schemas.ts
│   └── package.json
├── package.json               ← Root package.json
└── bun.lock
```

Start commands navigate to subdirectories:
- Backend: `cd backend && bun server.js`
- Frontend: `cd frontend && bun serve.js`

---

## ✅ **Success Indicators**

### Backend Deployed Successfully:
```
Build Logs:
  ✓ bun install
  ✓ No build needed (echo message)

Deploy Logs:
  ✓ 🚀 Starting Construct Flow Backend Server...
  ✓ ✅ Server running on port 3000
```

### Frontend Deployed Successfully:
```
Build Logs:
  ✓ bun install
  ✓ cd frontend && bun run build
  ✓ vite build completed

Deploy Logs:
  ✓ 🚀 Starting Construct Flow Frontend Server...
  ✓ 📁 Serving from: /app/frontend/dist
  ✓ ✅ Server running on port 6173
```

