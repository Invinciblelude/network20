# 🚀 Deploy Network 20 to GoDaddy (thenetwork20.com)

## ✅ Build Complete!

Your production build is ready in the `dist/` folder.

## 📤 Upload to GoDaddy

### Method 1: GoDaddy File Manager (Easiest)

1. **Log into GoDaddy**
   - Go to https://www.godaddy.com
   - Sign in to your account

2. **Access File Manager**
   - Click **My Products**
   - Find **Web Hosting** for `thenetwork20.com`
   - Click **Manage**
   - Click **File Manager** (or **cPanel** → **File Manager**)

3. **Navigate to Root Directory**
   - Go to `public_html/` folder (this is your website root)
   - **IMPORTANT**: If there are existing files, backup or delete them first

4. **Upload Files**
   - Click **Upload** button
   - Select **ALL files and folders** from `/Users/invinciblelude/network20/dist/`
   - Upload:
     - `index.html`
     - `favicon.ico`
     - `metadata.json`
     - `_expo/` folder (entire folder)
     - `assets/` folder (entire folder)
     - `.htaccess` file (make sure this uploads - it's hidden by default)

5. **Verify Upload**
   - Make sure `index.html` is in the root of `public_html/`
   - Make sure `.htaccess` is there (enable "Show Hidden Files" if needed)

### Method 2: FTP (Faster for Large Files)

1. **Get FTP Credentials**
   - Go to GoDaddy → **My Products** → **Web Hosting** → **Manage**
   - Click **FTP** or **FTP Accounts**
   - Note your:
     - FTP Host: `ftp.thenetwork20.com` or similar
     - Username: (your FTP username)
     - Password: (your FTP password)

2. **Use FTP Client**
   - Download FileZilla (free): https://filezilla-project.org/
   - Connect with your credentials
   - Navigate to `public_html/` on the server
   - Upload all contents of `dist/` folder

3. **Upload All Files**
   - Drag and drop everything from `dist/` to `public_html/`
   - Make sure `.htaccess` uploads (it's a hidden file)

## 🔧 Configure Domain

1. **Check DNS Settings**
   - Go to GoDaddy → **My Products** → **Domains**
   - Click **DNS** for `thenetwork20.com`
   - Make sure there's an **A Record** pointing to your hosting IP
   - Or a **CNAME** pointing to your hosting

2. **Enable SSL (HTTPS)**
   - Go to **Web Hosting** → **Manage** → **SSL**
   - Enable SSL certificate (usually free with GoDaddy hosting)
   - Wait for activation (can take a few minutes)

## ✅ Test Your Site

1. **Wait 5-10 minutes** for files to propagate
2. Visit: `https://thenetwork20.com`
3. Test:
   - ✅ Home page loads
   - ✅ Can create a profile
   - ✅ Can view profiles
   - ✅ QR codes work
   - ✅ All routes work (try `/create`, `/my-cards`, etc.)

## 🐛 Troubleshooting

### 404 Errors on Routes
- **Problem**: Routes like `/profile/123` show 404
- **Solution**: Make sure `.htaccess` file uploaded correctly
- Check File Manager → Enable "Show Hidden Files"
- Verify `.htaccess` is in `public_html/` root

### Assets Not Loading
- **Problem**: Images, fonts, or styles don't load
- **Solution**: 
  - Check file paths in browser console
  - Make sure `_expo/` and `assets/` folders uploaded completely
  - Verify all files are in correct locations

### SSL Not Working
- **Problem**: Site shows "Not Secure"
- **Solution**:
  - Enable SSL in GoDaddy hosting settings
  - Wait 15-30 minutes for certificate activation
  - Clear browser cache

### Slow Loading
- **Solution**: 
  - Enable compression in GoDaddy hosting settings
  - The `.htaccess` file already includes compression rules

## 📝 Quick Checklist

- [ ] All files uploaded to `public_html/`
- [ ] `.htaccess` file is present
- [ ] `index.html` is in root
- [ ] SSL certificate enabled
- [ ] DNS pointing to hosting
- [ ] Tested on `https://thenetwork20.com`
- [ ] All routes work
- [ ] QR codes generate correctly

## 🔄 Future Updates

When you make changes:

1. **Rebuild**:
   ```bash
   cd /Users/invinciblelude/network20
   npx expo export -p web
   ```

2. **Upload** new files from `dist/` folder

3. **Clear browser cache** and test

---

**Your site should be live at: https://thenetwork20.com** 🎉

