const express = require('express');
const app = express();
const PORT = 3000;

const enhancedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Dependency Management Platform</title>
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
            right: 2rem;
            z-index: 1000;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            border: 1px solid #e5e7eb;
        }
        
        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .user-info {
            text-align: left;
        }
        
        .user-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.875rem;
        }
        
        .user-role {
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .btn-logout {
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-logout:hover {
            background: #dc2626;
        }
        
        /* Dashboard styles */
        .dashboard {
            display: none;
            min-height: 100vh;
            background: #f9fafb;
            padding-top: 5rem;
        }
        
        .dashboard.active {
            display: block;
        }
        
        .dashboard-header {
            background: white;
            padding: 2rem;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .dashboard-title {
            color: #1f2937;
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
            text-align: center;
        }
        
        .dashboard-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .success-message {
            background: #d1fae5;
            color: #065f46;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <!-- Landing Page -->
    <div id="landingPage">
        <div class="hero-section">
            <h1><i class="fas fa-cubes" style="color: #3b82f6; margin-right: 0.5rem;"></i> Enterprise Dependency Management</h1>
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
        
        <div class="dashboard-header">
            <h1 class="dashboard-title">
                <i class="fas fa-cubes" style="color: #3b82f6; margin-right: 0.5rem;"></i>
                Dependency Management Dashboard
            </h1>
        </div>
        
        <div class="dashboard-content">
            <div class="success-message">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                Welcome! You have successfully logged into the Dependency Management System.
                <div style="margin-top: 0.5rem; font-weight: normal;">
                    This is where your dependency management features will be loaded.
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

    <script>
        console.log('🚀 ENHANCED APPLICATION STARTING...');
        
        // Core modal functions (working from minimal version)
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
            console.log('Filling admin credentials...');
            document.getElementById('email').value = 'admin@demo.com';
            document.getElementById('password').value = 'admin123456';
        }
        
        function fillUserCredentials() {
            console.log('Filling user credentials...');
            document.getElementById('email').value = 'user@demo.com';
            document.getElementById('password').value = 'user123456';
        }
        
        function scrollToDemo() {
            console.log('Scrolling to demo credentials...');
            var demo = document.getElementById('demoCredentials');
            if (demo) {
                demo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        function performLogin(event) {
            event.preventDefault();
            console.log('Login attempt...');
            
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            
            // Simple login validation
            var validCredentials = [
                { email: 'admin@demo.com', password: 'admin123456', name: 'Admin User', role: 'admin' },
                { email: 'user@demo.com', password: 'user123456', name: 'Team Member', role: 'user' }
            ];
            
            var user = validCredentials.find(function(cred) {
                return cred.email === email && cred.password === password;
            });
            
            if (user) {
                console.log('✅ Login successful for:', user.name);
                
                // Store user info
                localStorage.setItem('authToken', 'demo-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify(user));
                
                // Close modal and show dashboard
                closeLoginModal();
                showDashboard(user);
            } else {
                console.log('❌ Login failed');
                alert('Invalid credentials. Please use the demo credentials provided.');
            }
        }
        
        function showDashboard(user) {
            console.log('Showing dashboard for:', user.name);
            
            // Hide landing page
            document.getElementById('landingPage').style.display = 'none';
            
            // Show dashboard
            var dashboard = document.getElementById('dashboardPage');
            dashboard.classList.add('active');
            
            // Update user panel
            var userPanel = document.getElementById('userPanel');
            var userAvatar = document.getElementById('userAvatar');
            var userName = document.getElementById('userName');
            var userRole = document.getElementById('userRole');
            
            userAvatar.textContent = user.name.charAt(0).toUpperCase();
            userName.textContent = user.name;
            userRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' User';
            
            userPanel.style.display = 'flex';
            
            console.log('✅ Dashboard displayed successfully!');
        }
        
        function logout() {
            console.log('Logging out...');
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
                    console.log('Existing login found, showing dashboard for:', user.name);
                    showDashboard(user);
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }
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
        
        console.log('✅ All functions loaded and ready!');
        
        // Check for existing login on page load
        window.addEventListener('load', function() {
            console.log('Page loaded - checking for existing login...');
            checkExistingLogin();
        });
        
        console.log('✅ ENHANCED APPLICATION FULLY LOADED!');
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(enhancedHTML);
});

app.listen(PORT, () => {
    console.log(`🚀 Enhanced Dependency Management App running at http://localhost:${PORT}`);
    console.log('✅ Features included: Login system, Dashboard, User panel');
});


