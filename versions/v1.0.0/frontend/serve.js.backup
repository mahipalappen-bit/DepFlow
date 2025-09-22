const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Dependency Management Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <style>
        :root {
            --primary-50: #eff6ff;
            --primary-100: #dbeafe;
            --primary-200: #bfdbfe;
            --primary-500: #3b82f6;
            --primary-600: #2563eb;
            --primary-700: #1d4ed8;
            --primary-900: #1e3a8a;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
            --success-500: #10b981;
            --warning-500: #f59e0b;
            --error-500: #ef4444;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
            min-height: 100vh;
            color: var(--gray-900);
            line-height: 1.6;
            font-size: 14px;
        }
        
        .enterprise-header {
            background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
            color: white;
            text-align: center;
            padding: 2rem 1rem;
            box-shadow: var(--shadow-xl);
        }
        
        .enterprise-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .enterprise-header p {
            font-size: 1.2rem;
            opacity: 0.95;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .hero-section {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .hero-section h2 {
            font-size: 2.2rem;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 1rem;
        }
        
        .hero-section p {
            font-size: 1.1rem;
            color: var(--gray-600);
            margin-bottom: 2rem;
            line-height: 1.8;
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
        
        .btn-primary, .btn-secondary {
            padding: 0.875rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            text-transform: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            min-width: 200px;
            justify-content: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            color: white;
            box-shadow: var(--shadow);
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: var(--gray-100);
            color: var(--gray-700);
            border: 2px solid var(--gray-300);
        }
        
        .btn-secondary:hover {
            background: var(--gray-200);
            border-color: var(--primary-500);
            color: var(--primary-700);
            transform: translateY(-2px);
        }
        
        .btn-large {
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
        }
        
        .feature-badges {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .badge {
            background: var(--primary-50);
            color: var(--primary-700);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid var(--primary-200);
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 2rem;
        }
        
        .enterprise-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--gray-200);
            transition: all 0.3s ease;
        }
        
        .enterprise-card:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-4px);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .card-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }
        
        .card-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--gray-900);
        }
        
        .card-description {
            color: var(--gray-600);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .credentials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .credential-item {
            background: var(--gray-50);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid var(--primary-500);
        }
        
        .credential-label {
            font-weight: 600;
            color: var(--gray-700);
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .credential-value {
            font-family: 'Monaco', 'Menlo', monospace;
            background: var(--gray-800);
            color: var(--gray-100);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;
            word-break: break-all;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .status-item {
            text-align: center;
            padding: 1rem;
            border-radius: 8px;
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
        }
        
        .status-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-600);
            margin-bottom: 0.25rem;
        }
        
        .status-label {
            font-size: 0.875rem;
            color: var(--gray-600);
        }
        
        .footer {
            background: var(--gray-900);
            color: white;
            text-align: center;
            padding: 3rem 2rem 2rem;
            margin-top: 4rem;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer p {
            margin: 0.5rem 0;
        }
        
        /* Login Modal Styles */
        .login-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.75);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            width: 90%;
            max-width: 450px;
            box-shadow: var(--shadow-xl);
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .modal-header h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .modal-header p {
            color: var(--gray-600);
            font-size: 0.95rem;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .form-label {
            font-weight: 500;
            color: var(--gray-700);
            font-size: 0.875rem;
        }
        
        .form-input {
            padding: 0.75rem;
            border: 1px solid var(--gray-300);
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .quick-login {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
        }
        
        .quick-btn {
            flex: 1;
            padding: 0.75rem 1rem;
            background: var(--gray-50);
            border: 1px solid var(--gray-300);
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            color: var(--gray-700);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .quick-btn:hover {
            background: var(--primary-50);
            border-color: var(--primary-300);
            color: var(--primary-700);
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .btn-cancel {
            padding: 0.75rem 1.5rem;
            background: var(--gray-100);
            border: 1px solid var(--gray-300);
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            color: var(--gray-700);
            transition: all 0.2s ease;
        }
        
        .btn-cancel:hover {
            background: var(--gray-200);
            border-color: var(--gray-400);
        }
        
        .btn-login {
            padding: 0.75rem 1.5rem;
            background: var(--primary-600);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .btn-login:hover {
            background: var(--primary-700);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .hero-section h2 { font-size: 1.8rem; }
            .hero-actions { flex-direction: column; align-items: center; }
            .dashboard-grid { grid-template-columns: 1fr; padding: 0 1rem; }
            .credentials-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>

<body>
    <!-- Enterprise Header -->
    <div class="enterprise-header">
        <h1><i class="fas fa-cubes"></i> Dependency Management Platform</h1>
        <p>Enterprise-grade software dependency tracking and management solution</p>
    </div>

    <!-- Main Content -->
    <div class="hero-section">
        <h2>Enterprise-Grade Dependency Management</h2>
        <p>Streamline your software development lifecycle with comprehensive dependency tracking, security monitoring, and team collaboration tools.</p>
        
        <!-- Primary Actions -->
        <div class="hero-actions">
            <button class="btn-primary btn-large" onclick="openLoginModal()">
                <i class="fas fa-sign-in-alt"></i>
                Launch Application
            </button>
            <button class="btn-secondary btn-large" onclick="scrollToCredentials()">
                <i class="fas fa-key"></i>
                View Demo Credentials
            </button>
        </div>
        
        <div class="feature-badges">
            <span class="badge">SOC 2 Compliant</span>
            <span class="badge">99.9% Uptime</span>
            <span class="badge">Enterprise Security</span>
            <span class="badge">Real-time Analytics</span>
        </div>
    </div>

    <!-- Dashboard Cards -->
    <div class="dashboard-grid">
        <!-- Authentication Card -->
        <div id="credentials-card" class="enterprise-card">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-key"></i>
                </div>
                <div>
                    <h3 class="card-title">Demo Credentials</h3>
                </div>
            </div>
            <p class="card-description">
                Use these demo credentials to explore the platform's comprehensive dependency management capabilities.
            </p>
            <div class="credentials-grid">
                <div class="credential-item">
                    <div class="credential-label">Admin User</div>
                    <div class="credential-value">admin@demo.com</div>
                    <div class="credential-value">admin123456</div>
                </div>
                <div class="credential-item">
                    <div class="credential-label">Team Member</div>
                    <div class="credential-value">user@demo.com</div>
                    <div class="credential-value">user123456</div>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn-primary" onclick="quickLogin()">
                    <i class="fas fa-sign-in-alt"></i>
                    Quick Login
                </button>
                <button class="btn-secondary" onclick="scrollToTop()">
                    <i class="fas fa-arrow-up"></i>
                    Back to Top
                </button>
            </div>
        </div>

        <!-- System Status Card -->
        <div class="enterprise-card">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div>
                    <h3 class="card-title">System Status</h3>
                </div>
            </div>
            <p class="card-description">
                Real-time system health monitoring and performance metrics for optimal dependency management.
            </p>
            <div class="status-grid">
                <div class="status-item">
                    <div class="status-value">99.9%</div>
                    <div class="status-label">Uptime</div>
                </div>
                <div class="status-item">
                    <div class="status-value">13</div>
                    <div class="status-label">Dependencies</div>
                </div>
                <div class="status-item">
                    <div class="status-value">10</div>
                    <div class="status-label">Teams</div>
                </div>
                <div class="status-item">
                    <div class="status-value">6</div>
                    <div class="status-label">In Progress</div>
                </div>
            </div>
        </div>

        <!-- Features Card -->
        <div class="enterprise-card">
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div>
                    <h3 class="card-title">Key Features</h3>
                </div>
            </div>
            <p class="card-description">
                Comprehensive feature set designed for enterprise-scale dependency management and security compliance.
            </p>
            <ul style="list-style: none; padding: 0; color: var(--gray-700);">
                <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-shield-alt" style="color: var(--primary-600);"></i>
                    Security vulnerability scanning
                </li>
                <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-users" style="color: var(--primary-600);"></i>
                    Multi-team collaboration
                </li>
                <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-sync-alt" style="color: var(--primary-600);"></i>
                    Automated dependency updates
                </li>
                <li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-chart-bar" style="color: var(--primary-600);"></i>
                    Advanced analytics & reporting
                </li>
            </ul>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-content">
            <p><strong>Enterprise Dependency Management Platform v2.1.0</strong></p>
            <p>© 2024 Enterprise Software Solutions. All rights reserved.</p>
            <p>System Status: <span style="color: #10b981;">Operational</span> | Backend: Port 5000 | Frontend: Port 3000</p>
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
                    <button type="button" class="btn-cancel" onclick="hideLoginModal()">Cancel</button>
                    <button type="submit" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        console.log('🚀 ULTRA-SIMPLE LAUNCH APPLICATION SYSTEM STARTING...');
        
        // THE SIMPLEST POSSIBLE IMPLEMENTATION
        function openLoginModal() {
            console.log('✅ LAUNCH APPLICATION BUTTON CLICKED!');
            var modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                console.log('✅ Modal opened!');
                var email = document.getElementById('email');
                if (email) email.focus();
            } else {
                console.error('Modal not found!');
                alert('Please refresh the page');
            }
        }
        
        // Make it globally available IMMEDIATELY
        window.openLoginModal = openLoginModal;
        
        console.log('✅ openLoginModal function ready:', typeof openLoginModal);
        console.log('✅ window.openLoginModal ready:', typeof window.openLoginModal);
        
        function closeLoginModal() {
            console.log('Closing modal');
            var modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
        
        function hideLoginModal() {
            closeLoginModal();
        }
        
        window.closeLoginModal = closeLoginModal;
        window.hideLoginModal = hideLoginModal;
        
        // Test the button immediately when page loads
        window.addEventListener('load', function() {
            console.log('🎯 Page loaded - testing button...');
            var button = document.querySelector('button[onclick*="openLoginModal"]');
            var modal = document.getElementById('loginModal');
            console.log('Button found:', !!button);
            console.log('Modal found:', !!modal);
            
            if (button && modal) {
                console.log('✅ Both button and modal are available!');
            } else {
                console.error('❌ Missing elements!');
            }
            
            // Add a simple debug function
            window.debugModal = function() {
                console.log('=== SIMPLE DEBUG ===');
                console.log('openLoginModal type:', typeof openLoginModal);
                console.log('window.openLoginModal type:', typeof window.openLoginModal);
                console.log('Button exists:', !!document.querySelector('button[onclick*="openLoginModal"]'));
                console.log('Modal exists:', !!document.getElementById('loginModal'));
                console.log('Testing function...');
                openLoginModal();
            };
            
            // checkExistingLogin will be called later when the function is defined
        });
        
        function fillAdminCredentials() {
            console.log('fillAdminCredentials called');
            document.getElementById('email').value = 'admin@demo.com';
            document.getElementById('password').value = 'admin123456';
        }
        
        function fillUserCredentials() {
            console.log('fillUserCredentials called');
            document.getElementById('email').value = 'user@demo.com';
            document.getElementById('password').value = 'user123456';
        }
        
        function scrollToCredentials() {
            console.log('scrollToCredentials called');
            const card = document.getElementById('credentials-card');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        function scrollToTop() {
            console.log('scrollToTop called');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        function performLogin(event) {
            event.preventDefault();
            console.log('performLogin called');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Demo login validation
            if ((email === 'admin@demo.com' && password === 'admin123456') || 
                (email === 'user@demo.com' && password === 'user123456')) {
                
                const user = {
                    email: email,
                    role: email.includes('admin') ? 'admin' : 'user',
                    name: email.includes('admin') ? 'Administrator' : 'Team Member',
                    firstName: email.includes('admin') ? 'Admin' : 'User'
                };
                
                // Store user info for session
                localStorage.setItem('authToken', 'demo-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify(user));
                
                // Hide modal and show dashboard
                closeLoginModal();
                window.showDashboard(user);
                
                console.log('Login successful - Dashboard displayed');
            } else {
                alert('Invalid credentials. Please use the demo credentials.');
            }
        }
        
        // BULLETPROOF: Direct assignments to ensure global availability
        console.log('🔧 BULLETPROOF FUNCTION ASSIGNMENT...');
        
        // Redefine on window to ensure accessibility
        window.showLoginModal = function() {
            console.log('🔵 DIRECT showLoginModal called');
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                console.log('✅ Modal displayed successfully');
                setTimeout(() => {
                    const email = document.getElementById('email');
                    if (email) email.focus();
                }, 100);
            } else {
                console.error('❌ Modal not found');
                alert('Modal not found - refresh page');
            }
        };
        
        window.hideLoginModal = function() {
            console.log('🔵 DIRECT hideLoginModal called');
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };
        
        window.fillAdminCredentials = fillAdminCredentials;
        window.fillUserCredentials = fillUserCredentials;
        window.scrollToCredentials = scrollToCredentials;
        window.scrollToTop = scrollToTop;
        window.performLogin = performLogin;
        
        // IMMEDIATE VERIFICATION
        console.log('🧪 BULLETPROOF VERIFICATION:');
        console.log('✅ typeof window.showLoginModal:', typeof window.showLoginModal);
        console.log('✅ Modal exists:', !!document.getElementById('loginModal'));
        
        // Multiple test functions
        window.testModal = function() { 
            console.log('🧪 Direct test'); 
            window.showLoginModal(); 
        };
        
        window.forceModal = function() {
            console.log('🧪 FORCE MODAL TEST');
            document.getElementById('loginModal').style.display = 'flex';
        };
        
        console.log('🎯 SIMPLE FUNCTIONS READY!');
        
        // REMOVED DUPLICATE - Using holistic version defined at top of script
        
        function closeLoginModal() {
            console.log('🚀 CLOSING LOGIN MODAL');
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                console.log('✅ Modal closed successfully');
            }
        }
        
        function quickLogin() {
            console.log('🚀 QUICK LOGIN CLICKED!');
            openLoginModal();
        }
        
        // HOLISTIC FIX: Simple, clean approach - functions already defined at top and made global
        
        // Remove this conflicting window.onload - using addEventListener instead for consistency
        
        function showDashboard(user) {
            console.log('showDashboard called for user:', user.name);
            
            // Create dashboard HTML
            const dashboardHTML = 
                '<div style="min-height: 100vh; background: #f9fafb; font-family: Inter, sans-serif; position: relative;">' +
                    '<!-- Top Right User Panel -->' +
                    '<div style="position: fixed; top: 1rem; right: 2rem; z-index: 1000; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #e5e7eb;">' +
                        '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
                            '<div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem;">' +
                                user.name.charAt(0).toUpperCase() +
                            '</div>' +
                            '<div style="text-align: left;">' +
                                '<div style="font-weight: 600; color: #1f2937; font-size: 0.875rem;">' + user.name + '</div>' +
                                '<div style="font-size: 0.75rem; color: #6b7280;">' + (user.role.charAt(0).toUpperCase() + user.role.slice(1)) + ' User</div>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="logout()" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background=\'#dc2626\'" onmouseout="this.style.background=\'#ef4444\'">' +
                            '<i class="fas fa-sign-out-alt"></i> Logout' +
                        '</button>' +
                    '</div>' +
                    '<div style="background: white; padding: 1rem 2rem; border-bottom: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                        '<div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: flex-start;">' +
                            '<h1 style="color: #1f2937; font-size: 1.5rem; font-weight: 700; margin: 0;">' +
                                '<i class="fas fa-cubes" style="color: #3b82f6; margin-right: 0.5rem;"></i>' +
                                'Dependency Management Dashboard' +
                            '</h1>' +
                        '</div>' +
                    '</div>' +
                    
                    '<div style="display: flex; gap: 2rem; margin: 0; padding: 0; height: 100vh;">' +
                        '<div style="width: 280px; background: #f8fafc; border-right: 1px solid #e5e7eb; padding: 2rem; box-shadow: 2px 0 4px rgba(0,0,0,0.1);">' +
                            '<h3 style="color: #1f2937; font-size: 1.125rem; font-weight: 600; margin: 0 0 1.5rem 0;">' +
                                '<i class="fas fa-chart-bar" style="margin-right: 0.5rem; color: #3b82f6;"></i>Dashboard Overview' +
                            '</h3>' +
                            '<div style="display: flex; flex-direction: column; gap: 1rem;">' +
                                '<div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #3b82f6;">' +
                                    '<div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Total Dependencies</div>' +
                                    '<div id="totalCount" style="color: #3b82f6; font-size: 2rem; font-weight: 700;">13</div>' +
                                '</div>' +
                                '<div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #f59e0b;">' +
                                    '<div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">In Progress</div>' +
                                    '<div id="inProgressCount" style="color: #f59e0b; font-size: 2rem; font-weight: 700;">6</div>' +
                                '</div>' +
                                '<div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #ef4444;">' +
                                    '<div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Blocked</div>' +
                                    '<div id="blockedCount" style="color: #ef4444; font-size: 2rem; font-weight: 700;">2</div>' +
                                '</div>' +
                                '<div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #10b981;">' +
                                    '<div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Completed</div>' +
                                    '<div id="completedCount" style="color: #10b981; font-size: 2rem; font-weight: 700;">5</div>' +
                                '</div>' +
                                '<div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6b7280;">' +
                                    '<div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Not Started</div>' +
                                    '<div id="notStartedCount" style="color: #6b7280; font-size: 2rem; font-weight: 700;">0</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div style="flex: 1; padding: 2rem; overflow-y: auto;">' +
                            '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">' +
                                '<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 0;">' +
                                    '<i class="fas fa-list" style="margin-right: 0.5rem; color: #3b82f6;"></i>Dependency Management' +
                                '</h2>' +
                                '<button onclick="addNewDependency()" style="background: #10b981; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">' +
                                    '<i class="fas fa-plus"></i> Add New Dependency' +
                                '</button>' +
                            '</div>' +
                            
                            '<!-- Search and Filter Controls -->' +
                            '<div style="background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                                '<div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">' +
                                    '<div style="flex: 1; min-width: 250px;">' +
                                        '<div style="position: relative;">' +
                                            '<input type="text" id="searchInput" placeholder="Search dependencies..." style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;" onkeyup="applyFilters()">' +
                                            '<i class="fas fa-search" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #6b7280;"></i>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div style="display: flex; gap: 1rem; flex-wrap: wrap;">' +
                                        '<select id="teamFilter" onchange="applyFilters()" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; min-width: 150px;">' +
                                            '<option value="">All Teams</option>' +
                                            '<option value="Frontend Team">Frontend Team</option>' +
                                            '<option value="Backend Team">Backend Team</option>' +
                                            '<option value="DevOps Team">DevOps Team</option>' +
                                            '<option value="QA Team">QA Team</option>' +
                                            '<option value="Data Team">Data Team</option>' +
                                            '<option value="Security Team">Security Team</option>' +
                                            '<option value="Mobile Team">Mobile Team</option>' +
                                            '<option value="API Team">API Team</option>' +
                                            '<option value="Infrastructure Team">Infrastructure Team</option>' +
                                            '<option value="Cloud Team">Cloud Team</option>' +
                                        '</select>' +
                                        '<select id="statusFilter" onchange="applyFilters()" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; min-width: 140px;">' +
                                            '<option value="">All Status</option>' +
                                            '<option value="DONE">Done</option>' +
                                            '<option value="IN PROGRESS">In Progress</option>' +
                                            '<option value="BLOCKED">Blocked</option>' +
                                            '<option value="NOT STARTED">Not Started</option>' +
                                        '</select>' +
                                        '<select id="priorityFilter" onchange="applyFilters()" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; min-width: 130px;">' +
                                            '<option value="">All Priority</option>' +
                                            '<option value="HIGH">High</option>' +
                                            '<option value="MEDIUM">Medium</option>' +
                                            '<option value="LOW">Low</option>' +
                                        '</select>' +
                                        '<button onclick="clearFilters()" style="background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">' +
                                            '<i class="fas fa-times"></i> Clear' +
                                        '</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        
                            '<div style="background: white; border-radius: 8px; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
                            
                            '<div style="overflow-x: auto;">' +
                                '<table style="width: 100%; border-collapse: collapse;">' +
                                    '<thead>' +
                                        '<tr style="background: #f9fafb;">' +
                                            '<th style="text-align: left; padding: 1rem; color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Dependency</th>' +
                                            '<th style="text-align: left; padding: 1rem; color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Team</th>' +
                                            '<th style="text-align: left; padding: 1rem; color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Status</th>' +
                                            '<th style="text-align: left; padding: 1rem; color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Priority</th>' +
                                            '<th style="text-align: left; padding: 1rem; color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Last Updated</th>' +
                                            '<th style="text-align: left; padding: 1rem; color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Actions</th>' +
                                        '</tr>' +
                                    '</thead>' +
                                    '<tbody id="dependencyTableBody">' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;" data-dependency-id="1" data-created-by="admin@demo.com">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">React</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Frontend Framework</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Frontend Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updateStatus(1, this.value)" style="background: #dcfce7; color: #15803d; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="DONE" selected>DONE</option>' +
                                    '<option value="IN PROGRESS">IN PROGRESS</option>' +
                                    '<option value="BLOCKED">BLOCKED</option>' +
                                    '<option value="NOT STARTED">NOT STARTED</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updatePriority(1, this.value)" style="background: #fef3c7; color: #d97706; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="HIGH">HIGH</option>' +
                                    '<option value="MEDIUM" selected>MEDIUM</option>' +
                                    '<option value="LOW">LOW</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">2 days ago</td>' +
                            '<td style="padding: 1rem;" id="actions-1">' +
                                '<button onclick="editDependency(1)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">✏️ Edit</button>' +
                                '<button onclick="deleteDependency(1)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">🗑️ Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;" data-dependency-id="2">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Express.js</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Backend Framework</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Backend Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updateStatus(2, this.value)" style="background: #dbeafe; color: #2563eb; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="DONE">DONE</option>' +
                                    '<option value="IN PROGRESS" selected>IN PROGRESS</option>' +
                                    '<option value="BLOCKED">BLOCKED</option>' +
                                    '<option value="NOT STARTED">NOT STARTED</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updatePriority(2, this.value)" style="background: #dcfce7; color: #15803d; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="HIGH">HIGH</option>' +
                                    '<option value="MEDIUM">MEDIUM</option>' +
                                    '<option value="LOW" selected>LOW</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">1 week ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(2)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">✏️ Edit</button>' +
                                '<button onclick="deleteDependency(2)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">🗑️ Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;" data-dependency-id="3">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">MongoDB</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Database</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Backend Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updateStatus(3, this.value)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="DONE">DONE</option>' +
                                    '<option value="IN PROGRESS">IN PROGRESS</option>' +
                                    '<option value="BLOCKED" selected>BLOCKED</option>' +
                                    '<option value="NOT STARTED">NOT STARTED</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updatePriority(3, this.value)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="HIGH" selected>HIGH</option>' +
                                    '<option value="MEDIUM">MEDIUM</option>' +
                                    '<option value="LOW">LOW</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">3 weeks ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(3)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">✏️ Edit</button>' +
                                '<button onclick="deleteDependency(3)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">🗑️ Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Node.js</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Runtime Environment</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Backend Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updateStatus(4, this.value)" style="background: #dcfce7; color: #15803d; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="DONE" selected>DONE</option>' +
                                    '<option value="IN PROGRESS">IN PROGRESS</option>' +
                                    '<option value="BLOCKED">BLOCKED</option>' +
                                    '<option value="NOT STARTED">NOT STARTED</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<select onchange="updatePriority(4, this.value)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                    '<option value="HIGH" selected>HIGH</option>' +
                                    '<option value="MEDIUM">MEDIUM</option>' +
                                    '<option value="LOW">LOW</option>' +
                                '</select>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">1 day ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(4)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(4)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">TypeScript</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Language & Type System</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Frontend Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dbeafe; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">IN PROGRESS</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #fef3c7; color: #d97706; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">MEDIUM</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">5 days ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Redis</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Cache & Session Store</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Infrastructure Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">DONE</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #fef3c7; color: #d97706; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">MEDIUM</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">1 week ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Docker</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Containerization Platform</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">DevOps Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dbeafe; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">IN PROGRESS</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #fecaca; color: #dc2626; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">HIGH</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">3 days ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Kubernetes</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Container Orchestration</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">DevOps Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #fecaca; color: #dc2626; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">BLOCKED</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #fecaca; color: #dc2626; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">HIGH</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">2 weeks ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">PostgreSQL</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Relational Database</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Data Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">DONE</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">LOW</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">4 days ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Jest</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Testing Framework</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">QA Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dbeafe; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">IN PROGRESS</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">LOW</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">6 days ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">AWS SDK</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Cloud Services SDK</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Cloud Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dbeafe; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">IN PROGRESS</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #fef3c7; color: #d97706; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">MEDIUM</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">1 week ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr style="border-bottom: 1px solid #f3f4f6;">' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">Webpack</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">Module Bundler</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">Frontend Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">DONE</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">LOW</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">2 weeks ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td style="padding: 1rem;">' +
                                '<div style="font-weight: 600; color: #1f2937;">GraphQL</div>' +
                                '<div style="color: #6b7280; font-size: 0.875rem;">API Query Language</div>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">API Team</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #f3f4f6; color: #6b7280; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">NOT STARTED</span>' +
                            '</td>' +
                            '<td style="padding: 1rem;">' +
                                '<span style="background: #dcfce7; color: #15803d; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">LOW</span>' +
                            '</td>' +
                            '<td style="padding: 1rem; color: #6b7280;">4 weeks ago</td>' +
                            '<td style="padding: 1rem;">' +
                                '<button onclick="editDependency(0)" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">Edit</button>' +
                                '<button onclick="deleteDependency(0)" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Delete</button>' +
                            '</td>' +
                        '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                            '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            
            // Replace page content with dashboard
            document.body.innerHTML = dashboardHTML;
            
            // CRITICAL: Restore all functions after body innerHTML replacement
            window.showDashboard = showDashboard;
            window.logout = logout;
            window.showNotification = showNotification;
            window.updateStatus = updateStatus;
            window.updatePriority = updatePriority;
            window.editDependency = editDependency;
            window.deleteDependency = deleteDependency;
            window.updateCounters = updateCounters;
            window.addNewDependency = addNewDependency;
            window.showAddDependencyModal = showAddDependencyModal;
            // HOLISTIC: Restore login functions after dashboard load (for logout->login flow)
            window.openLoginModal = openLoginModal;
            window.closeLoginModal = closeLoginModal;
            window.closeAddDependencyModal = closeAddDependencyModal;
            window.submitNewDependency = submitNewDependency;
            window.showEditDependencyModal = showEditDependencyModal;
            window.closeEditDependencyModal = closeEditDependencyModal;
            window.submitEditedDependency = submitEditedDependency;
            window.saveDependenciesToStorage = saveDependenciesToStorage;
            window.loadDependenciesFromStorage = loadDependenciesFromStorage;
            window.renderDependenciesFromStorage = renderDependenciesFromStorage;
            window.applyFilters = applyFilters;
            window.clearFilters = clearFilters;
            window.canEditDependency = canEditDependency;
            window.canDeleteDependency = canDeleteDependency;
            window.generateActionButtons = generateActionButtons;
            window.updateRBACForAllRows = updateRBACForAllRows;
            window.getStatusColor = getStatusColor;
            window.getPriorityColor = getPriorityColor;
            window.getRiskColor = getRiskColor;
            window.checkExistingLogin = checkExistingLogin;
            
            console.log('✅ All functions restored after dashboard injection');
            
            // Try to load dependencies from storage, otherwise use default
            const loadedFromStorage = renderDependenciesFromStorage();
            if (loadedFromStorage) {
                console.log('📁 Dashboard loaded with stored dependencies');
            } else {
                console.log('📁 Dashboard loaded with default dependencies');
                // Save the default data to storage for future use
                setTimeout(() => {
                    saveDependenciesToStorage();
                }, 1000);
            }
            
            // Update counters after dashboard is rendered
            updateCounters();
            
            // Apply RBAC to all existing hardcoded rows
            setTimeout(() => {
                updateRBACForAllRows();
            }, 500);
            
            console.log('Dashboard displayed successfully');
        }
        
        function logout() {
            console.log('logout called');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Reload the page to show landing page
            window.location.reload();
        }
        
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = 
                'position: fixed; top: 20px; right: 20px; z-index: 1000; ' +
                'padding: 1rem 1.5rem; border-radius: 8px; color: white; font-weight: 600; ' +
                'transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            
            if (type === 'success') {
                notification.style.background = '#10b981';
            } else if (type === 'error') {
                notification.style.background = '#ef4444';
            } else {
                notification.style.background = '#3b82f6';
            }
            
            notification.innerHTML = '<i class="fas fa-info-circle"></i> ' + message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
        }
        
        function updateStatus(id, newStatus) {
            console.log('Updating status for dependency', id, 'to', newStatus);
            
            // Update the dropdown styling based on status
            const select = event.target;
            if (newStatus === 'DONE') {
                select.style.background = '#dcfce7';
                select.style.color = '#15803d';
            } else if (newStatus === 'IN PROGRESS') {
                select.style.background = '#dbeafe';
                select.style.color = '#2563eb';
            } else if (newStatus === 'BLOCKED') {
                select.style.background = '#fecaca';
                select.style.color = '#dc2626';
            } else {
                select.style.background = '#f3f4f6';
                select.style.color = '#6b7280';
            }
            
            // Update last updated timestamp
            const row = select.closest('tr');
            if (row) {
                const lastUpdatedCell = row.querySelector('td:nth-child(5)');
                if (lastUpdatedCell) {
                    lastUpdatedCell.textContent = new Date().toLocaleString();
                }
            }
            
            // Update counters
            updateCounters();
            
            // Save to storage
            saveDependenciesToStorage();
            
            showNotification('Status updated to ' + newStatus, 'success');
        }
        
        function updatePriority(id, newPriority) {
            console.log('Updating priority for dependency', id, 'to', newPriority);
            
            // Update the dropdown styling based on priority
            const select = event.target;
            if (newPriority === 'HIGH') {
                select.style.background = '#fecaca';
                select.style.color = '#dc2626';
            } else if (newPriority === 'MEDIUM') {
                select.style.background = '#fef3c7';
                select.style.color = '#d97706';
            } else {
                select.style.background = '#dcfce7';
                select.style.color = '#15803d';
            }
            
            // Update last updated timestamp
            const row = select.closest('tr');
            if (row) {
                const lastUpdatedCell = row.querySelector('td:nth-child(5)');
                if (lastUpdatedCell) {
                    lastUpdatedCell.textContent = new Date().toLocaleString();
                }
            }
            
            // Save to storage
            saveDependenciesToStorage();
            
            showNotification('Priority updated to ' + newPriority, 'success');
        }
        
        function editDependency(id) {
            console.log('🚀 Opening Edit Dependency Modal for ID:', id);
            
            // RBAC Check
            const row = document.querySelector('tr[data-dependency-id="' + id + '"]');
            if (!row) {
                showNotification('❌ Dependency not found', 'error');
                return;
            }
            
            const createdBy = row.getAttribute('data-created-by') || 'unknown';
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!canEditDependency(createdBy, currentUser.email, currentUser.role)) {
                showNotification('❌ You do not have permission to edit this dependency', 'error');
                return;
            }
            
            showEditDependencyModal(id);
        }

        function showEditDependencyModal(id) {
            // Find the row with this dependency
            const row = document.querySelector('tr[data-dependency-id="' + id + '"]');
            if (!row) {
                showNotification('❌ Could not find dependency to edit', 'error');
                return;
            }

            // Extract current values from the row
            const nameDiv = row.querySelector('td:first-child div:first-child');
            const descriptionDiv = row.querySelector('td:first-child div:nth-child(2)');
            const jiraDiv = row.querySelector('td:first-child div:nth-child(3)');
            const teamCell = row.querySelector('td:nth-child(2)');
            const statusSelect = row.querySelector('td:nth-child(3) select');
            const prioritySelect = row.querySelector('td:nth-child(4) select');
            const riskSpan = row.querySelector('td:nth-child(4) span');

            const currentName = nameDiv ? nameDiv.textContent : '';
            const currentDescription = descriptionDiv ? descriptionDiv.textContent : '';
            const currentJira = jiraDiv ? jiraDiv.textContent.replace('🎫 ', '') : '';
            const currentTeam = teamCell ? teamCell.textContent : '';
            const currentStatus = statusSelect ? statusSelect.value : '';
            const currentPriority = prioritySelect ? prioritySelect.value : '';
            const currentRisk = riskSpan ? riskSpan.textContent.replace('Risk: ', '') : '';

            // Create the edit modal HTML
            const modalHTML = 
                '<div id="editDependencyModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">' +
                    '<div style="background: white; border-radius: 12px; padding: 2rem; width: 600px; max-width: 90vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">' +
                        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">' +
                            '<h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0;">' +
                                '<i class="fas fa-edit" style="color: #f59e0b; margin-right: 0.5rem;"></i>' +
                                'Edit Dependency' +
                            '</h3>' +
                            '<button onclick="closeEditDependencyModal()" style="background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; padding: 0.25rem;">&times;</button>' +
                        '</div>' +
                        
                        '<form id="editDependencyForm" style="display: grid; gap: 1.5rem;">' +
                            '<input type="hidden" id="editDepId" value="' + id + '">' +
                            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Dependency Name *</label>' +
                                    '<input type="text" id="editDepName" required placeholder="e.g., React, Node.js, MongoDB" value="' + currentName + '" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                '</div>' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Team *</label>' +
                                    '<select id="editDepTeam" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                        '<option value="">Select Team</option>' +
                                        '<option value="Frontend Team"' + (currentTeam === 'Frontend Team' ? ' selected' : '') + '>Frontend Team</option>' +
                                        '<option value="Backend Team"' + (currentTeam === 'Backend Team' ? ' selected' : '') + '>Backend Team</option>' +
                                        '<option value="DevOps Team"' + (currentTeam === 'DevOps Team' ? ' selected' : '') + '>DevOps Team</option>' +
                                        '<option value="QA Team"' + (currentTeam === 'QA Team' ? ' selected' : '') + '>QA Team</option>' +
                                        '<option value="Data Team"' + (currentTeam === 'Data Team' ? ' selected' : '') + '>Data Team</option>' +
                                        '<option value="Security Team"' + (currentTeam === 'Security Team' ? ' selected' : '') + '>Security Team</option>' +
                                        '<option value="Mobile Team"' + (currentTeam === 'Mobile Team' ? ' selected' : '') + '>Mobile Team</option>' +
                                        '<option value="API Team"' + (currentTeam === 'API Team' ? ' selected' : '') + '>API Team</option>' +
                                        '<option value="Infrastructure Team"' + (currentTeam === 'Infrastructure Team' ? ' selected' : '') + '>Infrastructure Team</option>' +
                                        '<option value="Cloud Team"' + (currentTeam === 'Cloud Team' ? ' selected' : '') + '>Cloud Team</option>' +
                                    '</select>' +
                                '</div>' +
                            '</div>' +
                            
                            '<div>' +
                                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Description *</label>' +
                                '<textarea id="editDepDescription" required placeholder="Brief description of the dependency and its purpose" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; rows: 3; resize: vertical; box-sizing: border-box;">' + currentDescription + '</textarea>' +
                            '</div>' +
                            
                            '<div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;">' +
                                '<button type="button" onclick="closeEditDependencyModal()" style="background: #f3f4f6; color: #374151; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer;">Cancel</button>' +
                                '<button type="submit" style="background: #f59e0b; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer;">' +
                                    '<i class="fas fa-save" style="margin-right: 0.5rem;"></i>Update Dependency' +
                                '</button>' +
                            '</div>' +
                        '</form>' +
                    '</div>' +
                '</div>';

            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Add form submit handler
            document.getElementById('editDependencyForm').onsubmit = function(e) {
                e.preventDefault();
                submitEditedDependency();
            };
            
            // Focus first field
            setTimeout(() => {
                document.getElementById('editDepName').focus();
            }, 100);
        }

        function closeEditDependencyModal() {
            const modal = document.getElementById('editDependencyModal');
            if (modal) {
                modal.remove();
            }
        }

        function submitEditedDependency() {
            const id = document.getElementById('editDepId').value;
            const name = document.getElementById('editDepName').value.trim();
            const team = document.getElementById('editDepTeam').value;
            const description = document.getElementById('editDepDescription').value.trim();

            // Validation
            if (!name || !team || !description) {
                showNotification('❌ Please fill in all required fields', 'error');
                return;
            }

            // Find and update the row
            const row = document.querySelector('tr[data-dependency-id="' + id + '"]');
            if (!row) {
                showNotification('❌ Could not find dependency to update', 'error');
                return;
            }

            // Update the dependency name and description
            const nameDiv = row.querySelector('td:first-child div:first-child');
            const descriptionDiv = row.querySelector('td:first-child div:nth-child(2)');
            const teamCell = row.querySelector('td:nth-child(2)');
            const lastUpdatedCell = row.querySelector('td:nth-child(5)');

            if (nameDiv) nameDiv.textContent = name;
            if (descriptionDiv) descriptionDiv.textContent = description;
            if (teamCell) teamCell.textContent = team;
            if (lastUpdatedCell) lastUpdatedCell.textContent = new Date().toLocaleString();
            
            // Save to localStorage for persistence
            saveDependenciesToStorage();
            
            // Close modal and show success
            closeEditDependencyModal();
            showNotification('🎉 Dependency "' + name + '" updated successfully!', 'success');
            
            console.log('✅ Dependency updated:', { id, name, description, team });
        }

        let dependencyCounter = 13; // Track next ID for new dependencies
        
        function updateCounters() {
            const rows = document.querySelectorAll('#dependencyTableBody tr');
            let counts = {
                total: 0,
                'DONE': 0,
                'IN PROGRESS': 0,
                'BLOCKED': 0,
                'NOT STARTED': 0
            };
            
            rows.forEach(row => {
                counts.total++;
                const statusSelect = row.querySelector('select[onchange*="updateStatus"]');
                if (statusSelect) {
                    const status = statusSelect.value;
                    counts[status]++;
                }
            });
            
            document.getElementById('totalCount').textContent = counts.total;
            document.getElementById('inProgressCount').textContent = counts['IN PROGRESS'];
            document.getElementById('blockedCount').textContent = counts['BLOCKED'];
            document.getElementById('completedCount').textContent = counts['DONE'];
            document.getElementById('notStartedCount').textContent = counts['NOT STARTED'];
        }
        
        function deleteDependency(id) {
            console.log('Deleting dependency', id);
            
            // Find the row by the data-dependency-id attribute
            const rowToDelete = document.querySelector('tr[data-dependency-id="' + id + '"]');
            if (!rowToDelete) {
                showNotification('❌ Dependency not found', 'error');
                return;
            }
            
            // RBAC Check
            const createdBy = rowToDelete.getAttribute('data-created-by') || 'unknown';
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!canDeleteDependency(createdBy, currentUser.email, currentUser.role)) {
                showNotification('❌ You do not have permission to delete this dependency', 'error');
                return;
            }
            
            if (confirm('Are you sure you want to delete this dependency?')) {
                const dependencyName = rowToDelete.querySelector('div').textContent;
                rowToDelete.remove();
                updateCounters();
                
                // Save to localStorage for persistence
                saveDependenciesToStorage();
                
                showNotification('Dependency "' + dependencyName + '" deleted successfully', 'success');
            }
        }
        
        function getStatusColor(status) {
            switch(status) {
                case 'DONE': return 'background: #dcfce7; color: #15803d;';
                case 'IN PROGRESS': return 'background: #dbeafe; color: #2563eb;';
                case 'BLOCKED': return 'background: #fecaca; color: #dc2626;';
                case 'NOT STARTED': return 'background: #f3f4f6; color: #6b7280;';
                default: return 'background: #f3f4f6; color: #6b7280;';
            }
        }
        
        function getPriorityColor(priority) {
            switch(priority) {
                case 'HIGH': return 'background: #fecaca; color: #dc2626;';
                case 'MEDIUM': return 'background: #fef3c7; color: #d97706;';
                case 'LOW': return 'background: #dcfce7; color: #15803d;';
                default: return 'background: #dcfce7; color: #15803d;';
            }
        }
        
        function addNewDependency() {
            console.log('🚀 Opening Add Dependency Modal...');
            showAddDependencyModal();
        }

        function showAddDependencyModal() {
            // Create the modal HTML
            const modalHTML = 
                '<div id="addDependencyModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">' +
                    '<div style="background: white; border-radius: 12px; padding: 2rem; width: 600px; max-width: 90vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">' +
                        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">' +
                            '<h3 style="color: #1f2937; font-size: 1.25rem; font-weight: 700; margin: 0;">' +
                                '<i class="fas fa-plus-circle" style="color: #10b981; margin-right: 0.5rem;"></i>' +
                                'Add New Dependency' +
                            '</h3>' +
                            '<button onclick="closeAddDependencyModal()" style="background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; padding: 0.25rem;">&times;</button>' +
                        '</div>' +
                        
                        '<form id="addDependencyForm" style="display: grid; gap: 1.5rem;">' +
                            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Dependency Name *</label>' +
                                    '<input type="text" id="depName" required placeholder="e.g., React, Node.js, MongoDB" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                '</div>' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Team *</label>' +
                                    '<select id="depTeam" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                        '<option value="">Select Team</option>' +
                                        '<option value="Frontend Team">Frontend Team</option>' +
                                        '<option value="Backend Team">Backend Team</option>' +
                                        '<option value="DevOps Team">DevOps Team</option>' +
                                        '<option value="QA Team">QA Team</option>' +
                                        '<option value="Data Team">Data Team</option>' +
                                        '<option value="Security Team">Security Team</option>' +
                                        '<option value="Mobile Team">Mobile Team</option>' +
                                        '<option value="API Team">API Team</option>' +
                                        '<option value="Infrastructure Team">Infrastructure Team</option>' +
                                        '<option value="Cloud Team">Cloud Team</option>' +
                                    '</select>' +
                                '</div>' +
                            '</div>' +
                            
                            '<div>' +
                                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Description *</label>' +
                                '<textarea id="depDescription" required placeholder="Brief description of the dependency and its purpose" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; rows: 3; resize: vertical; box-sizing: border-box;"></textarea>' +
                            '</div>' +
                            
                            '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Status *</label>' +
                                    '<select id="depStatus" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                        '<option value="">Select Status</option>' +
                                        '<option value="NOT STARTED">Not Started</option>' +
                                        '<option value="IN PROGRESS">In Progress</option>' +
                                        '<option value="BLOCKED">Blocked</option>' +
                                        '<option value="DONE">Done</option>' +
                                    '</select>' +
                                '</div>' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Priority *</label>' +
                                    '<select id="depPriority" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                        '<option value="">Select Priority</option>' +
                                        '<option value="LOW">Low</option>' +
                                        '<option value="MEDIUM">Medium</option>' +
                                        '<option value="HIGH">High</option>' +
                                    '</select>' +
                                '</div>' +
                                '<div>' +
                                    '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Risk Level *</label>' +
                                    '<select id="depRisk" required style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                                        '<option value="">Select Risk</option>' +
                                        '<option value="LOW">Low</option>' +
                                        '<option value="MEDIUM">Medium</option>' +
                                        '<option value="HIGH">High</option>' +
                                    '</select>' +
                                '</div>' +
                            '</div>' +
                            
                            '<div>' +
                                '<label style="display: block; color: #374151; font-weight: 600; margin-bottom: 0.5rem;">Jira Ticket (Optional)</label>' +
                                '<input type="text" id="depJira" placeholder="e.g., PROJ-123, FEAT-456" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; box-sizing: border-box;">' +
                            '</div>' +
                            
                            '<div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;">' +
                                '<button type="button" onclick="closeAddDependencyModal()" style="background: #f3f4f6; color: #374151; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer;">Cancel</button>' +
                                '<button type="submit" style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer;">' +
                                    '<i class="fas fa-plus" style="margin-right: 0.5rem;"></i>Add Dependency' +
                                '</button>' +
                            '</div>' +
                        '</form>' +
                    '</div>' +
                '</div>';

            // Add modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Add form submit handler
            document.getElementById('addDependencyForm').onsubmit = function(e) {
                e.preventDefault();
                submitNewDependency();
            };
            
            // Focus first field
            setTimeout(() => {
                document.getElementById('depName').focus();
            }, 100);
        }

        function closeAddDependencyModal() {
            const modal = document.getElementById('addDependencyModal');
            if (modal) {
                modal.remove();
            }
        }

        function submitNewDependency() {
            // Get form values
            const name = document.getElementById('depName').value.trim();
            const team = document.getElementById('depTeam').value;
            const description = document.getElementById('depDescription').value.trim();
            const status = document.getElementById('depStatus').value;
            const priority = document.getElementById('depPriority').value;
            const riskLevel = document.getElementById('depRisk').value;
            const jiraTicket = document.getElementById('depJira').value.trim() || 'N/A';

            // Validation
            if (!name) {
                showNotification('❌ Dependency name is required', 'error');
                document.getElementById('depName').focus();
                return;
            }
            
            if (!team) {
                showNotification('❌ Team selection is required', 'error');
                document.getElementById('depTeam').focus();
                return;
            }
            
            if (!description) {
                showNotification('❌ Description is required', 'error');
                document.getElementById('depDescription').focus();
                return;
            }
            
            if (!status || !priority || !riskLevel) {
                showNotification('❌ Please fill in all required fields', 'error');
                return;
            }

            // Generate new dependency data
            const newId = ++dependencyCounter;
            const currentDate = new Date().toLocaleString();
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            console.log('✅ All data collected:', {
                id: newId,
                name, description, team, status, priority, riskLevel, jiraTicket,
                lastUpdated: currentDate,
                createdBy: currentUser.email || 'unknown'
            });
            
            // Create comprehensive new row HTML
            const newRowHTML = 
                '<tr style="border-bottom: 1px solid #f3f4f6;" data-dependency-id="' + newId + '" data-created-by="' + (currentUser.email || 'unknown') + '">' +
                    '<td style="padding: 1rem;">' +
                        '<div style="font-weight: 600; color: #1f2937;">' + name + '</div>' +
                        '<div style="color: #6b7280; font-size: 0.875rem;">' + description + '</div>' +
                        (jiraTicket !== 'N/A' ? '<div style="color: #3b82f6; font-size: 0.75rem; margin-top: 0.25rem;">🎫 ' + jiraTicket + '</div>' : '') +
                    '</td>' +
                    '<td style="padding: 1rem; color: #6b7280;">' + team + '</td>' +
                    '<td style="padding: 1rem;">' +
                        '<select onchange="updateStatus(' + newId + ', this.value)" style="' + getStatusColor(status) + ' border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                            '<option value="DONE"' + (status === 'DONE' ? ' selected' : '') + '>DONE</option>' +
                            '<option value="IN PROGRESS"' + (status === 'IN PROGRESS' ? ' selected' : '') + '>IN PROGRESS</option>' +
                            '<option value="BLOCKED"' + (status === 'BLOCKED' ? ' selected' : '') + '>BLOCKED</option>' +
                            '<option value="NOT STARTED"' + (status === 'NOT STARTED' ? ' selected' : '') + '>NOT STARTED</option>' +
                        '</select>' +
                    '</td>' +
                    '<td style="padding: 1rem;">' +
                        '<select onchange="updatePriority(' + newId + ', this.value)" style="' + getPriorityColor(priority) + ' border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                            '<option value="HIGH"' + (priority === 'HIGH' ? ' selected' : '') + '>HIGH</option>' +
                            '<option value="MEDIUM"' + (priority === 'MEDIUM' ? ' selected' : '') + '>MEDIUM</option>' +
                            '<option value="LOW"' + (priority === 'LOW' ? ' selected' : '') + '>LOW</option>' +
                        '</select>' +
                    '</td>' +
                    '<td style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">' + currentDate + '</td>' +
                    '<td style="padding: 1rem;">' +
                        generateActionButtons(newId, currentUser.email || 'unknown', currentUser.role || 'user') +
                    '</td>' +
                '</tr>';
            
            // Add to table with animation
            const tbody = document.getElementById('dependencyTableBody');
            tbody.insertAdjacentHTML('beforeend', newRowHTML);
            
            // Get the newly added row for animation
            const newRow = tbody.lastElementChild;
            newRow.style.backgroundColor = '#f0f9ff';
            newRow.style.transform = 'scale(0.95)';
            newRow.style.transition = 'all 0.5s ease';
            
            // Animate the new row
            setTimeout(() => {
                newRow.style.backgroundColor = 'transparent';
                newRow.style.transform = 'scale(1)';
            }, 100);
            
            // Update counters
            updateCounters();
            
            // Save to localStorage for persistence
            saveDependenciesToStorage();
            
            // Close modal and show success
            closeAddDependencyModal();
            showNotification('🎉 Dependency "' + name + '" created successfully!\\nTeam: ' + team + ' | Status: ' + status + ' | Priority: ' + priority, 'success');
            
            console.log('✅ New dependency fully created and added to table:', {
                name, description, team, status, priority, riskLevel, jiraTicket
            });
        }
        
        function getRiskColor(risk) {
            switch(risk) {
                case 'HIGH': return 'background: #fecaca; color: #dc2626;';
                case 'MEDIUM': return 'background: #fef3c7; color: #d97706;';
                case 'LOW': return 'background: #dcfce7; color: #15803d;';
                default: return 'background: #dcfce7; color: #15803d;';
            }
        }

        // Persistence functions using localStorage
        function saveDependenciesToStorage() {
            const tbody = document.getElementById('dependencyTableBody');
            if (!tbody) return;
            
            const dependencies = [];
            const rows = tbody.querySelectorAll('tr[data-dependency-id]');
            
            rows.forEach(row => {
                const id = row.getAttribute('data-dependency-id');
                const nameDiv = row.querySelector('td:first-child div:first-child');
                const descriptionDiv = row.querySelector('td:first-child div:nth-child(2)');
                const jiraDiv = row.querySelector('td:first-child div:nth-child(3)');
                const teamCell = row.querySelector('td:nth-child(2)');
                const statusSelect = row.querySelector('td:nth-child(3) select');
                const prioritySelect = row.querySelector('td:nth-child(4) select');
                const riskSpan = row.querySelector('td:nth-child(4) span');
                const lastUpdatedCell = row.querySelector('td:nth-child(5)');
                
                const dependency = {
                    id: id,
                    name: nameDiv ? nameDiv.textContent : '',
                    description: descriptionDiv ? descriptionDiv.textContent : '',
                    jiraTicket: jiraDiv ? jiraDiv.textContent.replace('🎫 ', '') : 'N/A',
                    team: teamCell ? teamCell.textContent : '',
                    status: statusSelect ? statusSelect.value : '',
                    priority: prioritySelect ? prioritySelect.value : '',
                    riskLevel: riskSpan ? riskSpan.textContent.replace('Risk: ', '') : '',
                    lastUpdated: lastUpdatedCell ? lastUpdatedCell.textContent : '',
                    createdBy: row.getAttribute('data-created-by') || 'admin@demo.com'
                };
                
                dependencies.push(dependency);
            });
            
            localStorage.setItem('dependencies', JSON.stringify(dependencies));
            console.log('📁 Dependencies saved to localStorage:', dependencies.length);
        }

        function loadDependenciesFromStorage() {
            const stored = localStorage.getItem('dependencies');
            if (stored) {
                try {
                    const dependencies = JSON.parse(stored);
                    console.log('📁 Loading dependencies from localStorage:', dependencies.length);
                    return dependencies;
                } catch (error) {
                    console.error('Error parsing stored dependencies:', error);
                    return null;
                }
            }
            return null;
        }

        function renderDependenciesFromStorage() {
            const dependencies = loadDependenciesFromStorage();
            if (!dependencies || dependencies.length === 0) {
                console.log('📁 No stored dependencies found, using default data');
                return false;
            }
            
            const tbody = document.getElementById('dependencyTableBody');
            if (!tbody) return false;
            
            // Clear existing rows
            tbody.innerHTML = '';
            
            // Find the highest ID to continue counter
            let maxId = 0;
            dependencies.forEach(dep => {
                const id = parseInt(dep.id);
                if (id > maxId) maxId = id;
            });
            dependencyCounter = maxId;
            
            // Render each dependency
            dependencies.forEach(dep => {
                const rowHTML = 
                    '<tr style="border-bottom: 1px solid #f3f4f6;" data-dependency-id="' + dep.id + '" data-created-by="' + (dep.createdBy || 'admin@demo.com') + '">' +
                        '<td style="padding: 1rem;">' +
                            '<div style="font-weight: 600; color: #1f2937;">' + dep.name + '</div>' +
                            '<div style="color: #6b7280; font-size: 0.875rem;">' + dep.description + '</div>' +
                            (dep.jiraTicket && dep.jiraTicket !== 'N/A' ? '<div style="color: #3b82f6; font-size: 0.75rem; margin-top: 0.25rem;">🎫 ' + dep.jiraTicket + '</div>' : '') +
                        '</td>' +
                        '<td style="padding: 1rem; color: #6b7280;">' + dep.team + '</td>' +
                        '<td style="padding: 1rem;">' +
                            '<select onchange="updateStatus(' + dep.id + ', this.value)" style="' + getStatusColor(dep.status) + ' border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                '<option value="DONE"' + (dep.status === 'DONE' ? ' selected' : '') + '>DONE</option>' +
                                '<option value="IN PROGRESS"' + (dep.status === 'IN PROGRESS' ? ' selected' : '') + '>IN PROGRESS</option>' +
                                '<option value="BLOCKED"' + (dep.status === 'BLOCKED' ? ' selected' : '') + '>BLOCKED</option>' +
                                '<option value="NOT STARTED"' + (dep.status === 'NOT STARTED' ? ' selected' : '') + '>NOT STARTED</option>' +
                            '</select>' +
                        '</td>' +
                        '<td style="padding: 1rem;">' +
                            '<select onchange="updatePriority(' + dep.id + ', this.value)" style="' + getPriorityColor(dep.priority) + ' border: none; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">' +
                                '<option value="HIGH"' + (dep.priority === 'HIGH' ? ' selected' : '') + '>HIGH</option>' +
                                '<option value="MEDIUM"' + (dep.priority === 'MEDIUM' ? ' selected' : '') + '>MEDIUM</option>' +
                                '<option value="LOW"' + (dep.priority === 'LOW' ? ' selected' : '') + '>LOW</option>' +
                            '</select>' +
                        '</td>' +
                        '<td style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">' + dep.lastUpdated + '</td>' +
                        '<td style="padding: 1rem;">' +
                            generateActionButtons(dep.id, dep.createdBy || 'admin@demo.com', 'loading') +
                        '</td>' +
                    '</tr>';
                
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
            
            console.log('✅ Dependencies rendered from storage');
            return true;
        }
        
        // RBAC Update Function for Existing Rows
        function updateRBACForAllRows() {
            const tbody = document.getElementById('dependencyTableBody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr[data-dependency-id]');
            rows.forEach(row => {
                const id = row.getAttribute('data-dependency-id');
                let createdBy = row.getAttribute('data-created-by');
                
                // Set default createdBy if missing (for hardcoded rows)
                if (!createdBy) {
                    createdBy = 'admin@demo.com';
                    row.setAttribute('data-created-by', createdBy);
                }
                
                // Update the actions cell with RBAC buttons
                const actionsCell = row.querySelector('td:last-child');
                if (actionsCell) {
                    actionsCell.innerHTML = generateActionButtons(id, createdBy, 'update');
                }
            });
            
            console.log('✅ RBAC applied to all dependency rows');
        }
        
        // RBAC Helper Functions
        function canEditDependency(createdBy, currentUserEmail, currentUserRole) {
            // Admin can edit all dependencies
            if (currentUserRole === 'admin') return true;
            // Users can only edit their own dependencies
            return createdBy === currentUserEmail;
        }
        
        function canDeleteDependency(createdBy, currentUserEmail, currentUserRole) {
            // Admin can delete all dependencies  
            if (currentUserRole === 'admin') return true;
            // Users can only delete their own dependencies
            return createdBy === currentUserEmail;
        }
        
        function generateActionButtons(dependencyId, createdBy, currentUserRole) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const currentUserEmail = currentUser.email || '';
            const userRole = currentUser.role || 'user';
            
            const canEdit = canEditDependency(createdBy, currentUserEmail, userRole);
            const canDelete = canDeleteDependency(createdBy, currentUserEmail, userRole);
            
            let buttonsHTML = '';
            
            if (canEdit) {
                buttonsHTML += '<button onclick="editDependency(' + dependencyId + ')" style="background: #dbeafe; color: #1d4ed8; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; margin-right: 0.5rem;">✏️ Edit</button>';
            } else {
                buttonsHTML += '<button disabled style="background: #f3f4f6; color: #9ca3af; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: not-allowed; margin-right: 0.5rem;">✏️ Edit</button>';
            }
            
            if (canDelete) {
                buttonsHTML += '<button onclick="deleteDependency(' + dependencyId + ')" style="background: #fecaca; color: #dc2626; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">🗑️ Delete</button>';
            } else {
                buttonsHTML += '<button disabled style="background: #f3f4f6; color: #9ca3af; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; cursor: not-allowed;">🗑️ Delete</button>';
            }
            
            return buttonsHTML;
        }
        
        // Search and Filter Functions
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : '';
            const teamFilter = document.getElementById('teamFilter') ? document.getElementById('teamFilter').value : '';
            const statusFilter = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value : '';
            const priorityFilter = document.getElementById('priorityFilter') ? document.getElementById('priorityFilter').value : '';
            
            const tbody = document.getElementById('dependencyTableBody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr[data-dependency-id]');
            let visibleCount = 0;
            
            rows.forEach(row => {
                let shouldShow = true;
                
                // Search term filter
                if (searchTerm) {
                    const nameDiv = row.querySelector('td:first-child div:first-child');
                    const descriptionDiv = row.querySelector('td:first-child div:nth-child(2)');
                    const teamCell = row.querySelector('td:nth-child(2)');
                    
                    const name = nameDiv ? nameDiv.textContent.toLowerCase() : '';
                    const description = descriptionDiv ? descriptionDiv.textContent.toLowerCase() : '';
                    const team = teamCell ? teamCell.textContent.toLowerCase() : '';
                    
                    if (!name.includes(searchTerm) && !description.includes(searchTerm) && !team.includes(searchTerm)) {
                        shouldShow = false;
                    }
                }
                
                // Team filter
                if (teamFilter && shouldShow) {
                    const teamCell = row.querySelector('td:nth-child(2)');
                    const team = teamCell ? teamCell.textContent.trim() : '';
                    if (team !== teamFilter) {
                        shouldShow = false;
                    }
                }
                
                // Status filter
                if (statusFilter && shouldShow) {
                    const statusSelect = row.querySelector('td:nth-child(3) select');
                    const status = statusSelect ? statusSelect.value : '';
                    if (status !== statusFilter) {
                        shouldShow = false;
                    }
                }
                
                // Priority filter
                if (priorityFilter && shouldShow) {
                    const prioritySelect = row.querySelector('td:nth-child(4) select');
                    const priority = prioritySelect ? prioritySelect.value : '';
                    if (priority !== priorityFilter) {
                        shouldShow = false;
                    }
                }
                
                // Show/hide row
                row.style.display = shouldShow ? '' : 'none';
                if (shouldShow) visibleCount++;
            });
            
            // Update counters based on visible rows only
            updateCounters();
            
            console.log('Applied filters - showing ' + visibleCount + ' out of ' + rows.length + ' dependencies');
        }
        
        function clearFilters() {
            // Clear all filter inputs
            const searchInput = document.getElementById('searchInput');
            const teamFilter = document.getElementById('teamFilter');
            const statusFilter = document.getElementById('statusFilter');
            const priorityFilter = document.getElementById('priorityFilter');
            
            if (searchInput) searchInput.value = '';
            if (teamFilter) teamFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (priorityFilter) priorityFilter.value = '';
            
            // Show all rows
            const tbody = document.getElementById('dependencyTableBody');
            if (tbody) {
                const rows = tbody.querySelectorAll('tr[data-dependency-id]');
                rows.forEach(row => {
                    row.style.display = '';
                });
            }
            
            // Update counters
            updateCounters();
            
            console.log('All filters cleared');
        }
        
        // Check for existing login on page load
        function checkExistingLogin() {
            const token = localStorage.getItem('authToken');
            const userStr = localStorage.getItem('user');
            
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    console.log('Existing login found, showing dashboard for:', user.name);
                    showDashboard(user);
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }
        }
        
        // CRITICAL: Make all dashboard functions globally accessible
        console.log('🔧 Making dashboard functions globally accessible...');
        window.showDashboard = showDashboard;
        window.logout = logout;
        window.showNotification = showNotification;
        window.updateStatus = updateStatus;
        window.updatePriority = updatePriority;
        window.editDependency = editDependency;
        window.deleteDependency = deleteDependency;
        window.updateCounters = updateCounters;
        window.addNewDependency = addNewDependency;
        window.showAddDependencyModal = showAddDependencyModal;
        // HOLISTIC: Functions already defined at top of script and made global
        window.closeAddDependencyModal = closeAddDependencyModal;
        window.submitNewDependency = submitNewDependency;
        window.showEditDependencyModal = showEditDependencyModal;
        window.closeEditDependencyModal = closeEditDependencyModal;
        window.submitEditedDependency = submitEditedDependency;
        window.saveDependenciesToStorage = saveDependenciesToStorage;
        window.loadDependenciesFromStorage = loadDependenciesFromStorage;
        window.renderDependenciesFromStorage = renderDependenciesFromStorage;
        window.applyFilters = applyFilters;
        window.clearFilters = clearFilters;
        window.canEditDependency = canEditDependency;
        window.canDeleteDependency = canDeleteDependency;
        window.generateActionButtons = generateActionButtons;
        window.updateRBACForAllRows = updateRBACForAllRows;
        window.getStatusColor = getStatusColor;
        window.getPriorityColor = getPriorityColor;
        window.getRiskColor = getRiskColor;
        window.checkExistingLogin = checkExistingLogin;
        console.log('✅ All dashboard functions are now globally accessible');
        
        // Event listeners
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('loginModal');
            if (event.target === modal) {
                closeLoginModal();
            }
        });
        
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modal = document.getElementById('loginModal');
                if (modal && modal.style.display === 'flex') {
                    closeLoginModal();
                }
            }
        });
        
        // Duplicate initialization removed - consolidated into holistic system above
        
        // Debug - log all function availability
        console.log('All functions loaded:', {
            openLoginModal: typeof openLoginModal,
            closeLoginModal: typeof closeLoginModal,
            fillAdminCredentials: typeof fillAdminCredentials,
            fillUserCredentials: typeof fillUserCredentials,
            performLogin: typeof performLogin,
            showDashboard: typeof showDashboard,
            logout: typeof logout
        });
        
        // NOW call checkExistingLogin after all functions are defined
        console.log('🎯 Calling checkExistingLogin...');
        checkExistingLogin();
        
        console.log('✅ LAUNCH APPLICATION SYSTEM FULLY LOADED!');
    </script>

</body>
</html>
`;

// Main route
app.get('/', (req, res) => {
    res.send(htmlContent);
});


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, () => {
    console.log('🚀 Dependency Management Frontend Server Started!');
    console.log('='.repeat(50));
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📱 Status: Ready to use!`);
    console.log(`🔗 Backend: http://localhost:5000`);
    console.log('='.repeat(50));
    console.log('✅ Frontend is now accessible!');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Trying to kill existing process...`);
        process.exit(1);
    }
    console.error('❌ Server error:', err);
});