# Deploy to Render - Step by Step Guide

## Prerequisites
- A GitHub account (free)
- A Render account (free tier available)

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `premium-plots` (or any name you like)
4. Make it **Public** (or Private if you have GitHub Pro)
5. **Don't** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Upload Files to GitHub

### Option A: Using GitHub Website (Easy)

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL your files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `admin.html`
   - `admin.js`
   - `DHONE-Model.pdf 2.pdf`
   - `README.md`
   - Any other files
3. Scroll down, add commit message: "Initial commit"
4. Click **"Commit changes"**

### Option B: Using Git (Command Line)

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/premium-plots.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

## Step 3: Deploy to Render

1. Go to [Render](https://render.com) and sign up/login
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub account if not already connected
4. Select your repository: `premium-plots`
5. Configure:
   - **Name**: `premium-plots` (or any name)
   - **Branch**: `main` (or `master`)
   - **Build Command**: Leave empty (or use: `echo "No build needed"`)
   - **Publish Directory**: `.` (dot means root directory)
6. Click **"Create Static Site"**
7. Wait 2-3 minutes for deployment
8. Your site will be live at: `https://premium-plots.onrender.com` (or similar)

## Step 4: Custom Domain (Optional)

1. In Render dashboard, go to your site
2. Click **"Settings"**
3. Scroll to **"Custom Domains"**
4. Add your domain name
5. Follow DNS configuration instructions

## Important Notes

### File Paths
- Make sure all file paths are relative (they already are ✓)
- PDF file: `DHONE-Model.pdf 2.pdf` should work as-is

### Admin Panel
- The admin panel (`admin.html`) will be accessible at: `https://your-site.onrender.com/admin.html`
- Make sure to change the default password in `admin.js` before deploying!

### Free Tier Limits
- Render free tier: Sites spin down after 15 minutes of inactivity
- First load after spin-down may take 30-60 seconds
- For always-on hosting, consider Render's paid plans or alternatives

## Troubleshooting

### Site not loading?
- Check build logs in Render dashboard
- Make sure `index.html` is in the root directory
- Verify all file paths are correct

### PDF not showing?
- Make sure PDF file is uploaded to GitHub
- Check file name matches exactly (case-sensitive)

### Admin panel not working?
- Check browser console for errors
- Verify `admin.js` is uploaded correctly

## Alternative: Netlify (Easier, Faster)

If Render doesn't work, try Netlify:

1. Go to [Netlify](https://netlify.com)
2. Drag and drop your project folder
3. Done! Site is live instantly

---

**Your website will be live in minutes! 🚀**

