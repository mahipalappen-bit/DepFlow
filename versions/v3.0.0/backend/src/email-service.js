const nodemailer = require('nodemailer');

// Email Configuration
const EMAIL_USER = 'mahipal.appen@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'ncqrlemsrqwjogzr'; // Set this in production
const EMAIL_TO = 'mmahipal.reddy@gmail.com';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Enhanced helper functions for light modern email colors
function getStatusColorHex(status) {
    switch(status) {
        case 'COMPLETED': return '22c55e';      // Light emerald
        case 'IN PROGRESS': return '0ea5e9';    // Light blue  
        case 'BLOCKED': return 'f56565';        // Light red
        case 'NOT STARTED': return '71717a';    // Light slate
        default: return '71717a';
    }
}

function getPriorityColorHex(priority) {
    switch(priority) {
        case 'HIGH': return 'f56565';           // Light red
        case 'MEDIUM': return 'fbbf24';         // Light amber
        case 'LOW': return '22c55e';            // Light emerald
        default: return '71717a';
    }
}

// Email sending function
async function sendNotificationEmail(type, dependency, user) {
    const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0; font-size: 24px;">🔔 DepFlow Notification</h2>
            </div>
            <div style="background: #f8fafc; padding: 20px; border: 1px solid #e5e7eb;">
                <h3 style="color: #1e293b; margin-top: 0;">Dependency ${type}</h3>
                <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <p><strong>Name:</strong> ${dependency.name}</p>
                    <p><strong>Description:</strong> ${dependency.description}</p>
                    <p><strong>Team:</strong> ${dependency.team}</p>
                    <p><strong>Status:</strong> <span style="background: #${getStatusColorHex(dependency.status)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${dependency.status}</span></p>
                    <p><strong>Priority:</strong> <span style="background: #${getPriorityColorHex(dependency.priority)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${dependency.priority}</span></p>
                    <p><strong>Action performed by:</strong> ${user.name} (${user.email})</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
            </div>
            <div style="background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
                This is an automated notification from DepFlow Dependency Management System
            </div>
        </div>
    `;

    const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_TO,
        subject: `DepFlow: Dependency ${type} - ${dependency.name}`,
        html: emailHTML
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendNotificationEmail
};
