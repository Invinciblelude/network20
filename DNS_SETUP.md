# DNS Setup for thenetwork20.com on GoDaddy

## Step 1: Find Your Hosting IP Address

1. Log into GoDaddy
2. Go to **My Products** → **Web Hosting**
3. Click **Manage** next to your hosting plan
4. Look for **Server Details** or **IP Address**
5. Note your hosting IP address (usually looks like: `192.168.1.1` or similar)

## Step 2: Set Up DNS Records

Go to: **My Products** → **Domains** → **thenetwork20.com** → **DNS**

### Required DNS Records:

#### A Record (Root Domain - @)
```
Type: A
Name: @
Value: [YOUR_HOSTING_IP_ADDRESS]
TTL: 600 (or default)
```

#### A Record (WWW)
```
Type: A
Name: www
Value: [YOUR_HOSTING_IP_ADDRESS]
TTL: 600 (or default)
```

**OR** use CNAME for www (alternative):

#### CNAME Record (WWW)
```
Type: CNAME
Name: www
Value: thenetwork20.com
TTL: 600 (or default)
```

## Step 3: Verify DNS

After setting up DNS:
1. Wait 15-30 minutes for DNS propagation
2. Check DNS propagation: https://www.whatsmydns.net/#A/thenetwork20.com
3. Test your site: `http://thenetwork20.com` (before SSL activates)

## Important Notes

- **@** = root domain (thenetwork20.com)
- **www** = www.thenetwork20.com
- Use the **same IP address** for both @ and www A records
- DNS changes can take up to 48 hours, but usually work within 30 minutes
- Make sure your hosting is active before setting DNS

## Quick Reference

Your DNS records should look like this:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | [YOUR_IP] | 600 |
| A | www | [YOUR_IP] | 600 |

---

**Need to find your IP?** Check your GoDaddy hosting dashboard under "Server Details" or "IP Address"

