# 🔐 Setup Automatic Deployment

## What You Need (NOT a GitHub Token!)

You need **GoDaddy FTP credentials**, not a GitHub token.

## Step 1: Get GoDaddy FTP Info

1. Log into **GoDaddy.com**
2. **My Products** → **Web Hosting** → **Manage**
3. Click **"FTP"** or **"FTP Accounts"**
4. You'll see:
   - **FTP Host**: (like `ftp.thenetwork20.com` or an IP)
   - **FTP Username**: (your username)
   - **FTP Password**: (your password)

## Step 2: Add to GitHub Secrets

1. Go to: **https://github.com/Invinciblelude/network20/settings/secrets/actions**
2. Click **"New repository secret"** (3 times, once for each):

   **Secret 1:**
   ```
   Name: GODADDY_FTP_HOST
   Value: [paste your FTP Host here]
   ```

   **Secret 2:**
   ```
   Name: GODADDY_FTP_USER
   Value: [paste your FTP Username here]
   ```

   **Secret 3:**
   ```
   Name: GODADDY_FTP_PASS
   Value: [paste your FTP Password here]
   ```

## Step 3: Test It!

1. Make a small change to any file
2. Run:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to: **https://github.com/Invinciblelude/network20/actions**
4. Watch it deploy automatically!

## ⚠️ Security Note

If you shared a GitHub token, revoke it:
- Go to: https://github.com/settings/tokens
- Find and revoke the token
- Create a new one if needed (but you don't need it for this)

---

**You need GoDaddy FTP credentials, NOT a GitHub token!**

