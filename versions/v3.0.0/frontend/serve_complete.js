const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

// Team owner mappings
const teamOwners = {
    'Quality flow': 'mmahipal.reddy@gmail.com',
    'Annotation tools': 'mmahipal.reddy@gmail.com',
    'Data Collection': 'mmahipal.reddy@gmail.com',
    'ADAP Platform': 'mmahipal.reddy@gmail.com',
    'CrowdGen': 'mmahipal.reddy@gmail.com',
    'Mercury': 'mmahipal.reddy@gmail.com',
    'Marketing Cloud': 'mmahipal.reddy@gmail.com',
    'Data Engineering': 'mmahipal.reddy@gmail.com',
    'Analytics': 'mmahipal.reddy@gmail.com',
    'Product Management': 'mmahipal.reddy@gmail.com'
};

// Email configuration (using Gmail SMTP for real email sending)
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mahipal.appen@gmail.com',    // Replace with your Gmail address
        pass: 'cylevommkqvzrfbd'    // Gmail App Password (remove spaces)
    }
});

// Function to send dependency assignment notification
async function sendDependencyNotification(dependencyData, actionType) {
    const teamOwnerEmail = teamOwners[dependencyData.team];
    
    if (!teamOwnerEmail) {
        console.log('⚠️  No team owner configured for team:', dependencyData.team);
        return { success: false, message: 'No team owner configured' };
    }

    const subject = `Project Update: ${dependencyData.name} - ${actionType}`;
    
    // Simple plain text version to avoid spam filters
    const textBody = `
Hi there!

A project dependency has been ${actionType.toLowerCase()} to your team.

Details:
- Name: ${dependencyData.name}
- Description: ${dependencyData.description}
- Team: ${dependencyData.team}
- Status: ${dependencyData.status}
- Priority: ${dependencyData.priority}
${dependencyData.jiraTicket ? `- Jira: ${dependencyData.jiraTicket}` : ''}
- ${actionType} By: ${dependencyData.createdBy}
- Date: ${new Date().toLocaleString()}

Please check the dependency management system for more details.

Best regards,
Project Management Team
    `;

    // Simplified HTML version
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 500px;">
            <h3>Project Update: ${dependencyData.name}</h3>
            
            <p>Hi there!</p>
            <p>A project dependency has been <strong>${actionType.toLowerCase()}</strong> to your team.</p>
            
            <h4>Details:</h4>
            <ul>
                <li><strong>Name:</strong> ${dependencyData.name}</li>
                <li><strong>Description:</strong> ${dependencyData.description}</li>
                <li><strong>Team:</strong> ${dependencyData.team}</li>
                <li><strong>Status:</strong> ${dependencyData.status}</li>
                <li><strong>Priority:</strong> ${dependencyData.priority}</li>
                ${dependencyData.jiraTicket ? `<li><strong>Jira:</strong> <a href="${dependencyData.jiraTicket}">${dependencyData.jiraTicket}</a></li>` : ''}
                <li><strong>${actionType} By:</strong> ${dependencyData.createdBy}</li>
                <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            
            <p>Please check the dependency management system for more details.</p>
            
            <p>Best regards,<br>
            Project Management Team</p>
        </div>
    `;

    const mailOptions = {
        from: '"Project Management Team" <mahipal.appen@gmail.com>', // Friendly name + email
        to: teamOwnerEmail,
        subject: subject,
        text: textBody, // Plain text version (helps avoid spam)
        html: htmlBody  // HTML version for better formatting
    };

    try {
        console.log(`📧 Sending ${actionType} notification to:`, teamOwnerEmail);
        console.log('📧 Email subject:', subject);
        
        // For testing/demo purposes, we'll log the email content instead of sending
        console.log('📧 EMAIL NOTIFICATION DETAILS:');
        console.log('   To:', teamOwnerEmail);
        console.log('   Subject:', subject);
        console.log('   Dependency:', dependencyData.name);
        console.log('   Team:', dependencyData.team);
        console.log('   Action:', actionType);
        
        // Send the actual email
        const result = await emailTransporter.sendMail(mailOptions);
        
        console.log('✅ Real email sent successfully to:', teamOwnerEmail);
        console.log('📧 Email result:', result.messageId);
        return { success: true, message: 'Real email sent to ' + teamOwnerEmail };
        
    } catch (error) {
        console.error('❌ Failed to process email:', error.message);
        return { success: false, message: error.message };
    }
}

// Helper functions for email styling
function getStatusColor(status) {
    switch (status) {
        case 'NOT STARTED': return '#6b7280';
        case 'IN PROGRESS': return '#d97706';
        case 'BLOCKED': return '#dc2626';
        case 'COMPLETED': return '#15803d';
        default: return '#6b7280';
    }
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'HIGH': return '#dc2626';
        case 'MEDIUM': return '#d97706';
        case 'LOW': return '#15803d';
        default: return '#6b7280';
    }
}

const completeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DepFlow - Enterprise Dependency Management Platform</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231e3a8a'/%3E%3Cstop offset='100%25' style='stop-color:%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23grad)'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%23ffffff'/%3E%3Ccircle cx='16' cy='8' r='2.5' fill='%23ffffff'/%3E%3Ccircle cx='24' cy='8' r='2.5' fill='%23ffffff'/%3E%3Ccircle cx='12' cy='16' r='2.5' fill='%23e0e7ff'/%3E%3Ccircle cx='20' cy='16' r='2.5' fill='%23e0e7ff'/%3E%3Ccircle cx='8' cy='24' r='2.5' fill='%23ffffff'/%3E%3Ccircle cx='16' cy='24' r='2.5' fill='%23ffffff'/%3E%3Ccircle cx='24' cy='24' r='2.5' fill='%23ffffff'/%3E%3Cline x1='8' y1='8' x2='12' y2='16' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='16' y1='8' x2='12' y2='16' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='16' y1='8' x2='20' y2='16' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='24' y1='8' x2='20' y2='16' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='12' y1='16' x2='8' y2='24' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='12' y1='16' x2='16' y2='24' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='20' y1='16' x2='16' y2='24' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3Cline x1='20' y1='16' x2='24' y2='24' stroke='%23ffffff' stroke-width='1.5' opacity='0.9'/%3E%3C/svg%3E">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #f9fafb 0%, #eff6ff 100%);
            min-height: 100vh;
            color: #111827;
            line-height: 1.6;
        }
        
        /* DepFlow Logo Styles */
        .depflow-logo {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .logo-icon {
            position: relative;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-icon::before {
            content: '';
            position: absolute;
            width: 32px;
            height: 32px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%231e3a8a'/%3E%3Ccircle cx='16' cy='8' r='2.5' fill='%231e3a8a'/%3E%3Ccircle cx='24' cy='8' r='2.5' fill='%231e3a8a'/%3E%3Ccircle cx='12' cy='16' r='2.5' fill='%233b82f6'/%3E%3Ccircle cx='20' cy='16' r='2.5' fill='%233b82f6'/%3E%3Ccircle cx='8' cy='24' r='2.5' fill='%231e3a8a'/%3E%3Ccircle cx='16' cy='24' r='2.5' fill='%231e3a8a'/%3E%3Ccircle cx='24' cy='24' r='2.5' fill='%231e3a8a'/%3E%3Cline x1='8' y1='8' x2='12' y2='16' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='16' y1='8' x2='12' y2='16' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='16' y1='8' x2='20' y2='16' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='24' y1='8' x2='20' y2='16' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='12' y1='16' x2='8' y2='24' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='12' y1='16' x2='16' y2='24' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='20' y1='16' x2='16' y2='24' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='20' y1='16' x2='24' y2='24' stroke='%233b82f6' stroke-width='1.5' opacity='0.8'/%3E%3C/svg%3E") center/contain no-repeat;
        }
        
        .logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1;
        }
        
        .logo-brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .logo-subtitle {
            font-size: 0.75rem;
            color: #bfdbfe;
            font-weight: 500;
            opacity: 0.9;
        }
        
        /* Compact logo for smaller spaces */
        .depflow-logo.compact {
            gap: 0.5rem;
        }
        
        .depflow-logo.compact .logo-icon {
            width: 32px;
            height: 32px;
        }
        
        .depflow-logo.compact .logo-brand {
            font-size: 1.25rem;
        }
        
        .depflow-logo.compact .logo-subtitle {
            font-size: 0.625rem;
        }
        
        /* Content area logo styling (for light backgrounds) */
        .content-header .depflow-logo .logo-brand {
            color: #1e3a8a;
            text-shadow: none;
        }
        
        .content-header .depflow-logo .logo-subtitle {
            color: #3b82f6;
        }
        
        .hero-section {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .hero-section h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .hero-section h2 {
            font-size: 2rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 1rem;
        }
        
        .hero-section p {
            font-size: 1.2rem;
            color: #6b7280;
            margin-bottom: 2rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
        }
        
        .login-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header h3 {
            color: #1f2937;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }
        
        .modal-header p {
            color: #6b7280;
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #374151;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
        
        .btn-cancel {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
        }
        
        .btn-login {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .btn-login:hover {
            background: #2563eb;
        }
        
        .quick-login {
            display: flex;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .quick-btn {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
        }
        
        .quick-btn:hover {
            background: #e2e8f0;
        }
        
        /* User panel styles */
        .user-panel {
            position: fixed;
            top: 1rem;
            right: 1.5rem;
            z-index: 1010;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 0.5rem 0.75rem;
            display: flex !important;
            align-items: center;
            gap: 0.5rem;
            border: 1px solid #e5e7eb;
        }
        
        .user-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.75rem;
        }
        
        .user-info {
            text-align: left;
        }
        
        .user-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.75rem;
        }
        
        .user-role {
            font-size: 0.625rem;
            color: #6b7280;
        }
        
        .btn-logout {
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.375rem;
        }
        
        .btn-logout:hover {
            background: #dc2626;
        }
        
        /* Dashboard styles */
        .dashboard {
            display: none;
            min-height: 100vh;
            background: #f9fafb;
        }
        
        .dashboard.active {
            display: block;
        }
        
        .dashboard-layout {
            display: flex;
            width: 100%;
            min-height: calc(100vh - 8rem);
        }
        
        .sidebar {
            width: 280px;
            background: #f8fafc;
            border-right: 1px solid #e5e7eb;
            padding: 2rem;
            box-shadow: 2px 0 4px rgba(0,0,0,0.1);
        }
        
        .sidebar h3 {
            color: #1f2937;
            font-size: 1.125rem;
            font-weight: 600;
            margin: 0 0 1.5rem 0;
        }
        
        .counter-grid {
            display: grid;
            gap: 1rem;
        }
        
        .counter-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .counter-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-color: #3b82f6;
        }
        
        .counter-card.active {
            border: 2px solid #3b82f6;
            background: #eff6ff;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .counter-value {
            font-size: 1.875rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .counter-label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
        }
        
        .main-content {
            flex: 1;
            padding: 2rem;
            max-width: calc(100% - 280px);
        }
        
        .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .content-title {
            color: #1f2937;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .btn-add {
            background: #10b981;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-add:hover {
            background: #059669;
        }
        
        .search-filter-panel {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .filter-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
        }
        
        .search-group {
            flex: 1;
            min-width: 250px;
            position: relative;
        }
        
        .search-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
        }
        
        .search-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
        }
        
        .filter-select {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            min-width: 150px;
        }
        
        .btn-clear {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .dependency-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .table th {
            background: #f8fafc;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .table td {
            padding: 1rem;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: middle;
        }
        
        .table tr:hover {
            background: #f8fafc;
        }
        
        .dependency-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.25rem;
        }
        
        .dependency-desc {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .status-select {
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
        }
        
        .status-not-started { background: #f3f4f6; color: #374151; }
        .status-in-progress { background: #fef3c7; color: #d97706; }
        .status-blocked { background: #fecaca; color: #dc2626; }
        .status-completed { background: #dcfce7; color: #15803d; }
        
        .priority-select {
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
        }
        
        .priority-high { background: #fecaca; color: #dc2626; }
        .priority-medium { background: #fef3c7; color: #d97706; }
        .priority-low { background: #dcfce7; color: #15803d; }
        
        .btn-edit, .btn-delete {
            border: none;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
            margin-right: 0.5rem;
        }
        
        .btn-edit {
            background: #dbeafe;
            color: #1d4ed8;
        }
        
        .btn-delete {
            background: #fecaca;
            color: #dc2626;
        }
        
        .btn-edit:hover { background: #bfdbfe; }
        .btn-delete:hover { background: #fca5a5; }
        
        .btn-edit:disabled, .btn-delete:disabled {
            background: #f3f4f6;
            color: #9ca3af;
            cursor: not-allowed;
        }
        
        .notification {
            position: fixed;
            top: 6rem;
            right: 2rem;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            display: none;
        }
        
        .notification.success {
            border-left: 4px solid #10b981;
        }
        
        .notification.error {
            border-left: 4px solid #ef4444;
        }
        
        /* Dashboard Header at Top of Page */
        .dashboard-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%);
            color: white;
            padding: 1.25rem 0;
            margin: 0 0 1.5rem 0;
            box-shadow: 0 2px 12px rgba(59, 130, 246, 0.2);
            position: relative;
            z-index: 1000;
            overflow: hidden;
            width: 100%;
            display: block !important;
            visibility: visible !important;
        }
        
        .dashboard-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.02"><circle cx="20" cy="20" r="0.5"/></g></svg>') repeat;
            pointer-events: none;
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            position: relative;
            z-index: 1;
        }
        
        .title-section {
            text-align: center;
            display: block !important;
            visibility: visible !important;
        }
        
        .dashboard-title {
            font-size: 1.875rem;
            font-weight: 700;
            margin: 0 0 0.75rem 0;
            color: white !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            line-height: 1.2;
            visibility: visible !important;
        }
        
        .dashboard-title i {
            font-size: 1.5rem;
            color: #bfdbfe;
            text-shadow: 0 0 15px rgba(191, 219, 254, 0.5);
        }
        
        .header-stats {
            display: flex !important;
            justify-content: center;
            gap: 0.75rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
            visibility: visible !important;
        }
        
        .stat-badge {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            display: flex !important;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.8rem;
            font-weight: 600;
            color: white !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            visibility: visible !important;
        }
        
        .stat-badge:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .stat-badge i {
            color: #bfdbfe;
            font-size: 0.85rem;
        }
        
        /* Enhanced Modal Styles */
        .enhanced-modal {
            max-width: 700px !important;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6b7280;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #ef4444;
        }
        
        .enhanced-form {
            padding: 0;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .form-label i {
            margin-right: 0.5rem;
            color: #3b82f6;
            width: 16px;
            text-align: center;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.875rem;
            transition: all 0.3s ease;
            background: white;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            background: #fefefe;
        }
        
        .form-input::placeholder {
            color: #9ca3af;
        }
        
        textarea.form-input {
            resize: vertical;
            min-height: 80px;
        }
        
        .form-hint {
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 0.25rem;
            line-height: 1.4;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
        }
        
        .btn-cancel {
            padding: 0.75rem 1.5rem;
            border: 2px solid #e5e7eb;
            background: white;
            color: #6b7280;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-cancel:hover {
            border-color: #d1d5db;
            background: #f9fafb;
        }
        
        .btn-save {
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        .btn-save:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
        
        .btn-save:active {
            transform: translateY(0);
        }
        
        /* Responsive adjustments for enhanced modal */
        @media (max-width: 768px) {
            .enhanced-modal {
                max-width: 95vw !important;
                margin: 1rem;
            }
            
            .form-row {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .form-actions {
                flex-direction: column-reverse;
            }
            
            .btn-cancel, .btn-save {
                width: 100%;
                justify-content: center;
            }
        }
        
        /* Responsive adjustments for compact header */
        @media (max-width: 768px) {
            .dashboard-title {
                font-size: 1.5rem;
                gap: 0.5rem;
            }
            
            .dashboard-title i {
                font-size: 1.25rem;
            }
            
            .stat-badge {
                font-size: 0.75rem;
                padding: 0.4rem 0.8rem;
                gap: 0.3rem;
            }
            
            .stat-badge i {
                font-size: 0.8rem;
            }
            
            .header-stats {
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Landing Page -->
    <div id="landingPage">
        <div class="hero-section">
            <div class="depflow-logo" style="color: #1e3a8a; justify-content: center;">
                <div class="logo-icon"></div>
                <div class="logo-text">
                    <div class="logo-brand" style="color: #1e3a8a;">DepFlow</div>
                    <div class="logo-subtitle" style="color: #3b82f6;">Dependency Management</div>
                </div>
            </div>
            <h2>Streamlined Software Lifecycle Management</h2>
            <p>Comprehensive dependency tracking, security monitoring, and team collaboration tools for modern software development.</p>
            
            <div class="hero-actions">
                <button class="btn-primary" onclick="openLoginModal()">
                    <i class="fas fa-sign-in-alt"></i>
                    Launch Application
                </button>
                <button class="btn-secondary" onclick="scrollToDemo()">
                    <i class="fas fa-key"></i>
                    View Demo Credentials
                </button>
            </div>
        </div>
        
        <!-- Demo Credentials -->
        <div id="demoCredentials" style="background: white; padding: 2rem; margin: 2rem auto; max-width: 800px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin-bottom: 1rem; text-align: center;">
                <i class="fas fa-key" style="color: #3b82f6; margin-right: 0.5rem;"></i>
                Demo Credentials
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h4 style="color: #1f2937; margin-bottom: 0.5rem;">👨‍💼 Admin User</h4>
                    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">Full access to all features</p>
                    <div style="font-family: monospace; background: white; padding: 0.75rem; border-radius: 4px; border: 1px solid #d1d5db;">
                        <div>Email: admin@demo.com</div>
                        <div>Password: admin123456</div>
                    </div>
                </div>
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h4 style="color: #1f2937; margin-bottom: 0.5rem;">👤 Team Member</h4>
                    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">Limited access to team features</p>
                    <div style="font-family: monospace; background: white; padding: 0.75rem; border-radius: 4px; border: 1px solid #d1d5db;">
                        <div>Email: user@demo.com</div>
                        <div>Password: user123456</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Dashboard Page -->
    <div id="dashboardPage" class="dashboard">
        <!-- Dashboard Header Title at Top -->
        <div class="dashboard-header">
            <div class="header-content">
                <div class="title-section">
                    <div class="depflow-logo">
                        <div class="logo-icon"></div>
                        <div class="logo-text">
                            <div class="logo-brand">DepFlow</div>
                            <div class="logo-subtitle">Enterprise Dependency Management</div>
                        </div>
                    </div>
                    <div class="header-stats">
                        <div class="stat-badge">
                            <i class="fas fa-shield-alt"></i>
                            <span>SOC 2 Compliant</span>
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-clock"></i>
                            <span>99.9% Uptime</span>
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-users"></i>
                            <span>Enterprise Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- User Panel (Top Right) -->
        <div id="userPanel" class="user-panel" style="display: none;">
            <div class="user-avatar" id="userAvatar">A</div>
            <div class="user-info">
                <div class="user-name" id="userName">Admin User</div>
                <div class="user-role" id="userRole">Admin</div>
            </div>
            <button class="btn-logout" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>
        
        <div class="dashboard-layout">
            <!-- Left Sidebar with Counters -->
            <div class="sidebar">
                <h3><i class="fas fa-chart-bar" style="margin-right: 0.5rem; color: #3b82f6;"></i>Dashboard Overview</h3>
                <div class="counter-grid">
                    <div class="counter-card" id="totalCountCard" onclick="filterByCounter('all')">
                        <div class="counter-value" id="totalCount" style="color: #3b82f6;">0</div>
                        <div class="counter-label">Total Dependencies</div>
                    </div>
                    <div class="counter-card" id="inProgressCountCard" onclick="filterByCounter('IN PROGRESS')">
                        <div class="counter-value" id="inProgressCount" style="color: #d97706;">0</div>
                        <div class="counter-label">In Progress</div>
                    </div>
                    <div class="counter-card" id="blockedCountCard" onclick="filterByCounter('BLOCKED')">
                        <div class="counter-value" id="blockedCount" style="color: #dc2626;">0</div>
                        <div class="counter-label">Blocked</div>
                    </div>
                    <div class="counter-card" id="doneCountCard" onclick="filterByCounter('COMPLETED')">
                        <div class="counter-value" id="doneCount" style="color: #15803d;">0</div>
                        <div class="counter-label">Completed</div>
                    </div>
                    <div class="counter-card" id="notStartedCountCard" onclick="filterByCounter('NOT STARTED')">
                        <div class="counter-value" id="notStartedCount" style="color: #6b7280;">0</div>
                        <div class="counter-label">Not Started</div>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="main-content">
                <div class="content-header">
                    <div class="depflow-logo compact">
                        <div class="logo-icon"></div>
                        <div class="logo-text">
                            <div class="logo-brand">DepFlow</div>
                            <div class="logo-subtitle">Dashboard</div>
                        </div>
                    </div>
                    <button class="btn-add" onclick="showAddModal()">
                        <i class="fas fa-plus"></i>
                        Add New Dependency
                    </button>
                </div>
                
                <!-- Search and Filter Panel -->
                <div class="search-filter-panel">
                    <div class="filter-controls">
                        <div class="search-group">
                            <div style="position: relative;">
                                <input type="text" id="searchInput" class="search-input" placeholder="Search dependencies..." onkeyup="applyFilters()">
                                <i class="fas fa-search search-icon"></i>
                            </div>
                        </div>
                        <select id="teamFilter" class="filter-select" onchange="applyFilters()">
                            <option value="">All Teams</option>
                            <option value="Quality flow">Quality flow</option>
                            <option value="Annotation tools">Annotation tools</option>
                            <option value="Data Collection">Data Collection</option>
                            <option value="ADAP Platform">ADAP Platform</option>
                            <option value="CrowdGen">CrowdGen</option>
                            <option value="Mercury">Mercury</option>
                            <option value="Marketing Cloud">Marketing Cloud</option>
                            <option value="Data Engineering">Data Engineering</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Product Management">Product Management</option>
                        </select>
                        <select id="statusFilter" class="filter-select" onchange="applyFilters()">
                            <option value="">All Status</option>
                            <option value="NOT STARTED">Not Started</option>
                            <option value="IN PROGRESS">In Progress</option>
                            <option value="BLOCKED">Blocked</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <select id="priorityFilter" class="filter-select" onchange="applyFilters()">
                            <option value="">All Priority</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                        <button class="btn-clear" onclick="clearFilters()">
                            <i class="fas fa-times"></i>
                            Clear
                        </button>
                    </div>
                </div>
                
                <!-- Dependencies Table -->
                <div class="dependency-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Dependency</th>
                                <th>Team</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="dependencyTableBody">
                            <!-- Dependencies will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Login Modal -->
    <div id="loginModal" class="login-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-sign-in-alt"></i> Enterprise Login</h3>
                <p>Access your dependency management platform</p>
            </div>
            
            <form class="login-form" onsubmit="performLogin(event)">
                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        class="form-input" 
                        placeholder="Enter your email address"
                        required
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        class="form-input" 
                        placeholder="Enter your password"
                        required
                    >
                </div>
                
                <div class="quick-login">
                    <button type="button" class="quick-btn" onclick="fillAdminCredentials()">
                        <i class="fas fa-user-shield"></i> Admin
                    </button>
                    <button type="button" class="quick-btn" onclick="fillUserCredentials()">
                        <i class="fas fa-user"></i> Team Member
                    </button>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="closeLoginModal()">Cancel</button>
                    <button type="submit" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Enhanced Add/Edit Modal -->
    <div id="addEditModal" class="login-modal" onclick="closeModalOnOutsideClick(event)">
        <div class="modal-content enhanced-modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3 id="modalTitle"><i class="fas fa-plus"></i> Add New Dependency</h3>
                <p id="modalSubtitle">Enter all dependency details below</p>
                <button type="button" class="modal-close" onclick="closeAddEditModal()">&times;</button>
            </div>
            
            <form id="dependencyForm" onsubmit="saveDependency(event)" class="enhanced-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-cube"></i> Dependency Name *</label>
                        <input type="text" id="depName" class="form-input" required placeholder="e.g., React, Express, MongoDB">
                        <div class="form-hint">Enter the technology or library name</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-users"></i> Team *</label>
                        <select id="depTeam" class="form-input" required>
                            <option value="">Select Responsible Team</option>
                            <option value="Quality flow">Quality flow</option>
                            <option value="Annotation tools">Annotation tools</option>
                            <option value="Data Collection">Data Collection</option>
                            <option value="ADAP Platform">ADAP Platform</option>
                            <option value="CrowdGen">CrowdGen</option>
                            <option value="Mercury">Mercury</option>
                            <option value="Marketing Cloud">Marketing Cloud</option>
                            <option value="Data Engineering">Data Engineering</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Product Management">Product Management</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-info-circle"></i> Description *</label>
                    <textarea id="depDescription" class="form-input" required rows="3" placeholder="Describe what this dependency is used for and its importance"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-tasks"></i> Status *</label>
                        <select id="depStatus" class="form-input" required>
                            <option value="NOT STARTED">🔴 Not Started</option>
                            <option value="IN PROGRESS">🟡 In Progress</option>
                            <option value="BLOCKED">🔴 Blocked</option>
                            <option value="COMPLETED">🟢 Completed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-exclamation-triangle"></i> Priority *</label>
                        <select id="depPriority" class="form-input" required>
                            <option value="HIGH">🔴 High Priority</option>
                            <option value="MEDIUM">🟡 Medium Priority</option>
                            <option value="LOW">🟢 Low Priority</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-shield-alt"></i> Risk Level *</label>
                        <select id="depRisk" class="form-input" required>
                            <option value="HIGH">🔴 High Risk</option>
                            <option value="MEDIUM">🟡 Medium Risk</option>
                            <option value="LOW">🟢 Low Risk</option>
                        </select>
                        <div class="form-hint">Assess the potential impact if this dependency fails</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-ticket-alt"></i> Jira Ticket</label>
                        <input type="text" id="depJira" class="form-input" placeholder="e.g., PROJ-1234">
                        <div class="form-hint">Optional: Link to relevant Jira ticket</div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeAddEditModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" class="btn-save">
                        <i class="fas fa-save"></i> <span id="saveButtonText">Save Dependency</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Notification -->
    <div id="notification" class="notification">
        <div id="notificationMessage"></div>
    </div>

    <script>
        console.log('🚀 COMPLETE DEPENDENCY MANAGEMENT SYSTEM STARTING...');
        
        // Global variables
        let currentUser = null;
        let editingId = null;
        let dependencies = [];
        let activeCounterFilter = null; // Track active counter filter
        
        // Helper function to get formatted timestamp
        function getFormattedTimestamp() {
            var now = new Date();
            var today = new Date();
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            // If it's today, show "X minutes ago" or "X hours ago"
            if (now.toDateString() === today.toDateString()) {
                var minutes = Math.floor((now - today.setHours(0, 0, 0, 0)) / 60000);
                var hours = Math.floor(minutes / 60);
                
                if (minutes < 1) return 'Just now';
                else if (minutes < 60) return minutes + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
                else return hours + ' hour' + (hours === 1 ? '' : 's') + ' ago';
            }
            // If it's yesterday, show "Yesterday"
            else if (now.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
            }
            // Otherwise show "X days ago"
            else {
                var daysDiff = Math.floor((now - yesterday) / (24 * 60 * 60 * 1000));
                return daysDiff + ' day' + (daysDiff === 1 ? '' : 's') + ' ago';
            }
        }
        
        // Function to convert ISO timestamp to human-readable format
        function formatISOTimestamp(isoString) {
            if (!isoString) return 'Unknown';
            
            // If it's already a human-readable format (not ISO), return as-is
            if (!isoString.includes('T') && !isoString.includes('Z')) {
                return isoString;
            }
            
            var now = new Date();
            var timestamp = new Date(isoString);
            var diffMs = now - timestamp;
            var diffMinutes = Math.floor(diffMs / 60000);
            var diffHours = Math.floor(diffMinutes / 60);
            var diffDays = Math.floor(diffHours / 24);
            
            if (diffMinutes < 1) return 'Just now';
            else if (diffMinutes < 60) return diffMinutes + ' minute' + (diffMinutes === 1 ? '' : 's') + ' ago';
            else if (diffHours < 24) return diffHours + ' hour' + (diffHours === 1 ? '' : 's') + ' ago';
            else if (diffDays === 1) return 'Yesterday';
            else if (diffDays < 7) return diffDays + ' day' + (diffDays === 1 ? '' : 's') + ' ago';
            else if (diffDays < 30) return Math.floor(diffDays / 7) + ' week' + (Math.floor(diffDays / 7) === 1 ? '' : 's') + ' ago';
            else return Math.floor(diffDays / 30) + ' month' + (Math.floor(diffDays / 30) === 1 ? '' : 's') + ' ago';
        }
        
        // Core modal functions (from working version)
        function openLoginModal() {
            console.log('✅ LAUNCH APPLICATION CLICKED!');
            var modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                console.log('✅ Login modal opened!');
                
                var email = document.getElementById('email');
                if (email) email.focus();
            } else {
                console.error('Modal not found!');
                alert('Please refresh the page');
            }
        }
        
        function closeLoginModal() {
            console.log('Closing login modal...');
            var modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
        
        function fillAdminCredentials() {
            document.getElementById('email').value = 'admin@demo.com';
            document.getElementById('password').value = 'admin123456';
        }
        
        function fillUserCredentials() {
            document.getElementById('email').value = 'user@demo.com';
            document.getElementById('password').value = 'user123456';
        }
        
        function scrollToDemo() {
            var demo = document.getElementById('demoCredentials');
            if (demo) {
                demo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        function performLogin(event) {
            event.preventDefault();
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            
            var validCredentials = [
                { email: 'admin@demo.com', password: 'admin123456', name: 'Admin User', role: 'admin' },
                { email: 'user@demo.com', password: 'user123456', name: 'Team Member', role: 'user' }
            ];
            
            var user = validCredentials.find(function(cred) {
                return cred.email === email && cred.password === password;
            });
            
            if (user) {
                console.log('✅ Login successful for:', user.name);
                localStorage.setItem('authToken', 'demo-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify(user));
                closeLoginModal();
                showDashboard(user);
            } else {
                showNotification('Invalid credentials. Please use the demo credentials provided.', 'error');
            }
        }
        
        function showDashboard(user) {
            console.log('🏠 Showing dashboard for:', user.name);
            console.log('👤 User object:', user);
            currentUser = user;
            console.log('✅ Current user set to:', currentUser);
            
            document.getElementById('landingPage').style.display = 'none';
            var dashboard = document.getElementById('dashboardPage');
            dashboard.classList.add('active');
            
            var userPanel = document.getElementById('userPanel');
            var userAvatar = document.getElementById('userAvatar');
            var userName = document.getElementById('userName');
            var userRole = document.getElementById('userRole');
            
            userAvatar.textContent = user.name.charAt(0).toUpperCase();
            userName.textContent = user.name;
            userRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' User';
            userPanel.style.display = 'flex';
            
            loadDependencies();
            updateCounters();
            console.log('✅ Dashboard displayed successfully!');
            console.log('🔍 Final check - Dependencies loaded:', dependencies ? dependencies.length : 'UNDEFINED');
        }
        
        function logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            location.reload();
        }
        
        function checkExistingLogin() {
            var token = localStorage.getItem('authToken');
            var userStr = localStorage.getItem('user');
            
            if (token && userStr) {
                try {
                    var user = JSON.parse(userStr);
                    showDashboard(user);
                } catch (error) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }
        }
        
        // Notification system
        function showNotification(message, type) {
            var notification = document.getElementById('notification');
            var messageDiv = document.getElementById('notificationMessage');
            
            messageDiv.textContent = message;
            notification.className = 'notification ' + (type || 'success');
            notification.style.display = 'block';
            
            setTimeout(function() {
                notification.style.display = 'none';
            }, 3000);
        }
        
        // Default dependencies
        function getDefaultDependencies() {
            return [
                { id: 1, name: 'React', description: 'Frontend JavaScript library for UI components', team: 'Annotation tools', status: 'IN PROGRESS', priority: 'HIGH', lastUpdated: '2 days ago', createdBy: 'admin@demo.com' },
                { id: 2, name: 'Express.js', description: 'Backend Node.js framework for APIs', team: 'ADAP Platform', status: 'COMPLETED', priority: 'MEDIUM', lastUpdated: '1 week ago', createdBy: 'admin@demo.com' },
                { id: 3, name: 'MongoDB', description: 'NoSQL database for data storage', team: 'Data Engineering', status: 'BLOCKED', priority: 'HIGH', lastUpdated: '3 days ago', createdBy: 'admin@demo.com' },
                { id: 4, name: 'Jest', description: 'JavaScript testing framework for quality assurance', team: 'Quality flow', status: 'NOT STARTED', priority: 'LOW', lastUpdated: '1 day ago', createdBy: 'user@demo.com' },
                { id: 5, name: 'Docker', description: 'Containerization platform for deployment', team: 'ADAP Platform', status: 'IN PROGRESS', priority: 'MEDIUM', lastUpdated: '4 days ago', createdBy: 'admin@demo.com' },
                { id: 6, name: 'CrowdGen API', description: 'API integration for crowd-sourced data generation', team: 'CrowdGen', status: 'IN PROGRESS', priority: 'HIGH', lastUpdated: '3 hours ago', createdBy: 'admin@demo.com' },
                { id: 7, name: 'Mercury Analytics', description: 'Real-time analytics and reporting dashboard', team: 'Analytics', status: 'NOT STARTED', priority: 'MEDIUM', lastUpdated: '5 days ago', createdBy: 'admin@demo.com' },
                { id: 8, name: 'Marketing Cloud Integration', description: 'Integration with Salesforce Marketing Cloud', team: 'Marketing Cloud', status: 'BLOCKED', priority: 'HIGH', lastUpdated: '1 week ago', createdBy: 'admin@demo.com' }
            ];
        }
        
        // Load dependencies with debugging
        function loadDependencies() {
            console.log('📦 Loading dependencies...');
            var stored = localStorage.getItem('dependencies');
            if (stored) {
                console.log('📂 Found stored dependencies in localStorage');
                dependencies = JSON.parse(stored);
                console.log('✅ Loaded', dependencies.length, 'dependencies from storage');
            } else {
                console.log('🎯 No stored dependencies, creating defaults');
                dependencies = getDefaultDependencies();
                console.log('✅ Created', dependencies.length, 'default dependencies');
                saveDependencies();
            }
            console.log('📋 Dependencies array:', dependencies);
            console.log('🔢 Dependency IDs:', dependencies.map(d => d.id));
            renderDependencies();
        }
        
        // Save dependencies
        function saveDependencies() {
            localStorage.setItem('dependencies', JSON.stringify(dependencies));
        }
        
        // Render dependencies table with debugging
        function renderDependencies() {
            console.log('🎨 Rendering dependencies table...');
            console.log('📊 Dependencies to render:', dependencies.length);
            
            var tbody = document.getElementById('dependencyTableBody');
            if (!tbody) {
                console.error('❌ Table body element not found!');
                return;
            }
            tbody.innerHTML = '';
            
            dependencies.forEach(function(dep, index) {
                console.log('🔹 Rendering dependency', index + 1, '- ID:', dep.id, 'Name:', dep.name);
                
                var canEdit = canEditDependency(dep.createdBy);
                var canDelete = canDeleteDependency(dep.createdBy);
                
                console.log('🔐 Permissions for', dep.name, '- Edit:', canEdit, 'Delete:', canDelete);
                
                var row = document.createElement('tr');
                row.setAttribute('data-dependency-id', dep.id);
                row.innerHTML = 
                    '<td><div class="dependency-name">' + dep.name + '</div><div class="dependency-desc">' + dep.description + '</div></td>' +
                    '<td>' + dep.team + '</td>' +
                    '<td><select class="status-select status-' + dep.status.toLowerCase().replace(' ', '-') + '" onchange="updateStatus(' + dep.id + ', this.value)">' +
                        '<option value="NOT STARTED"' + (dep.status === 'NOT STARTED' ? ' selected' : '') + '>Not Started</option>' +
                        '<option value="IN PROGRESS"' + (dep.status === 'IN PROGRESS' ? ' selected' : '') + '>In Progress</option>' +
                        '<option value="BLOCKED"' + (dep.status === 'BLOCKED' ? ' selected' : '') + '>Blocked</option>' +
                        '<option value="COMPLETED"' + (dep.status === 'COMPLETED' ? ' selected' : '') + '>Completed</option>' +
                    '</select></td>' +
                    '<td><select class="priority-select priority-' + dep.priority.toLowerCase() + '" onchange="updatePriority(' + dep.id + ', this.value)">' +
                        '<option value="HIGH"' + (dep.priority === 'HIGH' ? ' selected' : '') + '>High</option>' +
                        '<option value="MEDIUM"' + (dep.priority === 'MEDIUM' ? ' selected' : '') + '>Medium</option>' +
                        '<option value="LOW"' + (dep.priority === 'LOW' ? ' selected' : '') + '>Low</option>' +
                    '</select></td>' +
                    '<td>' + formatISOTimestamp(dep.lastUpdated) + '</td>' +
                    '<td>' +
                        '<button class="btn-edit" onclick="editDependency(' + dep.id + ')" ' + (canEdit ? '' : 'disabled') + '>✏️ Edit</button>' +
                        '<button class="btn-delete" onclick="deleteDependency(' + dep.id + ')" ' + (canDelete ? '' : 'disabled') + '>🗑️ Delete</button>' +
                    '</td>';
                
                console.log('✅ Created edit button with onclick="editDependency(' + dep.id + ')"');
                console.log('✅ Created delete button with onclick="deleteDependency(' + dep.id + ')"');
                tbody.appendChild(row);
            });
            
            console.log('🎯 Table rendered successfully with', dependencies.length, 'rows');
            updateCounters();
        }
        
        // RBAC functions with debugging
        function canEditDependency(createdBy) {
            console.log('🔐 RBAC Check - canEditDependency');
            console.log('Current user:', currentUser);
            console.log('Dependency created by:', createdBy);
            
            if (!currentUser) {
                console.log('❌ No current user - permission denied');
                return false;
            }
            
            var isAdmin = currentUser.role === 'admin';
            var isOwner = createdBy === currentUser.email;
            var canEdit = isAdmin || isOwner;
            
            console.log('Is admin?', isAdmin);
            console.log('Is owner?', isOwner);
            console.log('Final permission:', canEdit);
            
            return canEdit;
        }
        
        function canDeleteDependency(createdBy) {
            console.log('🔐 RBAC Check - canDeleteDependency');
            console.log('Current user:', currentUser);
            console.log('Dependency created by:', createdBy);
            
            if (!currentUser) {
                console.log('❌ No current user - delete permission denied');
                return false;
            }
            
            var isAdmin = currentUser.role === 'admin';
            var isOwner = createdBy === currentUser.email;
            var canDelete = isAdmin || isOwner;
            
            console.log('Is admin?', isAdmin);
            console.log('Is owner?', isOwner);
            console.log('Final delete permission:', canDelete);
            
            return canDelete;
        }
        
        // Update counters with all status types (always uses full dataset)
        function updateCounters() {
            console.log('📊 Updating counters from full dataset...');
            
            // Count from dependencies array (full dataset), not from visible rows
            var total = dependencies.length;
            var inProgress = 0, blocked = 0, done = 0, notStarted = 0;
            
            dependencies.forEach(function(dep) {
                var status = dep.status;
                console.log('🔍 Dependency status:', status);
                if (status === 'IN PROGRESS') inProgress++;
                else if (status === 'BLOCKED') blocked++;
                else if (status === 'COMPLETED') done++;
                else if (status === 'NOT STARTED') notStarted++;
            });
            
            console.log('📈 Counter results (from full dataset):', {
                total: total,
                inProgress: inProgress,
                blocked: blocked,
                done: done,
                notStarted: notStarted
            });
            
            // Update all counter displays
            document.getElementById('totalCount').textContent = total;
            document.getElementById('inProgressCount').textContent = inProgress;
            document.getElementById('blockedCount').textContent = blocked;
            document.getElementById('doneCount').textContent = done;
            document.getElementById('notStartedCount').textContent = notStarted;
        }
        
        // Update status
        function updateStatus(id, newStatus) {
            console.log('🔄 Updating status for dependency', id, 'to', newStatus);
            var dep = dependencies.find(function(d) { return d.id === id; });
            if (dep && canEditDependency(dep.createdBy)) {
                dep.status = newStatus;
                dep.lastUpdated = getFormattedTimestamp();
                console.log('✅ Status updated, new timestamp:', dep.lastUpdated);
                saveDependencies();
                renderDependencies();
                showNotification('Status updated successfully');
            } else {
                showNotification('You can only edit dependencies you created', 'error');
                renderDependencies();
            }
        }
        
        // Update priority
        function updatePriority(id, newPriority) {
            console.log('🔄 Updating priority for dependency', id, 'to', newPriority);
            var dep = dependencies.find(function(d) { return d.id === id; });
            if (dep && canEditDependency(dep.createdBy)) {
                dep.priority = newPriority;
                dep.lastUpdated = getFormattedTimestamp();
                console.log('✅ Priority updated, new timestamp:', dep.lastUpdated);
                saveDependencies();
                renderDependencies();
                showNotification('Priority updated successfully');
            } else {
                showNotification('You can only edit dependencies you created', 'error');
                renderDependencies();
            }
        }
        
        // Show add modal
        function showAddModal() {
            editingId = null;
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus"></i> Add New Dependency';
            document.getElementById('modalSubtitle').textContent = 'Enter all dependency details below';
            document.getElementById('saveButtonText').textContent = 'Add Dependency';
            document.getElementById('dependencyForm').reset();
            document.getElementById('addEditModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            setTimeout(function() {
                document.getElementById('depName').focus();
            }, 100);
        }
        
        // Edit dependency with enhanced debugging
        function editDependency(id) {
            console.log('🔍 Edit function called for ID:', id, '(type:', typeof id, ')');
            console.log('👤 Current user:', currentUser);
            console.log('📋 Dependencies array length:', dependencies ? dependencies.length : 'UNDEFINED');
            
            // Convert ID to number if it's a string (common issue)
            var numericId = typeof id === 'string' ? parseInt(id, 10) : id;
            console.log('🔢 Looking for numeric ID:', numericId);
            
            var dep = dependencies.find(function(d) { 
                console.log('🔍 Checking dependency ID:', d.id, '(type:', typeof d.id, ') against target:', numericId);
                return d.id == numericId; // Use == for type-flexible comparison
            });
            console.log('📦 Found dependency:', dep);
            
            if (!dep) {
                console.error('❌ Dependency not found for ID:', id);
                showNotification('Dependency not found', 'error');
                return;
            }
            
            if (!currentUser) {
                console.error('❌ No current user logged in');
                showNotification('Please log in to edit dependencies', 'error');
                return;
            }
            
            console.log('🔒 Checking edit permissions...');
            console.log('User role:', currentUser.role);
            console.log('User email:', currentUser.email);
            console.log('Dependency created by:', dep.createdBy);
            
            var canEdit = canEditDependency(dep.createdBy);
            console.log('✅ Can edit?', canEdit);
            
            if (!canEdit) {
                var message = currentUser.role === 'admin' 
                    ? 'Admin should be able to edit all dependencies' 
                    : 'You can only edit dependencies you created';
                console.error('❌ Edit permission denied:', message);
                showNotification(message, 'error');
                return;
            }
            
            console.log('✅ Edit permission granted, opening modal...');
            
            try {
                editingId = id;
                document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Dependency';
                document.getElementById('modalSubtitle').textContent = 'Update the dependency information below';
                document.getElementById('saveButtonText').textContent = 'Update Dependency';
                
                // Populate all fields with null checks
                var nameField = document.getElementById('depName');
                var descField = document.getElementById('depDescription');
                var teamField = document.getElementById('depTeam');
                var statusField = document.getElementById('depStatus');
                var priorityField = document.getElementById('depPriority');
                var riskField = document.getElementById('depRisk');
                var jiraField = document.getElementById('depJira');
                
                if (!nameField || !descField || !teamField || !statusField || !priorityField) {
                    console.error('❌ Modal fields not found in DOM');
                    showNotification('Modal form not loaded properly. Please refresh the page.', 'error');
                    return;
                }
                
                nameField.value = dep.name || '';
                descField.value = dep.description || '';
                teamField.value = dep.team || '';
                statusField.value = dep.status || 'NOT STARTED';
                priorityField.value = dep.priority || 'MEDIUM';
                if (riskField) riskField.value = dep.riskLevel || dep.risk || 'MEDIUM';
                if (jiraField) jiraField.value = dep.jiraTicket || dep.jira || '';
                
                console.log('📝 Form fields populated:', {
                    name: nameField.value,
                    description: descField.value,
                    team: teamField.value,
                    status: statusField.value,
                    priority: priorityField.value,
                    risk: riskField ? riskField.value : 'N/A',
                    jira: jiraField ? jiraField.value : 'N/A'
                });
                
                var modal = document.getElementById('addEditModal');
                if (!modal) {
                    console.error('❌ Modal element not found');
                    showNotification('Modal not found. Please refresh the page.', 'error');
                    return;
                }
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                console.log('✅ Modal opened successfully');
                
                // Focus on name field
                setTimeout(function() {
                    if (nameField) {
                        nameField.focus();
                        console.log('✅ Focus set on name field');
                    }
                }, 100);
                
            } catch (error) {
                console.error('❌ Error in editDependency:', error);
                showNotification('Error opening edit modal: ' + error.message, 'error');
            }
        }
        
        // Close add/edit modal
        function closeAddEditModal() {
            document.getElementById('addEditModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            editingId = null;
        }
        
        // Close modal when clicking outside
        function closeModalOnOutsideClick(event) {
            if (event.target.id === 'addEditModal') {
                closeAddEditModal();
            }
        }
        
        // Save dependency with enhanced validation
        function saveDependency(event) {
            event.preventDefault();
            
            var name = document.getElementById('depName').value.trim();
            var description = document.getElementById('depDescription').value.trim();
            var team = document.getElementById('depTeam').value;
            var status = document.getElementById('depStatus').value;
            var priority = document.getElementById('depPriority').value;
            var riskLevel = document.getElementById('depRisk').value;
            var jiraTicket = document.getElementById('depJira').value.trim();
            
            // Enhanced validation
            if (!name || name.length < 2) {
                showNotification('Dependency name must be at least 2 characters long', 'error');
                document.getElementById('depName').focus();
                return;
            }
            
            if (!description || description.length < 10) {
                showNotification('Description must be at least 10 characters long', 'error');
                document.getElementById('depDescription').focus();
                return;
            }
            
            if (!team) {
                showNotification('Please select a responsible team', 'error');
                document.getElementById('depTeam').focus();
                return;
            }
            
            // Disable save button during processing
            var saveButton = document.querySelector('.btn-save');
            var originalText = document.getElementById('saveButtonText').textContent;
            saveButton.disabled = true;
            document.getElementById('saveButtonText').textContent = 'Saving...';
            
            setTimeout(async function() {
                try {
                    if (editingId) {
                        // Update existing dependency
                        var dep = dependencies.find(function(d) { return d.id === editingId; });
                        if (dep) {
                            var originalTeam = dep.team;
                            
                            // Make API call to update dependency
                            const response = await fetch('/api/dependencies/' + editingId, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    name: name,
                                    description: description,
                                    team: team,
                                    status: status,
                                    priority: priority,
                                    riskLevel: riskLevel,
                                    jiraTicket: jiraTicket,
                                    originalTeam: originalTeam
                                })
                            });
                            
                            const result = await response.json();
                            
                            if (result.success) {
                                // Update local data
                                dep.name = name;
                                dep.description = description;
                                dep.team = team;
                                dep.status = status;
                                dep.priority = priority;
                                dep.riskLevel = riskLevel;
                                dep.jiraTicket = jiraTicket;
                                dep.lastUpdated = formatISOTimestamp(result.dependency.lastUpdated);
                                console.log('✅ Dependency updated via API');
                                
                                var successMessage = '✅ Dependency updated successfully!';
                                if (result.emailSent) {
                                    successMessage += ' 📧 Email notification sent to team owner.';
                                }
                                showNotification(successMessage);
                            } else {
                                showNotification('❌ Failed to update dependency: ' + result.message, 'error');
                                return;
                            }
                        }
                    } else {
                        // Create new dependency
                        const response = await fetch('/api/dependencies', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: name,
                                description: description,
                                team: team,
                                status: status,
                                priority: priority,
                                riskLevel: riskLevel,
                                jiraTicket: jiraTicket,
                                createdBy: currentUser.email
                            })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            // Add to local data with generated ID
                            var newId = Math.max(...dependencies.map(d => d.id), 0) + 1;
                            var newDependency = {
                                id: newId,
                                name: name,
                                description: description,
                                team: team,
                                status: status,
                                priority: priority,
                                riskLevel: riskLevel,
                                jiraTicket: jiraTicket,
                                lastUpdated: formatISOTimestamp(result.dependency.lastUpdated),
                                createdBy: currentUser.email
                            };
                            dependencies.push(newDependency);
                            console.log('✅ New dependency created via API');
                            
                            var successMessage = '✅ New dependency added successfully!';
                            if (result.emailSent) {
                                successMessage += ' 📧 Email notification sent to team owner.';
                            }
                            showNotification(successMessage);
                        } else {
                            showNotification('❌ Failed to create dependency: ' + result.message, 'error');
                            return;
                        }
                    }
                } catch (error) {
                    console.error('❌ API call failed:', error);
                    showNotification('❌ Failed to save dependency: ' + error.message, 'error');
                    return;
                }
                
                saveDependencies();
                renderDependencies();
                updateCounters();
                closeAddEditModal();
                
                // Re-enable button
                saveButton.disabled = false;
                document.getElementById('saveButtonText').textContent = originalText;
            }, 500);
        }
        
        // Delete dependency with enhanced debugging
        function deleteDependency(id) {
            console.log('🗑️ Delete function called for ID:', id, '(type:', typeof id, ')');
            console.log('👤 Current user:', currentUser);
            console.log('📋 Dependencies array length:', dependencies ? dependencies.length : 'UNDEFINED');
            
            // Convert ID to number if it's a string (common issue)
            var numericId = typeof id === 'string' ? parseInt(id, 10) : id;
            console.log('🔢 Looking for numeric ID:', numericId);
            
            var dep = dependencies.find(function(d) { 
                console.log('🔍 Checking dependency ID:', d.id, '(type:', typeof d.id, ') against target:', numericId);
                return d.id == numericId; // Use == for type-flexible comparison
            });
            console.log('📦 Found dependency:', dep);
            
            if (!dep) {
                console.error('❌ Dependency not found for ID:', id);
                showNotification('Dependency not found', 'error');
                return;
            }
            
            if (!currentUser) {
                console.error('❌ No current user logged in');
                showNotification('Please log in to delete dependencies', 'error');
                return;
            }
            
            console.log('🔒 Checking delete permissions...');
            console.log('User role:', currentUser.role);
            console.log('User email:', currentUser.email);
            console.log('Dependency created by:', dep.createdBy);
            
            var canDelete = canDeleteDependency(dep.createdBy);
            console.log('✅ Can delete?', canDelete);
            
            if (!canDelete) {
                var message = currentUser.role === 'admin' 
                    ? 'Admin should be able to delete all dependencies' 
                    : 'You can only delete dependencies you created';
                console.error('❌ Delete permission denied:', message);
                showNotification(message, 'error');
                return;
            }
            
            console.log('✅ Delete permission granted, showing confirmation...');
            
            if (confirm('Are you sure you want to delete "' + dep.name + '"?')) {
                console.log('🗑️ User confirmed deletion, proceeding...');
                try {
                    var originalLength = dependencies.length;
                    console.log('🔍 Original dependencies before filter:', dependencies.map(d => ({id: d.id, name: d.name, type: typeof d.id})));
                    console.log('🎯 Target ID for deletion:', numericId, '(type:', typeof numericId, ')');
                    
                    // More robust filtering with detailed logging
                    var filteredDependencies = dependencies.filter(function(d) { 
                        var keep = d.id !== numericId;
                        console.log('🔍 Dependency', d.id, '(' + d.name + ') - Keep:', keep);
                        return keep;
                    });
                    
                    dependencies = filteredDependencies;
                    var newLength = dependencies.length;
                    
                    console.log('📊 Dependencies count: before =', originalLength, ', after =', newLength);
                    console.log('🔍 Remaining dependencies after filter:', dependencies.map(d => ({id: d.id, name: d.name})));
                    
                    if (newLength === originalLength) {
                        console.error('❌ No dependency was removed from array');
                        console.error('❌ This suggests ID mismatch or filter failure');
                        
                        // Try alternative approaches
                        console.log('🔄 Attempting string comparison fallback...');
                        var stringFilteredDeps = dependencies.filter(function(d) { 
                            return d.id.toString() !== numericId.toString();
                        });
                        
                        if (stringFilteredDeps.length < originalLength) {
                            console.log('✅ String comparison worked!');
                            dependencies = stringFilteredDeps;
                            newLength = dependencies.length;
                        } else {
                            console.error('❌ String comparison also failed');
                            showNotification('Error: Could not delete dependency (ID mismatch)', 'error');
                            return;
                        }
                    }
                    
                    console.log('💾 Saving dependencies to localStorage...');
                    saveDependencies();
                    
                    console.log('🎨 Re-rendering table...');
                    renderDependencies();
                    
                    console.log('📊 Updating counters...');
                    updateCounters();
                    
                    console.log('✅ Dependency deleted successfully');
                    showNotification('✅ Dependency "' + dep.name + '" deleted successfully');
                    
                    // Also remove the DOM element directly as backup
                    console.log('🎯 Removing DOM element as backup...');
                    var domRow = document.querySelector('tr[data-dependency-id="' + numericId + '"]');
                    if (domRow) {
                        console.log('✅ Found DOM row, removing it directly');
                        domRow.remove();
                    } else {
                        console.log('ℹ️ DOM row not found (may have been removed by re-render)');
                    }
                    
                    // Verify deletion worked
                    setTimeout(function() {
                        console.log('🔍 Post-deletion verification...');
                        
                        // Check array
                        var stillExists = dependencies.find(function(d) { return d.id === numericId; });
                        if (stillExists) {
                            console.error('❌ WARNING: Dependency still exists in array after deletion!');
                            showNotification('Warning: Dependency may not have been fully removed from data', 'error');
                        } else {
                            console.log('✅ Verified: Dependency successfully removed from array');
                        }
                        
                        // Check DOM
                        var domRowStillExists = document.querySelector('tr[data-dependency-id="' + numericId + '"]');
                        if (domRowStillExists) {
                            console.error('❌ WARNING: DOM row still exists after deletion!');
                            console.log('🔧 Force removing DOM row...');
                            domRowStillExists.remove();
                        } else {
                            console.log('✅ Verified: DOM row successfully removed');
                        }
                        
                        // Check localStorage
                        var storedDeps = JSON.parse(localStorage.getItem('dependencies') || '[]');
                        var stillInStorage = storedDeps.find(function(d) { return d.id === numericId; });
                        if (stillInStorage) {
                            console.error('❌ WARNING: Dependency still exists in localStorage!');
                            showNotification('Warning: Dependency may not have been fully removed from storage', 'error');
                        } else {
                            console.log('✅ Verified: Dependency successfully removed from localStorage');
                        }
                        
                        console.log('🎯 Final verification complete');
                    }, 100);
                    
                } catch (error) {
                    console.error('❌ Error during deletion:', error);
                    console.error('❌ Stack trace:', error.stack);
                    showNotification('Error deleting dependency: ' + error.message, 'error');
                }
            } else {
                console.log('ℹ️ User cancelled deletion');
            }
        }
        
        // Counter filtering function
        function filterByCounter(counterType) {
            console.log('🔍 Counter filter clicked:', counterType);
            
            // Remove active class from all counter cards
            document.querySelectorAll('.counter-card').forEach(function(card) {
                card.classList.remove('active');
            });
            
            // Handle counter filtering
            if (activeCounterFilter === counterType) {
                // If clicking the same counter, clear the filter
                activeCounterFilter = null;
                console.log('🔄 Cleared counter filter');
            } else {
                // Set new counter filter
                activeCounterFilter = counterType;
                
                // Add active class to clicked counter
                var cardId = '';
                switch(counterType) {
                    case 'all': cardId = 'totalCountCard'; break;
                    case 'IN PROGRESS': cardId = 'inProgressCountCard'; break;
                    case 'BLOCKED': cardId = 'blockedCountCard'; break;
                    case 'COMPLETED': cardId = 'doneCountCard'; break;
                    case 'NOT STARTED': cardId = 'notStartedCountCard'; break;
                }
                
                if (cardId) {
                    document.getElementById(cardId).classList.add('active');
                }
                
                console.log('✅ Set counter filter to:', counterType);
            }
            
            // Apply all filters including the counter filter
            applyFilters();
        }
        
        // Filtering functions
        function applyFilters() {
            var searchTerm = document.getElementById('searchInput').value.toLowerCase();
            var teamFilter = document.getElementById('teamFilter').value;
            var statusFilter = document.getElementById('statusFilter').value;
            var priorityFilter = document.getElementById('priorityFilter').value;
            
            var rows = document.querySelectorAll('#dependencyTableBody tr');
            
            rows.forEach(function(row) {
                var name = row.querySelector('.dependency-name').textContent.toLowerCase();
                var desc = row.querySelector('.dependency-desc').textContent.toLowerCase();
                var team = row.cells[1].textContent;
                var status = row.querySelector('.status-select').value;
                var priority = row.querySelector('.priority-select').value;
                
                var matchesSearch = searchTerm === '' || name.includes(searchTerm) || desc.includes(searchTerm);
                var matchesTeam = teamFilter === '' || team === teamFilter;
                var matchesStatus = statusFilter === '' || status === statusFilter;
                var matchesPriority = priorityFilter === '' || priority === priorityFilter;
                
                // Add counter filter logic
                var matchesCounter = true;
                if (activeCounterFilter && activeCounterFilter !== 'all') {
                    matchesCounter = status === activeCounterFilter;
                }
                
                if (matchesSearch && matchesTeam && matchesStatus && matchesPriority && matchesCounter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateCounters();
        }
        
        // Clear filters
        function clearFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('teamFilter').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('priorityFilter').value = '';
            
            // Clear counter filter
            activeCounterFilter = null;
            document.querySelectorAll('.counter-card').forEach(function(card) {
                card.classList.remove('active');
            });
            
            var rows = document.querySelectorAll('#dependencyTableBody tr');
            rows.forEach(function(row) {
                row.style.display = '';
            });
            
            updateCounters();
        }
        
        // Make all functions globally available
        window.openLoginModal = openLoginModal;
        window.closeLoginModal = closeLoginModal;
        window.fillAdminCredentials = fillAdminCredentials;
        window.fillUserCredentials = fillUserCredentials;
        window.scrollToDemo = scrollToDemo;
        window.performLogin = performLogin;
        window.showDashboard = showDashboard;
        window.logout = logout;
        window.checkExistingLogin = checkExistingLogin;
        window.showNotification = showNotification;
        window.updateStatus = updateStatus;
        window.updatePriority = updatePriority;
        window.showAddModal = showAddModal;
        window.editDependency = editDependency;
        window.closeAddEditModal = closeAddEditModal;
        window.closeModalOnOutsideClick = closeModalOnOutsideClick;
        window.saveDependency = saveDependency;
        window.deleteDependency = deleteDependency;
        window.applyFilters = applyFilters;
        window.clearFilters = clearFilters;
        window.filterByCounter = filterByCounter;
        
        // Quick test functions
        window.testEdit = function(id) {
            console.log('🧪 Testing edit function with ID:', id || 1);
            editDependency(id || 1);
        };
        
        window.testDelete = function(id) {
            console.log('🧪 Testing delete function with ID:', id || 1);
            deleteDependency(id || 1);
        };
        
        // Debug function for admin troubleshooting
        window.debugAdminIssues = function() {
            console.log('🔍 ADMIN ISSUES DEBUG REPORT');
            console.log('============================');
            console.log('👤 Current User:', currentUser);
            console.log('📦 Dependencies Array Length:', dependencies ? dependencies.length : 'UNDEFINED');
            console.log('📦 Dependencies Array:', dependencies);
            
            if (dependencies && dependencies.length > 0) {
                console.log('🔢 Dependency IDs:', dependencies.map(d => ({id: d.id, name: d.name, type: typeof d.id, createdBy: d.createdBy})));
            }
            
            console.log('🔐 RBAC EDIT TESTS:');
            console.log('- Can admin edit dependency created by admin?', canEditDependency('admin@demo.com'));
            console.log('- Can admin edit dependency created by user?', canEditDependency('user@demo.com'));
            
            console.log('🔐 RBAC DELETE TESTS:');
            console.log('- Can admin delete dependency created by admin?', canDeleteDependency('admin@demo.com'));
            console.log('- Can admin delete dependency created by user?', canDeleteDependency('user@demo.com'));
            
            console.log('🎯 Modal element exists?', !!document.getElementById('addEditModal'));
            console.log('📝 Form fields exist?', {
                name: !!document.getElementById('depName'),
                desc: !!document.getElementById('depDescription'),
                team: !!document.getElementById('depTeam'),
                status: !!document.getElementById('depStatus'),
                priority: !!document.getElementById('depPriority'),
                risk: !!document.getElementById('depRisk'),
                jira: !!document.getElementById('depJira')
            });
            
            // Test dependency lookup
            if (dependencies && dependencies.length > 0) {
                console.log('🧪 Testing dependency lookup...');
                var testId = dependencies[0].id;
                var foundDep = dependencies.find(function(d) { return d.id === testId; });
                console.log('🔍 Looking for ID:', testId, '(type:', typeof testId, ')');
                console.log('✅ Found dependency:', foundDep ? foundDep.name : 'NOT FOUND');
                
                console.log('🧪 Testing button permissions...');
                dependencies.slice(0, 3).forEach(function(dep) {
                    console.log('- Dependency:', dep.name, 
                               'Edit allowed:', canEditDependency(dep.createdBy), 
                               'Delete allowed:', canDeleteDependency(dep.createdBy));
                });
            }
            
            console.log('============================');
            console.log('💡 AVAILABLE TEST COMMANDS:');
            console.log('💡 debugAdminIssues() - Run this diagnostic');
            console.log('💡 testEdit(' + (dependencies && dependencies.length > 0 ? dependencies[0].id : '1') + ') - Test edit function');
            console.log('💡 testDelete(' + (dependencies && dependencies.length > 0 ? dependencies[0].id : '1') + ') - Test delete function');
            console.log('💡 loadDependencies() - Reload data');
        };
        
        // Backward compatibility
        window.debugEditIssue = window.debugAdminIssues;
        
        console.log('✅ All functions loaded and ready!');
        
        // Check for existing login on page load
        window.addEventListener('load', function() {
            console.log('Page loaded - checking for existing login...');
            checkExistingLogin();
        });
        
        console.log('✅ COMPLETE DEPENDENCY MANAGEMENT SYSTEM FULLY LOADED!');
    </script>
</body>
</html>
`;

// API endpoint to test email functionality
app.use(express.json());

app.post('/api/test-email', async (req, res) => {
    try {
        const { team } = req.body;
        
        const testDependency = {
            name: 'Test Email Notification',
            description: 'This is a test dependency to verify email notifications are working properly.',
            team: team,
            status: 'NOT STARTED',
            priority: 'MEDIUM',
            riskLevel: 'LOW',
            jiraTicket: 'https://jira.example.com/TEST-123',
            createdBy: 'admin@demo.com'
        };

        const result = await sendDependencyNotification(testDependency, 'Test Assignment');
        
        res.json({
            success: result.success,
            message: result.message,
            teamOwner: teamOwners[team],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API endpoint for creating dependencies
app.post('/api/dependencies', async (req, res) => {
    try {
        const { name, description, team, status, priority, riskLevel, jiraTicket, createdBy } = req.body;
        
        // Validation
        if (!name || name.length < 2) {
            return res.status(400).json({ success: false, message: 'Dependency name must be at least 2 characters long' });
        }
        
        if (!description || description.length < 10) {
            return res.status(400).json({ success: false, message: 'Description must be at least 10 characters long' });
        }
        
        if (!team) {
            return res.status(400).json({ success: false, message: 'Please select a responsible team' });
        }
        
        const newDependency = {
            name,
            description,
            team,
            status: status || 'NOT STARTED',
            priority: priority || 'MEDIUM',
            riskLevel: riskLevel || 'LOW',
            jiraTicket,
            createdBy,
            lastUpdated: new Date().toISOString()
        };
        
        // Send email notification for new dependency
        console.log('📧 New dependency assigned to team:', team, '- sending notification');
        const emailResult = await sendDependencyNotification(newDependency, 'Assigned');
        
        res.json({
            success: true,
            message: 'Dependency created successfully',
            dependency: newDependency,
            emailSent: emailResult.success,
            emailMessage: emailResult.message
        });
        
    } catch (error) {
        console.error('❌ Error creating dependency:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create dependency: ' + error.message
        });
    }
});

// API endpoint for updating dependencies
app.put('/api/dependencies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, team, status, priority, riskLevel, jiraTicket, originalTeam } = req.body;
        
        // Validation
        if (!name || name.length < 2) {
            return res.status(400).json({ success: false, message: 'Dependency name must be at least 2 characters long' });
        }
        
        if (!description || description.length < 10) {
            return res.status(400).json({ success: false, message: 'Description must be at least 10 characters long' });
        }
        
        if (!team) {
            return res.status(400).json({ success: false, message: 'Please select a responsible team' });
        }
        
        const updatedDependency = {
            id: parseInt(id),
            name,
            description,
            team,
            status,
            priority,
            riskLevel,
            jiraTicket,
            lastUpdated: new Date().toISOString()
        };
        
        let emailSent = false;
        let emailMessage = 'No email notification needed';
        
        // Send email notification if team changed
        if (originalTeam && originalTeam !== team) {
            console.log('📧 Team changed from', originalTeam, 'to', team, '- sending notification');
            const emailResult = await sendDependencyNotification(updatedDependency, 'Reassigned');
            emailSent = emailResult.success;
            emailMessage = emailResult.message;
        }
        
        res.json({
            success: true,
            message: 'Dependency updated successfully',
            dependency: updatedDependency,
            emailSent,
            emailMessage
        });
        
    } catch (error) {
        console.error('❌ Error updating dependency:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update dependency: ' + error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send(completeHTML);
});

app.listen(PORT, () => {
    console.log(`🚀 Complete Dependency Management System running at http://localhost:${PORT}`);
    console.log('✅ Full Features: Login, Dashboard, CRUD, Search, Filtering, RBAC, Data Persistence');
    console.log('📧 REAL EMAIL SENDING ENABLED! (Configure Gmail credentials below)');
    console.log('🎯 Target: "Annotation tools" team → mmahipal.reddy@gmail.com');
    console.log('');
    console.log('🔧 CONFIGURATION REQUIRED:');
    console.log('   1. Edit serve_complete.js lines 24-25:');
    console.log('      Replace YOUR_GMAIL_ADDRESS@gmail.com with your Gmail');
    console.log('      Replace YOUR_APP_PASSWORD with your Gmail App Password');
    console.log('   2. Edit serve_complete.js line 110:');
    console.log('      Replace YOUR_GMAIL_ADDRESS@gmail.com in the "from" field');
    console.log('   3. Restart server after making changes');
    console.log('');
    console.log('📊 Team Owner Mappings:');
    Object.keys(teamOwners).forEach(team => {
        const email = teamOwners[team];
        const highlight = team === 'Annotation tools' ? ' 🎯' : '';
        console.log(`   ${team} → ${email}${highlight}`);
    });
    console.log('');
    console.log('🧪 API Endpoints:');
    console.log('   POST /api/test-email - Test email notifications');
    console.log('   GET  / - Main application');
    console.log('');
    console.log('⚠️  IMPORTANT: Provide Gmail credentials to send real emails!');
});
