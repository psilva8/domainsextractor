# 🚀 Domain Extractor Deployment Guide

## Quick Start (Easiest Option)

### Option 1: Deploy Standalone HTML to GitHub Pages
**Simplest deployment - single file, zero configuration**

1. **Create GitHub Repository**:
   ```bash
   git init
   git add standalone-domain-extractor.html
   git commit -m "Add Domain Extractor"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/domain-extractor.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

3. **Access Your Site**:
   - URL: `https://YOUR_USERNAME.github.io/domain-extractor/standalone-domain-extractor.html`

---

## Option 2: Deploy Web App (Full Featured)

### A. GitHub Pages (Static)
```bash
# 1. Add to package.json in apps/web
"scripts": {
  "build": "react-router build",
  "deploy": "npm run build && gh-pages -d build"
}

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Build and deploy
npm run deploy
```

### B. Vercel (Recommended for React Apps)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. From apps/web directory
vercel

# Follow prompts - auto-detects React Router
```

### C. Netlify
```bash
# 1. Build settings:
# Build command: npm run build
# Publish directory: build
# Base directory: apps/web

# 2. Deploy via git or drag & drop build folder
```

---

## Option 3: Deploy Both Versions

### Vercel Multi-App Setup
```json
// vercel.json in project root
{
  "builds": [
    { "src": "apps/web/package.json", "use": "@vercel/node" },
    { "src": "standalone-domain-extractor.html", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/standalone", "dest": "/standalone-domain-extractor.html" },
    { "src": "/(.*)", "dest": "/apps/web/$1" }
  ]
}
```

---

## Mobile Web Version (Expo)

### Deploy Mobile as Web
```bash
# From apps/mobile
npx expo build:web
npx expo export:web

# Deploy the web-build folder to any static host
```

---

## Environment Variables

### For Web App Deployment
Create `.env` file in `apps/web`:
```bash
# No external dependencies needed for basic functionality
# Add any API keys here if you extend the app
```

---

## GitHub Actions (Automated Deployment)

### Create `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install and Build Web App
      run: |
        cd apps/web
        npm install
        npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./apps/web/build
```

---

## Recommendations by Use Case

### 🎯 Personal Project / Portfolio
- **Use**: Standalone HTML + GitHub Pages
- **Pros**: Instant deployment, no build process
- **Time**: 5 minutes

### 🚀 Professional / Business
- **Use**: Web App + Vercel
- **Pros**: Better performance, SEO, scalability
- **Time**: 10 minutes

### 🔥 Show Off Both Versions
- **Use**: Vercel with both apps
- **Pros**: Showcase full project capabilities
- **Time**: 15 minutes

---

## Post-Deployment Checklist

- [ ] Custom domain (optional)
- [ ] HTTPS enabled
- [ ] Favicon appears correctly
- [ ] All export functions work
- [ ] Mobile responsive design
- [ ] Page load speed optimized

## Domain Setup (Optional)

### Custom Domain on GitHub Pages
1. Add CNAME file with your domain
2. Configure DNS A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

### Custom Domain on Vercel
1. Add domain in Vercel dashboard
2. Configure DNS with provided values
3. Automatic HTTPS setup
