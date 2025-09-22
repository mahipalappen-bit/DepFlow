const express = require('express');
const app = express();
const PORT = 3000;

const completeHTML = `
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
            top: 1.5rem;
            right: 2rem;
            z-index: 1010;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 1rem 1.5rem;
            display: flex !important;
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
        .status-done { background: #dcfce7; color: #15803d; }
        
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
        <!-- Dashboard Header Title at Top -->
        <div class="dashboard-header">
            <div class="header-content">
                <div class="title-section">
                    <h1 class="dashboard-title">
                        <i class="fas fa-cubes"></i>
                        Enterprise Dependency Management Platform
                    </h1>
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
                    <div class="counter-card">
                        <div class="counter-value" id="totalCount" style="color: #3b82f6;">0</div>
                        <div class="counter-label">Total Dependencies</div>
                    </div>
                    <div class="counter-card">
                        <div class="counter-value" id="inProgressCount" style="color: #d97706;">0</div>
                        <div class="counter-label">In Progress</div>
                    </div>
                    <div class="counter-card">
                        <div class="counter-value" id="blockedCount" style="color: #dc2626;">0</div>
                        <div class="counter-label">Blocked</div>
                    </div>
                    <div class="counter-card">
                        <div class="counter-value" id="doneCount" style="color: #15803d;">0</div>
                        <div class="counter-label">Completed</div>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="main-content">
                <div class="content-header">
                    <h2 class="content-title">Dependency Management</h2>
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
                            <option value="Frontend Team">Frontend Team</option>
                            <option value="Backend Team">Backend Team</option>
                            <option value="DevOps Team">DevOps Team</option>
                            <option value="QA Team">QA Team</option>
                            <option value="Data Team">Data Team</option>
                        </select>
                        <select id="statusFilter" class="filter-select" onchange="applyFilters()">
                            <option value="">All Status</option>
                            <option value="NOT STARTED">Not Started</option>
                            <option value="IN PROGRESS">In Progress</option>
                            <option value="BLOCKED">Blocked</option>
                            <option value="DONE">Done</option>
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

    <!-- Add/Edit Modal -->
    <div id="addEditModal" class="login-modal">
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3 id="modalTitle"><i class="fas fa-plus"></i> Add New Dependency</h3>
                <p>Enter dependency details</p>
            </div>
            
            <form id="dependencyForm" onsubmit="saveDependency(event)">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" id="depName" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" id="depDescription" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Team</label>
                    <select id="depTeam" class="form-input" required>
                        <option value="">Select Team</option>
                        <option value="Frontend Team">Frontend Team</option>
                        <option value="Backend Team">Backend Team</option>
                        <option value="DevOps Team">DevOps Team</option>
                        <option value="QA Team">QA Team</option>
                        <option value="Data Team">Data Team</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select id="depStatus" class="form-input" required>
                        <option value="NOT STARTED">Not Started</option>
                        <option value="IN PROGRESS">In Progress</option>
                        <option value="BLOCKED">Blocked</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select id="depPriority" class="form-input" required>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="closeAddEditModal()">Cancel</button>
                    <button type="submit" class="btn-login">
                        <i class="fas fa-save"></i> Save
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
            console.log('Showing dashboard for:', user.name);
            currentUser = user;
            
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
                { id: 1, name: 'React', description: 'Frontend JavaScript library', team: 'Frontend Team', status: 'IN PROGRESS', priority: 'HIGH', lastUpdated: '2 days ago', createdBy: 'admin@demo.com' },
                { id: 2, name: 'Express.js', description: 'Backend Node.js framework', team: 'Backend Team', status: 'DONE', priority: 'MEDIUM', lastUpdated: '1 week ago', createdBy: 'admin@demo.com' },
                { id: 3, name: 'MongoDB', description: 'NoSQL database', team: 'Backend Team', status: 'BLOCKED', priority: 'HIGH', lastUpdated: '3 days ago', createdBy: 'admin@demo.com' },
                { id: 4, name: 'Jest', description: 'JavaScript testing framework', team: 'QA Team', status: 'NOT STARTED', priority: 'LOW', lastUpdated: '1 day ago', createdBy: 'user@demo.com' },
                { id: 5, name: 'Docker', description: 'Containerization platform', team: 'DevOps Team', status: 'IN PROGRESS', priority: 'MEDIUM', lastUpdated: '4 days ago', createdBy: 'admin@demo.com' }
            ];
        }
        
        // Load dependencies
        function loadDependencies() {
            var stored = localStorage.getItem('dependencies');
            if (stored) {
                dependencies = JSON.parse(stored);
            } else {
                dependencies = getDefaultDependencies();
                saveDependencies();
            }
            renderDependencies();
        }
        
        // Save dependencies
        function saveDependencies() {
            localStorage.setItem('dependencies', JSON.stringify(dependencies));
        }
        
        // Render dependencies table
        function renderDependencies() {
            var tbody = document.getElementById('dependencyTableBody');
            tbody.innerHTML = '';
            
            dependencies.forEach(function(dep) {
                var canEdit = canEditDependency(dep.createdBy);
                var canDelete = canDeleteDependency(dep.createdBy);
                
                var row = document.createElement('tr');
                row.setAttribute('data-dependency-id', dep.id);
                row.innerHTML = 
                    '<td><div class="dependency-name">' + dep.name + '</div><div class="dependency-desc">' + dep.description + '</div></td>' +
                    '<td>' + dep.team + '</td>' +
                    '<td><select class="status-select status-' + dep.status.toLowerCase().replace(' ', '-') + '" onchange="updateStatus(' + dep.id + ', this.value)">' +
                        '<option value="NOT STARTED"' + (dep.status === 'NOT STARTED' ? ' selected' : '') + '>Not Started</option>' +
                        '<option value="IN PROGRESS"' + (dep.status === 'IN PROGRESS' ? ' selected' : '') + '>In Progress</option>' +
                        '<option value="BLOCKED"' + (dep.status === 'BLOCKED' ? ' selected' : '') + '>Blocked</option>' +
                        '<option value="DONE"' + (dep.status === 'DONE' ? ' selected' : '') + '>Done</option>' +
                    '</select></td>' +
                    '<td><select class="priority-select priority-' + dep.priority.toLowerCase() + '" onchange="updatePriority(' + dep.id + ', this.value)">' +
                        '<option value="HIGH"' + (dep.priority === 'HIGH' ? ' selected' : '') + '>High</option>' +
                        '<option value="MEDIUM"' + (dep.priority === 'MEDIUM' ? ' selected' : '') + '>Medium</option>' +
                        '<option value="LOW"' + (dep.priority === 'LOW' ? ' selected' : '') + '>Low</option>' +
                    '</select></td>' +
                    '<td>' + dep.lastUpdated + '</td>' +
                    '<td>' +
                        '<button class="btn-edit" onclick="editDependency(' + dep.id + ')" ' + (canEdit ? '' : 'disabled') + '>✏️ Edit</button>' +
                        '<button class="btn-delete" onclick="deleteDependency(' + dep.id + ')" ' + (canDelete ? '' : 'disabled') + '>🗑️ Delete</button>' +
                    '</td>';
                
                tbody.appendChild(row);
            });
            
            updateCounters();
        }
        
        // RBAC functions
        function canEditDependency(createdBy) {
            if (!currentUser) return false;
            return currentUser.role === 'admin' || createdBy === currentUser.email;
        }
        
        function canDeleteDependency(createdBy) {
            if (!currentUser) return false;
            return currentUser.role === 'admin' || createdBy === currentUser.email;
        }
        
        // Update counters
        function updateCounters() {
            var visibleRows = document.querySelectorAll('#dependencyTableBody tr[style=""]');
            if (visibleRows.length === 0) {
                visibleRows = document.querySelectorAll('#dependencyTableBody tr');
            }
            
            var total = visibleRows.length;
            var inProgress = 0, blocked = 0, done = 0;
            
            visibleRows.forEach(function(row) {
                var statusSelect = row.querySelector('.status-select');
                if (statusSelect) {
                    var status = statusSelect.value;
                    if (status === 'IN PROGRESS') inProgress++;
                    else if (status === 'BLOCKED') blocked++;
                    else if (status === 'DONE') done++;
                }
            });
            
            document.getElementById('totalCount').textContent = total;
            document.getElementById('inProgressCount').textContent = inProgress;
            document.getElementById('blockedCount').textContent = blocked;
            document.getElementById('doneCount').textContent = done;
        }
        
        // Update status
        function updateStatus(id, newStatus) {
            var dep = dependencies.find(function(d) { return d.id === id; });
            if (dep && canEditDependency(dep.createdBy)) {
                dep.status = newStatus;
                dep.lastUpdated = 'Just now';
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
            var dep = dependencies.find(function(d) { return d.id === id; });
            if (dep && canEditDependency(dep.createdBy)) {
                dep.priority = newPriority;
                dep.lastUpdated = 'Just now';
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
            document.getElementById('dependencyForm').reset();
            document.getElementById('addEditModal').style.display = 'flex';
        }
        
        // Edit dependency
        function editDependency(id) {
            var dep = dependencies.find(function(d) { return d.id === id; });
            if (!dep || !canEditDependency(dep.createdBy)) {
                showNotification('You can only edit dependencies you created', 'error');
                return;
            }
            
            editingId = id;
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Dependency';
            document.getElementById('depName').value = dep.name;
            document.getElementById('depDescription').value = dep.description;
            document.getElementById('depTeam').value = dep.team;
            document.getElementById('depStatus').value = dep.status;
            document.getElementById('depPriority').value = dep.priority;
            document.getElementById('addEditModal').style.display = 'flex';
        }
        
        // Close add/edit modal
        function closeAddEditModal() {
            document.getElementById('addEditModal').style.display = 'none';
            editingId = null;
        }
        
        // Save dependency
        function saveDependency(event) {
            event.preventDefault();
            
            var name = document.getElementById('depName').value;
            var description = document.getElementById('depDescription').value;
            var team = document.getElementById('depTeam').value;
            var status = document.getElementById('depStatus').value;
            var priority = document.getElementById('depPriority').value;
            
            if (editingId) {
                var dep = dependencies.find(function(d) { return d.id === editingId; });
                if (dep) {
                    dep.name = name;
                    dep.description = description;
                    dep.team = team;
                    dep.status = status;
                    dep.priority = priority;
                    dep.lastUpdated = 'Just now';
                    showNotification('Dependency updated successfully');
                }
            } else {
                var newId = Math.max(...dependencies.map(d => d.id), 0) + 1;
                dependencies.push({
                    id: newId,
                    name: name,
                    description: description,
                    team: team,
                    status: status,
                    priority: priority,
                    lastUpdated: 'Just now',
                    createdBy: currentUser.email
                });
                showNotification('Dependency added successfully');
            }
            
            saveDependencies();
            renderDependencies();
            closeAddEditModal();
        }
        
        // Delete dependency
        function deleteDependency(id) {
            var dep = dependencies.find(function(d) { return d.id === id; });
            if (!dep || !canDeleteDependency(dep.createdBy)) {
                showNotification('You can only delete dependencies you created', 'error');
                return;
            }
            
            if (confirm('Are you sure you want to delete this dependency?')) {
                dependencies = dependencies.filter(function(d) { return d.id !== id; });
                saveDependencies();
                renderDependencies();
                showNotification('Dependency deleted successfully');
            }
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
                
                if (matchesSearch && matchesTeam && matchesStatus && matchesPriority) {
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
        window.saveDependency = saveDependency;
        window.deleteDependency = deleteDependency;
        window.applyFilters = applyFilters;
        window.clearFilters = clearFilters;
        
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

app.get('/', (req, res) => {
    res.send(completeHTML);
});

app.listen(PORT, () => {
    console.log(`🚀 Complete Dependency Management System running at http://localhost:${PORT}`);
    console.log('✅ Full Features: Login, Dashboard, CRUD, Search, Filtering, RBAC, Data Persistence');
});
