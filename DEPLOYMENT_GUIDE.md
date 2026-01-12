# 🚀 Deployment Guide - British Wildlife Centre PWA

## ✅ Pre-Deployment Checklist

- [x] All 6 pages created and functional
- [x] Device features implemented (Camera, Geolocation, Battery, Responsive Images)
- [x] PWA files created (manifest.json, service-worker.js)
- [x] App icons generated and placed
- [x] Local testing completed
- [ ] Deploy to HTTPS hosting

---

## 📦 Deployment Option 1: GitHub Pages (Recommended)

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Name: `wildlife-centre-pwa` (or any name)
4. Keep it **Public**
5. **Don't** initialize with README
6. Click **"Create repository"**

### Step 2: Push Your Code

Open PowerShell in your project folder and run:

```powershell
cd D:\Paid_Assignment\APPLICATION_01

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Wildlife Centre PWA"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/wildlife-centre-pwa.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in left sidebar
4. Under **Source**: Select `main` branch
5. Click **Save**
6. Wait 1-2 minutes
7. Your app will be live at: `https://YOUR_USERNAME.github.io/wildlife-centre-pwa/`

### Step 4: Test PWA Features

1. Visit your deployed URL
2. Open Chrome DevTools (F12)
3. Check Console for service worker messages
4. Go to **Application** → **Manifest** - verify all correct
5. Look for **Install** button (⊕) in address bar
6. Click to install as PWA!

---

## 📦 Deployment Option 2: Netlify (Easiest)

### Step 1: Sign Up

1. Go to [netlify.com](https://app.netlify.com)
2. Sign up with GitHub/Email
3. Verify your email

### Step 2: Deploy

**Method A - Drag & Drop:**
1. Click **"Add new site"** → **"Deploy manually"**
2. Drag your entire `APPLICATION_01` folder into the drop zone
3. Wait for deployment (30 seconds)
4. Done! You get a URL like: `https://random-name.netlify.app`

**Method B - Git Integration:**
1. Push code to GitHub (see Option 1, Step 2)
2. In Netlify, click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub
4. Select your repository
5. Click **Deploy**
6. Auto-deploys on every git push!

### Step 3: Custom Domain (Optional)

1. In Netlify dashboard, click **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

---

## 📦 Deployment Option 3: Vercel

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Deploy

```powershell
cd D:\Paid_Assignment\APPLICATION_01
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? (select your account)
- Link to existing project? **N**
- Project name? **wildlife-centre-pwa**
- Directory? **./** (press Enter)
- Override settings? **N**

Done! You get a URL like: `https://wildlife-centre-pwa.vercel.app`

---

## 🧪 Post-Deployment Testing

### 1. Test Service Worker
```
Open DevTools → Console
Should see: [Service Worker] Installing... Activated
```

### 2. Test Offline Mode
```
1. Visit all pages (caches them)
2. DevTools → Network → Offline
3. Refresh → Still works!
```

### 3. Test PWA Install
```
Desktop Chrome: Look for ⊕ icon in address bar
Mobile: "Add to Home Screen" banner appears
```

### 4. Run Lighthouse Audit
```
1. Open DevTools → Lighthouse tab
2. Select "Progressive Web App"
3. Click "Generate report"
4. Aim for 90+ score
```

### 5. Test All Features
- [ ] Theme toggle works
- [ ] Navigation works
- [ ] Animals search/filter works
- [ ] Camera takes/uploads photos
- [ ] Map shows user location
- [ ] Tips track completion
- [ ] Favourites save/load
- [ ] Battery indicator appears (if supported)

---

## 🔧 Troubleshooting

### Service Worker Not Working?
- Check browser console for errors
- Ensure `service-worker.js` is in root
- Hard refresh: Ctrl+Shift+R
- Check Application → Service Workers

### Icons Not Showing?
- Verify files in `images/icons/` folder
- Check manifest.json paths
- Hard refresh browser
- Clear cache and reload

### Install Prompt Not Appearing?
- Must be on HTTPS (not http)
- Must visit site 2+ times (Chrome requirement)
- Service worker must be registered
- Manifest must be valid

### Offline Mode Not Working?
- Visit all pages online first (to cache)
- Check cache in Application → Cache Storage
- Verify service worker is active

---

## 📱 Share Your PWA

Once deployed, users can:

**Desktop (Chrome/Edge):**
1. Visit your URL
2. Click install icon (⊕) in address bar
3. App opens in its own window

**Android:**
1. Open URL in Chrome
2. Tap "Add to Home Screen"
3. App icon appears on home screen
4. Opens full-screen

**iOS (Safari):**
1. Open URL in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App icon appears on home screen

---

## 🎯 Your Deployed URLs

After deployment, update this section:

- **Live URL**: `https://your-url-here`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/wildlife-centre-pwa`
- **Status**: ✅ Deployed

---

## 📊 Expected Lighthouse Scores

| Category | Expected Score |
|----------|---------------|
| Performance | 85-95 |
| Accessibility | 90-100 |
| Best Practices | 90-100 |
| SEO | 90-100 |
| PWA | 90-100 ✓ |

---

## ✅ Deployment Complete!

Your Wildlife Centre PWA is now:
- ✅ Accessible worldwide via HTTPS
- ✅ Installable on all devices
- ✅ Works offline
- ✅ Has app-like experience
- ✅ Supports all device features

**Choose your deployment method above and follow the steps!**
