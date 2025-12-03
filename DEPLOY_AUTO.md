# 🚀 Automatic Deployment from GitHub to GoDaddy

## Setup Once, Deploy Forever!

Every time you push to GitHub, it will automatically deploy to thenetwork20.com!

## Step 1: Get Your GoDaddy FTP Credentials

1. Log into **GoDaddy.com**
2. Go to **My Products** → **Web Hosting** → **Manage**
3. Click **FTP** or **FTP Accounts**
4. Note these 3 things:
   - **FTP Host**: (usually `ftp.thenetwork20.com` or an IP)
   - **FTP Username**: (your FTP username)
   - **FTP Password**: (your FTP password)

## Step 2: Add Secrets to GitHub

1. Go to: **https://github.com/Invinciblelude/network20/settings/secrets/actions**
2. Click **"New repository secret"**
3. Add these 3 secrets:

   **Secret 1:**
   - Name: `GODADDY_FTP_HOST`
   - Value: `[YOUR_FTP_HOST]` (from Step 1)

   **Secret 2:**
   - Name: `GODADDY_FTP_USER`
   - Value: `[YOUR_FTP_USERNAME]` (from Step 1)

   **Secret 3:**
   - Name: `GODADDY_FTP_PASS`
   - Value: `[YOUR_FTP_PASSWORD]` (from Step 1)

## Step 3: Push to GitHub

```bash
git add .
git commit -m "Setup auto-deployment"
git push origin main
```

## Step 4: Watch It Deploy!

1. Go to: **https://github.com/Invinciblelude/network20/actions**
2. You'll see the deployment running
3. Wait 2-3 minutes
4. Your site will be live at **https://thenetwork20.com**!

## How It Works

- Every time you `git push`, GitHub Actions:
  1. Builds your site
  2. Uploads to GoDaddy via FTP
  3. Your site updates automatically!

## Troubleshooting

- **Deployment fails?** Check the Actions tab for errors
- **FTP credentials wrong?** Update the secrets in GitHub
- **Site not updating?** Clear browser cache (Cmd+Shift+R)

---

**That's it!** Once set up, you never have to manually upload files again! 🎉

