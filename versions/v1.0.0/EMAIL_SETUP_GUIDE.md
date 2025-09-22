# 📧 Email Setup Guide for DepFlow

## 🚨 Current Issue
The emails are not being received because the current implementation uses **EmailJS** which requires proper configuration. Follow this guide to set up real email sending.

## 🔧 Option 1: EmailJS Setup (Recommended - No Backend Required)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

### Step 2: Set up Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose **Gmail** (recommended for mahipal.appen@gmail.com)
4. Enter your Gmail credentials:
   - Email: `mahipal.appen@gmail.com`
   - Password: Use App Password (see Gmail setup below)
5. Copy the **Service ID** (e.g., service_abc123)

### Step 3: Create Email Template
1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template:

```
Subject: DepFlow: {{action_type}} - {{dependency_name}}

Hello,

A dependency has been {{action_type}} in DepFlow:

Name: {{dependency_name}}
Description: {{dependency_description}}
Team: {{dependency_team}}
Status: {{dependency_status}}
Priority: {{dependency_priority}}

Action performed by: {{user_name}} ({{user_email}})
Date: {{action_date}} at {{action_time}}

This is an automated notification from DepFlow Dependency Management System.

Best regards,
DepFlow System
```

4. Copy the **Template ID** (e.g., template_xyz789)

### Step 4: Get Public Key
1. Go to **Account** in EmailJS dashboard
2. Copy your **Public Key** (e.g., user_abc123def456)

### Step 5: Update DepFlow Configuration
Replace these values in `/frontend/public/app.js`:

```javascript
// Line 637: Replace YOUR_PUBLIC_KEY
emailjs.init("YOUR_ACTUAL_PUBLIC_KEY_HERE");

// Line 676: Replace YOUR_SERVICE_ID
'YOUR_ACTUAL_SERVICE_ID_HERE',

// Line 677: Replace YOUR_TEMPLATE_ID  
'YOUR_ACTUAL_TEMPLATE_ID_HERE',
```

## 🔐 Gmail App Password Setup

### For mahipal.appen@gmail.com:
1. Go to Gmail → Manage your Google Account
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Generate app password for "EmailJS"
5. Use this app password (not regular password) in EmailJS

## 🧪 Testing

After setup:
1. Add/edit a dependency in DepFlow
2. Check browser console for success/error messages
3. Check mmahipal.reddy@gmail.com inbox
4. Check spam folder if not in inbox

## 🔧 Option 2: Backend SMTP Setup (Alternative)

If you prefer backend email sending, you'll need to:

1. **Install nodemailer** in your backend:
```bash
npm install nodemailer
```

2. **Add email route** to your backend server:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'mahipal.appen@gmail.com',
        pass: 'YOUR_GMAIL_APP_PASSWORD'
    }
});

app.post('/api/send-email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: 'mahipal.appen@gmail.com',
            to: 'mmahipal.reddy@gmail.com',
            subject: req.body.subject,
            html: req.body.html
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

3. **Switch to SMTP function** in frontend:
Replace `sendEmailNotification` calls with `sendEmailNotificationSMTP` calls in app.js

## 📊 Current Status

- ✅ EmailJS library loaded
- ✅ Email templates configured  
- ❌ EmailJS credentials need to be configured
- ❌ Gmail app password needed

## 🎯 Quick Fix for Testing

For immediate testing, you can also:

1. Use a simple test service like **Formspree** or **Netlify Forms**
2. Set up a webhook to forward emails
3. Use a service like **Zapier** to connect to Gmail

## 🆘 Troubleshooting

**Common Issues:**
- "EmailJS is not defined" → Check if CDN is loaded
- "Invalid public key" → Verify public key from EmailJS dashboard  
- "Service not found" → Check service ID
- "Template not found" → Check template ID
- "Authentication failed" → Check Gmail app password

**Debug Steps:**
1. Open browser console
2. Add/edit a dependency
3. Look for EmailJS error messages
4. Check Network tab for failed requests
