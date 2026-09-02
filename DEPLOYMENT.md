# 🚀 Deployment Workflow - Domain Extractor

## ⚠️ IMPORTANT: File Location Rules

**ALL website files that will be deployed MUST be in the `static/` directory.**

### 📁 Project Structure

```
Domain Extractor/
├── static/              ← 🎯 LIVE WEBSITE FILES (Cloudflare serves from here)
│   ├── index.html      ← Main website
│   ├── sitemap.xml     ← SEO sitemap  
│   ├── robots.txt      ← Search engine instructions
│   └── test.html       ← Test pages
├── apps/               ← Development versions (not deployed)
├── wrangler.toml       ← Cloudflare Pages configuration
└── README.md           ← Project documentation
```

### ✅ Correct Workflow

1. **Edit files in**: `static/` directory
2. **Test locally**: Open `static/index.html` in browser
3. **Deploy**: `git add static/` → `git commit` → `git push`
4. **Cloudflare Pages**: Automatically deploys from `static/`

### ❌ Wrong Workflow (causes 500 errors)

1. **Don't edit**: Root directory files (`/index.html`)
2. **Don't create**: Duplicate files outside `static/`
3. **Don't assume**: Browser preview = live website

## 🔄 Deployment Chain

```
You Edit → static/ → GitHub → Cloudflare Pages → Live Website
```

## 🛠️ Common Tasks

### Adding a New Page
```bash
# ✅ Correct
touch static/about.html
# Edit static/about.html
git add static/about.html
git commit -m "Add about page"
git push

# ❌ Wrong
touch about.html  # This won't be deployed!
```

### Updating SEO Files
```bash
# ✅ Correct 
vim static/sitemap.xml
vim static/robots.txt
git add static/
git commit -m "Update SEO files"
git push

# ❌ Wrong
vim sitemap.xml  # Cloudflare won't see this!
```

### Verifying Deployment
1. **Local**: Check `static/` folder has your changes
2. **GitHub**: Verify commit shows `static/` files
3. **Live**: Wait 2-3 minutes, then check `https://domainsextractor.com`

## 🐛 Troubleshooting

### "My changes aren't showing on the website"
- ✅ Check: Did you edit files in `static/`?
- ✅ Check: Did you commit `static/` files?
- ✅ Wait: 2-3 minutes for Cloudflare deployment

### "Sitemap returns 500 error"
- Usually means `static/sitemap.xml` is outdated
- Copy root files to static: `cp sitemap.xml static/`

### "Google Search Console can't fetch sitemap"
- Verify: `https://domainsextractor.com/sitemap.xml` loads in browser
- Check: `static/sitemap.xml` has correct domain
- Wait: 5-15 minutes after deployment, then resubmit

## 📋 Pre-Deployment Checklist

- [ ] All changes made in `static/` directory
- [ ] No duplicate files in root directory  
- [ ] SEO files (sitemap.xml, robots.txt) updated in `static/`
- [ ] Committed and pushed `static/` changes
- [ ] Waited 2-3 minutes for Cloudflare deployment
- [ ] Tested live website loads correctly

---

**Remember**: `static/` = Live Website | Root = Documentation/Config