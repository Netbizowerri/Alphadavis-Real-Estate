# Alphadavis Real Estate Limited - cPanel Deployment

## 🚀 Deployment Instructions

### Upload to cPanel:
1. Upload all files from the `dist/` folder to your cPanel public_html directory
2. Ensure these files are in the root directory:
   - `favicon.ico` (3.4KB)
   - `manifest.json`
   - `robots.txt`
   - `sitemap.xml`
   - `_redirects` (for SPA routing)
   - `.htaccess` (for Apache configuration)

### File Structure:
```
public_html/
├── index.html
├── favicon.ico
├── manifest.json
├── robots.txt
├── sitemap.xml
├── _redirects
├── .htaccess
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### SEO & Features:
- ✅ Comprehensive SEO with meta tags, structured data
- ✅ Sitemap.xml for Google Search Console
- ✅ Robots.txt configured
- ✅ SPA routing fixed for hard refresh
- ✅ Favicon with PWA manifest
- ✅ All fonts increased for better readability
- ✅ Enhanced property cards with depth effects

### URLs:
- Home: /
- About: /about
- Listings: /listings
- Request Property: /request-property

### Contact:
For any issues, check the SEO setup and ensure all files are uploaded to the root directory.