# Deploy Network 20 to GoDaddy (thenetwork20.com)

## Step 1: Build for Production

```bash
npx expo export -p web
```

This creates a `dist/` folder with all static files.

## Step 2: Upload to GoDaddy

### Option A: Using GoDaddy File Manager

1. Log into your GoDaddy account
2. Go to **My Products** → **Web Hosting** → **Manage**
3. Open **File Manager**
4. Navigate to `public_html/` (or your domain's root folder)
5. **Delete** any existing files (or backup first)
6. **Upload** all files from the `dist/` folder
7. Make sure `index.html` is in the root

### Option B: Using FTP

1. Get your FTP credentials from GoDaddy:
   - Go to **My Products** → **Web Hosting** → **Manage** → **FTP**
   - Note your FTP host, username, and password

2. Use an FTP client (FileZilla, Cyberduck, etc.):
   ```
   Host: ftp.thenetwork20.com (or your FTP host)
   Username: [your FTP username]
   Password: [your FTP password]
   Port: 21
   ```

3. Connect and upload all files from `dist/` to `public_html/`

## Step 3: Configure Domain

1. In GoDaddy, make sure `thenetwork20.com` points to your hosting
2. If using subdomain, point `www.thenetwork20.com` as well
3. Wait 24-48 hours for DNS propagation

## Step 4: Test

Visit `https://thenetwork20.com` and verify:
- ✅ Home page loads
- ✅ Can create profiles
- ✅ QR codes work
- ✅ All routes work (profile pages, etc.)

## Important Notes

- **HTTPS**: Make sure SSL certificate is enabled in GoDaddy
- **SPA Routing**: Expo Router uses client-side routing. You may need to configure `.htaccess` for GoDaddy:

Create `public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Troubleshooting

- **404 errors on routes**: Add the `.htaccess` file above
- **Assets not loading**: Check file paths are relative
- **Slow loading**: Enable compression in GoDaddy hosting settings

