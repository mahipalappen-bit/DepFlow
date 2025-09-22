# 📧 Simple Gmail Email Setup - No External Services!

## 🎯 **What We Did:**
✅ **Removed EmailJS dependency** - no external services needed
✅ **Added direct Gmail SMTP** - uses your existing accounts directly  
✅ **Extended backend server** - added email endpoint
✅ **Simple configuration** - just need Gmail App Password

## 🚀 **Quick Setup (2 minutes):**

### **Step 1: Get Gmail App Password**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Go to **Security** → **2-Step Verification** → **App passwords**
4. Generate an app password for "DepFlow"
5. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### **Step 2: Configure Backend**
Replace `YOUR_GMAIL_APP_PASSWORD` in `/backend/src/quick-server.js`:

**Line 17:** 
```javascript
const EMAIL_PASS = 'abcd efgh ijkl mnop'; // Your actual app password
```

### **Step 3: Restart Backend Server**
```bash
cd "Dependency Management App/backend"
npm run dev
```

### **Step 4: Test Email**
1. Open http://localhost:3000
2. Login to DepFlow
3. Add/edit a dependency
4. Check `mmahipal.reddy@gmail.com` inbox!

## 📋 **Current Configuration:**
- **From**: `mahipal.appen@gmail.com`
- **To**: `mmahipal.reddy@gmail.com`  
- **Server**: Gmail SMTP (smtp.gmail.com:587)
- **Security**: OAuth2 via App Password

## ✅ **Features:**
- 📨 **Real Email Sending** - actual emails to your Gmail
- 🎨 **Beautiful HTML Emails** - professional formatting
- 🔒 **Secure Authentication** - uses Gmail's security
- 🚫 **No External Services** - everything runs on your infrastructure
- ⚡ **Fast Setup** - just need Gmail App Password

## 🧪 **Testing:**
After setup, these actions will send emails:
- ✅ Add new dependency
- ✅ Edit existing dependency
- ✅ Change status (via dropdown)
- ✅ Change priority (via dropdown)

## 📧 **Sample Email Content:**
```
Subject: DepFlow: Dependency Added - React Framework

🔔 DepFlow Notification

Dependency Added

Name: React Framework
Description: Frontend library for building user interfaces  
Team: Quality Flow
Status: NOT STARTED
Priority: HIGH
Action performed by: Admin User (admin@depflow.com)
Date: 9/22/2024 at 6:23:45 PM

This is an automated notification from DepFlow Dependency Management System
```

## 🔧 **How It Works:**
1. **Frontend** → Makes API call to backend `/api/v1/send-email`
2. **Backend** → Uses Nodemailer with Gmail SMTP
3. **Gmail** → Sends email from `mahipal.appen@gmail.com`
4. **Recipient** → Receives email at `mmahipal.reddy@gmail.com`

## 🆘 **Troubleshooting:**

**"Authentication failed"**
- Check Gmail App Password is correct
- Ensure 2-Step Verification is enabled

**"Connection refused"**  
- Check backend server is running on port 8000
- Verify firewall isn't blocking SMTP

**"Email not received"**
- Check spam folder
- Verify recipient email `mmahipal.reddy@gmail.com` is correct

**Console Errors**
- Check browser console for specific error messages
- Verify network requests to `/api/v1/send-email` are succeeding

## 🎉 **Benefits Over External Services:**
- ❌ No EmailJS signup required
- ❌ No external API limits  
- ❌ No third-party dependencies
- ✅ Direct Gmail integration
- ✅ Full control over email templates
- ✅ Uses your existing infrastructure
- ✅ More reliable and secure

## 📝 **Optional: Change Email Addresses**
To change sender/recipient, edit `/backend/src/quick-server.js`:

```javascript
const EMAIL_USER = 'your-sender@gmail.com';
const EMAIL_TO = 'your-recipient@gmail.com';
```

**That's it! Simple Gmail SMTP integration with no external services required.** 🎯
