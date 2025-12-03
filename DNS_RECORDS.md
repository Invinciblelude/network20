# DNS Records for thenetwork20.com

## Standard 4 DNS Records for GoDaddy

### Option 1: Using A Records (Recommended)

| # | Type | Name | Value | TTL |
|---|------|------|-------|-----|
| 1 | **A** | `@` | `[YOUR_HOSTING_IP]` | 600 |
| 2 | **A** | `www` | `[YOUR_HOSTING_IP]` | 600 |
| 3 | **CNAME** | `www` | `thenetwork20.com` | 600 |
| 4 | **A** | `*` | `[YOUR_HOSTING_IP]` | 600 |

**Note:** Use either #2 OR #3 for www, not both. Most people use #2 (A record).

### Option 2: Simplified (Most Common)

| # | Type | Name | Value | TTL |
|---|------|------|-------|-----|
| 1 | **A** | `@` | `[YOUR_HOSTING_IP]` | 600 |
| 2 | **A** | `www` | `[YOUR_HOSTING_IP]` | 600 |

**That's it!** These 2 are the minimum you need.

## What Each Record Does

1. **A Record @** → Points `thenetwork20.com` to your hosting IP
2. **A Record www** → Points `www.thenetwork20.com` to your hosting IP
3. **CNAME www** → Alternative to A record (points www to root domain)
4. **A Record *** → Wildcard (catches all subdomains)

## Where to Find Your Hosting IP

1. GoDaddy → **My Products** → **Web Hosting** → **Manage**
2. Look for **"Server Details"** or **"IP Address"**
3. Copy that IP (looks like: `192.168.1.1` or `50.63.202.1`)

## Quick Setup Steps

1. Go to: **GoDaddy** → **My Products** → **Domains** → **thenetwork20.com** → **DNS**
2. Delete any existing A records for @ and www (if they exist)
3. Add these 2 records:
   - **A Record**: Name = `@`, Value = `[YOUR_IP]`
   - **A Record**: Name = `www`, Value = `[YOUR_IP]`
4. Save
5. Wait 15-30 minutes for DNS to propagate

---

**Replace `[YOUR_HOSTING_IP]` with the actual IP from your GoDaddy hosting dashboard!**

