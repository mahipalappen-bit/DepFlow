const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Add basic middleware
app.use(express.static('public'));

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
            margin-bottom: 2.5rem;
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
            font-weight: 600;
            font-size: 1rem;
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
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
            border-radius: 8px;
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
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .credential-value {
            font-family: 'Monaco', 'Menlo', monospace;
            color: var(--gray-900);
            background: var(--gray-100);
            padding: 0.5rem;
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
            color: var(--gray-300);
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
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            padding: 2.5rem;
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
            border: 2px solid var(--gray-200);
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
            padding: 0.625rem 1rem;
            background: var(--gray-50);
            border: 2px solid var(--gray-200);
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
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
            border: 2px solid var(--gray-300);
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
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .btn-login:hover {
            background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        @media (max-width: 768px) {
            .hero-section h2 { font-size: 1.8rem; }
            .dashboard-grid { grid-template-columns: 1fr; padding: 0 1rem; }
            .credentials-grid { grid-template-columns: 1fr; }
            .hero-actions { flex-direction: column; align-items: center; }
            .modal-content { margin: 1rem; width: calc(100% - 2rem); }
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
            <button class="btn-primary btn-large" onclick="console.log('DIRECT ONCLICK CALLED'); window.showLoginModal ? window.showLoginModal() : alert('showLoginModal not found');">
                <i class="fas fa-sign-in-alt"></i>
                Launch Application
            </button>
            <button class="btn-secondary btn-large" onclick="console.log('CREDENTIALS CLICKED'); window.scrollToCredentials ? window.scrollToCredentials() : alert('scrollToCredentials not found');">
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
                <button class="btn-primary" onclick="window.showLoginModal()">
                    <i class="fas fa-sign-in-alt"></i>
                    Quick Login
                </button>
                <button class="btn-secondary" onclick="window.scrollToTop()">
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
                    <div class="status-value">1,247</div>
                    <div class="status-label">Dependencies</div>
                </div>
                <div class="status-item">
                    <div class="status-value">10</div>
                    <div class="status-label">Teams</div>
                </div>
                <div class="status-item">
                    <div class="status-value">45</div>
                    <div class="status-label">Updates</div>
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
            
            <form class="login-form" onsubmit="window.performLogin(event)">
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
                    <button type="button" class="quick-btn" onclick="console.log('ADMIN ONCLICK'); window.fillAdminCredentials ? window.fillAdminCredentials() : alert('fillAdminCredentials not found');">
                        <i class="fas fa-user-shield"></i> Admin
                    </button>
                    <button type="button" class="quick-btn" onclick="console.log('USER ONCLICK'); window.fillUserCredentials ? window.fillUserCredentials() : alert('fillUserCredentials not found');">
                        <i class="fas fa-user"></i> Team Member
                    </button>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="console.log('CANCEL ONCLICK'); window.hideLoginModal ? window.hideLoginModal() : alert('hideLoginModal not found');">Cancel</button>
                    <button type="submit" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // IMMEDIATE FUNCTION LOADING - NO DELAYS
        console.log('🚀 IMMEDIATE SCRIPT EXECUTION STARTING...');
        
        // Define and immediately assign all functions to global scope
        window.showLoginModal = function() {
            console.log('🔍 showLoginModal called');
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                console.log('✅ Modal shown');
                // Focus email field
                setTimeout(function() {
                    const email = document.getElementById('email');
                    if (email) email.focus();
                }, 100);
            } else {
                console.error('❌ Modal not found');
                alert('Modal not found - please refresh page');
            }
        };
        
        window.hideLoginModal = function() {
            console.log('🔍 hideLoginModal called');
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                console.log('✅ Modal hidden');
            }
        };
        
        window.fillAdminCredentials = function() {
            console.log('🔍 fillAdminCredentials called');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            if (email && password) {
                email.value = 'admin@demo.com';
                password.value = 'admin123456';
                console.log('✅ Admin credentials filled');
            } else {
                console.error('❌ Form fields not found');
                alert('Form fields not found');
            }
        };
        
        window.fillUserCredentials = function() {
            console.log('🔍 fillUserCredentials called');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            if (email && password) {
                email.value = 'user@demo.com';
                password.value = 'user123456';
                console.log('✅ User credentials filled');
            } else {
                console.error('❌ Form fields not found');
                alert('Form fields not found');
            }
        };
        
        window.scrollToCredentials = function() {
            console.log('🔍 scrollToCredentials called');
            const card = document.getElementById('credentials-card');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('✅ Scrolled to credentials');
            } else {
                console.error('❌ Credentials card not found');
            }
        };
        
        window.scrollToTop = function() {
            console.log('🔍 scrollToTop called');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('✅ Scrolled to top');
        };
        
        window.performLogin = function(event) {
            event.preventDefault();
            console.log('🔍 performLogin called');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple demo login
            if ((email === 'admin@demo.com' && password === 'admin123456') || 
                (email === 'user@demo.com' && password === 'user123456')) {
                
                alert('Login successful! (Demo mode - full dashboard would appear here)');
                window.hideLoginModal();
                console.log('✅ Login successful');
            } else {
                alert('Invalid credentials. Please use the demo credentials.');
            }
        };
        
        // Test function for debugging
        window.testModal = function() { 
            console.log('🧪 Test modal called');
            window.showLoginModal(); 
        };
        
        // Test function availability immediately
        console.log('🧪 Function availability test:');
        console.log('- showLoginModal:', typeof window.showLoginModal);
        console.log('- hideLoginModal:', typeof window.hideLoginModal);
        console.log('- fillAdminCredentials:', typeof window.fillAdminCredentials);
        console.log('- fillUserCredentials:', typeof window.fillUserCredentials);
        console.log('- scrollToCredentials:', typeof window.scrollToCredentials);
        console.log('- performLogin:', typeof window.performLogin);
        
        console.log('✅ ALL FUNCTIONS LOADED IMMEDIATELY AND GLOBALLY ACCESSIBLE!');
        
        // Page load animations
        window.onload = function() {
            console.log('🔄 Page loaded - animations starting');
            
            // Animate cards on load
            const cards = document.querySelectorAll('.enterprise-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            console.log('✅ Page animations complete');
        };
        
        // Close modal when clicking outside
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('loginModal');
            if (event.target === modal) {
                window.hideLoginModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modal = document.getElementById('loginModal');
                if (modal && modal.style.display === 'block') {
                    window.hideLoginModal();
                }
            }
        });
        
        console.log('🎯 ALL SYSTEMS READY - TEST YOUR BUTTONS NOW!');
        
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


