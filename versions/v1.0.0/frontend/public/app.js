// Application State
let currentUser = null;

// User Session Management
function saveUser(user) {
    localStorage.setItem('depflow_user', JSON.stringify(user));
}

function loadUser() {
    const userData = localStorage.getItem('depflow_user');
    return userData ? JSON.parse(userData) : null;
}

function clearUser() {
    localStorage.removeItem('depflow_user');
}

// Dependencies Data Management
function saveDependencies() {
    localStorage.setItem('depflow_dependencies', JSON.stringify(dependencies));
}

function loadDependencies() {
    const saved = localStorage.getItem('depflow_dependencies');
    return saved ? JSON.parse(saved) : getDefaultDependencies();
}

function getDefaultDependencies() {
    return [
        {
            id: 1,
            name: 'React Framework',
            description: 'Frontend library for building user interfaces',
            team: 'Quality Flow',
            status: 'COMPLETED',
            priority: 'HIGH',
            createdBy: 'admin@demo.com',
            createdAt: new Date('2024-01-15').toISOString()
        },
        {
            id: 2,
            name: 'Node.js Backend',
            description: 'Server-side JavaScript runtime',
            team: 'Data Collection',
            status: 'IN PROGRESS',
            priority: 'MEDIUM',
            createdBy: 'admin@demo.com',
            createdAt: new Date('2024-01-10').toISOString()
        },
        {
            id: 3,
            name: 'MongoDB Database',
            description: 'NoSQL document database',
            team: 'ADAP Platform',
            status: 'NOT STARTED',
            priority: 'HIGH',
            createdBy: 'user@demo.com',
            createdAt: new Date('2024-01-20').toISOString()
        },
        {
            id: 4,
            name: 'Docker Containers',
            description: 'Containerization platform',
            team: 'Crowdgen',
            status: 'BLOCKED',
            priority: 'MEDIUM',
            createdBy: 'user@demo.com',
            createdAt: new Date('2024-01-25').toISOString()
        },
        {
            id: 5,
            name: 'Redis Cache',
            description: 'In-memory data structure store',
            team: 'Annotation Tools',
            status: 'COMPLETED',
            priority: 'LOW',
            createdBy: 'admin@demo.com',
            createdAt: new Date('2024-01-30').toISOString()
        }
    ];
}

// Initialize Application Data
function initializeApp() {
    // Load user session
    currentUser = loadUser();
    if (currentUser) {
        showDashboard();
    }
    
    // Load dependencies
    dependencies = loadDependencies();
    filteredDependencies = [...dependencies];
}

// Global Data Variables
let dependencies = [];
let filteredDependencies = [];
let activeStatusFilter = null;

// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    
    // Clear any form data
    const form = document.getElementById('loginForm');
    if (form) {
        form.reset();
    }
}

function scrollToDemo() {
    // For demo purposes, open login modal
    openLoginModal();
}

// Login Functions
function fillAdminCredentials() {
    document.getElementById('email').value = 'admin@demo.com';
    document.getElementById('password').value = 'admin123456';
}

function fillUserCredentials() {
    document.getElementById('email').value = 'user@demo.com';
    document.getElementById('password').value = 'user123456';
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Call backend login API
        const response = await fetch('http://localhost:8000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Store JWT token
            localStorage.setItem('token', result.data.tokens.accessToken);
            
            // Store user data
            currentUser = {
                email: result.data.user.email,
                name: `${result.data.user.firstName} ${result.data.user.lastName}`,
                role: result.data.user.role
            };
            
            // Persist user session
            localStorage.setItem('depflow_user', JSON.stringify(currentUser));
            
            console.log('✅ Login successful, JWT token stored');
            
            // Close modal first, then show dashboard
            closeLoginModal();
            setTimeout(() => {
                showDashboard();
            }, 100);
            
        } else {
            alert(`Login failed: ${result.message || 'Invalid credentials'}`);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your connection and try again.');
    }
}

// Dashboard Functions
function showDashboard() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('dashboardPage').classList.add('show');
    document.getElementById('userWelcome').textContent = `Welcome, ${currentUser.name}!`;
    
    updateCounters();
    renderDependencies();
}

function logout() {
    currentUser = null;
    // Clear persisted session
    localStorage.removeItem('depflow_user');
    document.getElementById('dashboardPage').classList.remove('show');
    document.getElementById('landingPage').style.display = 'block';
    
    // Ensure modal is closed
    closeLoginModal();
    
    // Clear filters
    clearAllFilters();
}

// Counter Functions
function updateCounters() {
    const total = dependencies.length;
    const completed = dependencies.filter(d => d.status === 'COMPLETED').length;
    const inProgress = dependencies.filter(d => d.status === 'IN PROGRESS').length;
    const blocked = dependencies.filter(d => d.status === 'BLOCKED').length;
    const notStarted = dependencies.filter(d => d.status === 'NOT STARTED').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('inProgressCount').textContent = inProgress;
    document.getElementById('blockedCount').textContent = blocked;
    
    // Add not started count if element exists
    const notStartedElement = document.getElementById('notStartedCount');
    if (notStartedElement) {
        notStartedElement.textContent = notStarted;
    }
}

// Filtering Functions
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const teamFilter = document.getElementById('teamFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    
    // Clear active status filter if regular filter is used
    if (statusFilter && !activeStatusFilter) {
        clearActiveStatusFilter();
    }
    
    filteredDependencies = dependencies.filter(dep => {
        const matchesSearch = !searchTerm || 
            dep.name.toLowerCase().includes(searchTerm) ||
            dep.description.toLowerCase().includes(searchTerm);
            
        const matchesTeam = !teamFilter || dep.team === teamFilter;
        const matchesStatus = !statusFilter || dep.status === statusFilter;
        const matchesPriority = !priorityFilter || dep.priority === priorityFilter;
        
        return matchesSearch && matchesTeam && matchesStatus && matchesPriority;
    });
    
    renderDependencies();
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('teamFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    
    activeStatusFilter = null;
    updateCounterVisualStates();
    
    filteredDependencies = [...dependencies];
    renderDependencies();
}

// Dependency Rendering
function renderDependencies() {
    const container = document.getElementById('dependenciesContainer');
    
    if (filteredDependencies.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No dependencies found matching the current filters.</div>';
        return;
    }
    
    container.innerHTML = filteredDependencies.map(dep => {
        const canEdit = canEditDependency(dep);
        const canDelete = canDeleteDependency(dep);
        
        return `
            <div class="dependency-row" data-id="${dep.id}">
                <div class="dependency-info">
                    <div class="dependency-name">${dep.name}</div>
                    <div class="dependency-description">${dep.description}</div>
                    <div class="dependency-meta">
                        Created by: ${dep.createdBy} • ${new Date(dep.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <div class="dependency-team">${dep.team}</div>
                <div class="dependency-status">
                    ${canEdit ? `
                        <select class="status-dropdown status-${dep.status.toLowerCase().replace(' ', '-')}" onchange="updateDependencyStatus(${dep.id}, this.value)" title="Click to change status">
                            <option value="NOT STARTED" ${dep.status === 'NOT STARTED' ? 'selected' : ''}>Not Started</option>
                            <option value="IN PROGRESS" ${dep.status === 'IN PROGRESS' ? 'selected' : ''}>In Progress</option>
                            <option value="BLOCKED" ${dep.status === 'BLOCKED' ? 'selected' : ''}>Blocked</option>
                            <option value="COMPLETED" ${dep.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                        </select>
                    ` : `
                        <span class="status-badge status-${dep.status.toLowerCase().replace(' ', '-')}">${dep.status}</span>
                    `}
                </div>
                <div class="dependency-priority">
                    ${canEdit ? `
                        <select class="priority-dropdown priority-${dep.priority.toLowerCase()}" onchange="updateDependencyPriority(${dep.id}, this.value)" title="Click to change priority">
                            <option value="HIGH" ${dep.priority === 'HIGH' ? 'selected' : ''}>High</option>
                            <option value="MEDIUM" ${dep.priority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
                            <option value="LOW" ${dep.priority === 'LOW' ? 'selected' : ''}>Low</option>
                        </select>
                    ` : `
                        <span class="priority-badge priority-${dep.priority.toLowerCase()}">${dep.priority}</span>
                    `}
                </div>
                <div class="dependency-actions">
                    ${canEdit ? `<button class="btn-edit" onclick="editDependency(${dep.id})" title="Edit dependency">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V14.5a.5.5 0 0 0 .5.5h2.793L11.207 9z"/>
                        </svg>
                    </button>` : ''}
                    ${canDelete ? `<button class="btn-delete" onclick="deleteDependency(${dep.id})" title="Delete dependency">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84L13.962 3.5H14.5a.5.5 0 0 0 0-1h-1.006a.58.58 0 0 0-.01 0H11Z"/>
                        </svg>
                    </button>` : ''}
                    ${!canEdit && !canDelete ? '<span class="no-permissions">View Only</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Initialize dropdown colors after rendering
    setTimeout(() => {
        initializeDropdownColors();
    }, 10);
}

// Dependency Management Functions
function showAddDependencyModal() {
    const modal = document.getElementById('addDependencyModal');
    // Reset form
    document.getElementById('addDependencyForm').reset();
    // Show modal
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function closeAddDependencyModal() {
    const modal = document.getElementById('addDependencyModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    // Clear form
    document.getElementById('addDependencyForm').reset();
}

function handleAddDependency(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const newDependency = {
        id: Math.max(...dependencies.map(d => d.id)) + 1,
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        team: formData.get('team'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        createdBy: currentUser.email,
        createdAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!newDependency.name || !newDependency.description || !newDependency.team) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    dependencies.push(newDependency);
    saveDependencies(); // Persist to localStorage
    updateCounters();
    applyFilters();
    closeAddDependencyModal();
    showNotification('Dependency added successfully!', 'success');
    
    // Send email notification
    sendEmailNotification('Added', newDependency, currentUser).then(result => {
        if (result.success) {
            console.log('✅ Email notification sent for new dependency');
        } else {
            console.warn('⚠️ Failed to send email notification');
        }
    });
}

function editDependency(id) {
    const dependency = dependencies.find(d => d.id === id);
    if (!dependency) {
        showNotification('Dependency not found', 'error');
        return;
    }
    
    if (!canEditDependency(dependency)) {
        showNotification('You can only edit dependencies you created', 'error');
        return;
    }
    
    // Pre-fill form with existing data
    document.getElementById('editId').value = dependency.id;
    document.getElementById('editName').value = dependency.name;
    document.getElementById('editDescription').value = dependency.description;
    document.getElementById('editTeam').value = dependency.team;
    document.getElementById('editStatus').value = dependency.status;
    document.getElementById('editPriority').value = dependency.priority;
    
    // Show modal
    const modal = document.getElementById('editDependencyModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function closeEditDependencyModal() {
    const modal = document.getElementById('editDependencyModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    // Clear form
    document.getElementById('editDependencyForm').reset();
}

function handleEditDependency(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const id = parseInt(formData.get('id'));
    
    const dependency = dependencies.find(d => d.id === id);
    if (!dependency) {
        showNotification('Dependency not found', 'error');
        return;
    }
    
    if (!canEditDependency(dependency)) {
        showNotification('You can only edit dependencies you created', 'error');
        return;
    }
    
    // Update dependency
    dependency.name = formData.get('name').trim();
    dependency.description = formData.get('description').trim();
    dependency.team = formData.get('team');
    dependency.status = formData.get('status');
    dependency.priority = formData.get('priority');
    
    // Validate required fields
    if (!dependency.name || !dependency.description || !dependency.team) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    saveDependencies(); // Persist to localStorage
    updateCounters();
    applyFilters();
    closeEditDependencyModal();
    showNotification('Dependency updated successfully!', 'success');
    
    // Send email notification
    sendEmailNotification('Updated', dependency, currentUser).then(result => {
        if (result.success) {
            console.log('✅ Email notification sent for updated dependency');
        } else {
            console.warn('⚠️ Failed to send email notification');
        }
    });
}


// RBAC Functions
function canEditDependency(dependency) {
    if (!currentUser) return false;
    return currentUser.email.includes('admin') || dependency.createdBy === currentUser.email;
}

function canDeleteDependency(dependency) {
    return canEditDependency(dependency);
}

// Inline Editing Functions
function updateDependencyStatus(id, newStatus) {
    const dependency = dependencies.find(d => d.id === id);
    if (dependency && canEditDependency(dependency)) {
        dependency.status = newStatus;
        saveDependencies(); // Persist to localStorage
        updateCounters();
        applyFilters();
        showNotification(`Status updated to ${newStatus}`, 'success');
        
        // Update dropdown color
        const dropdown = document.querySelector(`select[onchange="updateDependencyStatus(${id}, this.value)"]`);
        if (dropdown) {
            updateDropdownColor(dropdown, newStatus, 'status');
        }
        
        // Send email notification for status change
        sendEmailNotification('Status Updated', dependency, currentUser).then(result => {
            if (result.success) {
                console.log('✅ Email notification sent for status change');
            }
        });
    } else {
        showNotification('You can only edit dependencies you created', 'error');
    }
}

function updateDependencyPriority(id, newPriority) {
    const dependency = dependencies.find(d => d.id === id);
    if (dependency && canEditDependency(dependency)) {
        dependency.priority = newPriority;
        saveDependencies(); // Persist to localStorage
        applyFilters();
        showNotification(`Priority updated to ${newPriority}`, 'success');
        
        // Update dropdown color
        const dropdown = document.querySelector(`select[onchange="updateDependencyPriority(${id}, this.value)"]`);
        if (dropdown) {
            updateDropdownColor(dropdown, newPriority, 'priority');
        }
        
        // Send email notification for priority change
        sendEmailNotification('Priority Updated', dependency, currentUser).then(result => {
            if (result.success) {
                console.log('✅ Email notification sent for priority change');
            }
        });
    } else {
        showNotification('You can only edit dependencies you created', 'error');
    }
}

// Helper function to update dropdown colors
function updateDropdownColor(dropdown, value, type) {
    // Remove existing color classes
    dropdown.className = dropdown.className.replace(/\b(status|priority)-\w+/g, '');
    
    // Add new color class
    const normalizedValue = value.toLowerCase().replace(' ', '-');
    dropdown.classList.add(`${type}-dropdown`);
    dropdown.classList.add(`${type}-${normalizedValue}`);
}

// Initialize dropdown colors after rendering
function initializeDropdownColors() {
    // Status dropdowns
    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
        const value = dropdown.value;
        updateDropdownColor(dropdown, value, 'status');
        
        // Add event listener to update colors on change
        dropdown.addEventListener('change', function() {
            updateDropdownColor(this, this.value, 'status');
        });
    });
    
    // Priority dropdowns
    document.querySelectorAll('.priority-dropdown').forEach(dropdown => {
        const value = dropdown.value;
        updateDropdownColor(dropdown, value, 'priority');
        
        // Add event listener to update colors on change
        dropdown.addEventListener('change', function() {
            updateDropdownColor(this, this.value, 'priority');
        });
    });
}

function deleteDependency(id) {
    const dependency = dependencies.find(d => d.id === id);
    if (!dependency) {
        showNotification('Dependency not found', 'error');
        return;
    }
    
    if (!canDeleteDependency(dependency)) {
        showNotification('You can only delete dependencies you created', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${dependency.name}"?\n\nThis action cannot be undone.`)) {
        // Remove dependency from array
        const index = dependencies.findIndex(d => d.id === id);
        if (index > -1) {
            dependencies.splice(index, 1);
        }
        saveDependencies(); // Persist to localStorage
        updateCounters();
        applyFilters();
        showNotification('Dependency deleted successfully!', 'success');
    }
}

// Counter Filtering Functions
function filterByStatus(status) {
    // Handle total counter (clear all filters)
    if (status === null || status === 'null') {
        activeStatusFilter = null;
        document.getElementById('statusFilter').value = '';
    } else {
        // Toggle filter if same status clicked again
        if (activeStatusFilter === status) {
            activeStatusFilter = null;
            document.getElementById('statusFilter').value = '';
        } else {
            activeStatusFilter = status;
            document.getElementById('statusFilter').value = status;
        }
    }
    
    // Update counter visual states
    updateCounterVisualStates();
    applyFilters();
}

function updateCounterVisualStates() {
    const counters = document.querySelectorAll('.counter-card');
    counters.forEach(counter => {
        counter.classList.remove('active-filter');
    });
    
    if (activeStatusFilter) {
        const activeCounter = document.querySelector(`.counter-card.${getCounterClass(activeStatusFilter)}`);
        if (activeCounter) {
            activeCounter.classList.add('active-filter');
        }
    }
}

function getCounterClass(status) {
    switch(status) {
        case 'COMPLETED': return 'completed';
        case 'IN PROGRESS': return 'in-progress';
        case 'BLOCKED': return 'blocked';
        case 'NOT STARTED': return 'not-started';
        default: return 'total';
    }
}

// Clear active filter when using regular filter dropdowns
function clearActiveStatusFilter() {
    activeStatusFilter = null;
    updateCounterVisualStates();
}

// Email Notification System using Backend SMTP
async function sendEmailNotification(type, dependency, user) {
    const emailData = {
        type: type,
        dependency: {
            name: dependency.name,
            description: dependency.description,
            team: dependency.team,
            status: dependency.status,
            priority: dependency.priority
        },
        user: {
            name: user.name,
            email: user.email
        }
    };
    
    try {
        const response = await fetch('http://localhost:8000/api/v1/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            console.log('✅ Email sent successfully!', result.messageId);
            return { success: true, message: 'Email notification sent successfully' };
        } else {
            console.error('❌ Failed to send email:', result.message);
            return { success: false, message: `Failed to send email: ${result.message}` };
        }
        
    } catch (error) {
        console.error('❌ Network error sending email:', error);
        return { success: false, message: `Network error: ${error.message}` };
    }
}

// Alternative Gmail SMTP approach (requires backend)
async function sendEmailNotificationSMTP(type, dependency, user) {
    // This is an example of what the email data structure should look like
    // for a backend SMTP implementation
    
    const emailData = {
        to: 'mmahipal.reddy@gmail.com',
        from: 'mahipal.appen@gmail.com',
        subject: `DepFlow: Dependency ${type} - ${dependency.name}`,
        html: `
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
                        <p><strong>Status:</strong> <span style="background: #${getStatusColor(dependency.status)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${dependency.status}</span></p>
                        <p><strong>Priority:</strong> <span style="background: #${getPriorityColor(dependency.priority)}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${dependency.priority}</span></p>
                        <p><strong>Action performed by:</strong> ${user.name} (${user.email})</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
                <div style="background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
                    This is an automated notification from DepFlow Dependency Management System
                </div>
            </div>
        `
    };
    
    try {
        // This would require a backend API endpoint to send emails via SMTP
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        if (response.ok) {
            console.log('✅ Email sent successfully via SMTP!');
            return { success: true, message: 'Email notification sent successfully' };
        } else {
            throw new Error('Failed to send email via backend');
        }
        
    } catch (error) {
        console.error('❌ Failed to send email via SMTP:', error);
        return { success: false, message: `Failed to send email: ${error.message}` };
    }
}

// Enhanced helper functions for email styling with lighter colors
function getStatusColor(status) {
    switch(status) {
        case 'COMPLETED': return '22c55e';      // Light green
        case 'IN PROGRESS': return '0ea5e9';    // Light blue
        case 'BLOCKED': return 'f56565';        // Light red
        case 'NOT STARTED': return '71717a';    // Light slate
        default: return '71717a';
    }
}

function getPriorityColor(priority) {
    switch(priority) {
        case 'HIGH': return 'f56565';           // Light red
        case 'MEDIUM': return 'fbbf24';         // Light amber
        case 'LOW': return '22c55e';            // Light emerald
        default: return '71717a';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app data and user session first
    initializeApp();
    
    // Update UI if user is logged in
    if (currentUser) {
        updateCounters();
        applyFilters();
    }
    
    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const loginModal = document.getElementById('loginModal');
        const addModal = document.getElementById('addDependencyModal');
        const editModal = document.getElementById('editDependencyModal');
        
        if (event.target === loginModal) {
            closeLoginModal();
        } else if (event.target === addModal) {
            closeAddDependencyModal();
        } else if (event.target === editModal) {
            closeEditDependencyModal();
        }
    };
    
    // Ensure all modals start hidden
    const loginModal = document.getElementById('loginModal');
    const addModal = document.getElementById('addDependencyModal');
    const editModal = document.getElementById('editDependencyModal');
    
    [loginModal, addModal, editModal].forEach(modal => {
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    });
    
    // Add ESC key handler to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeLoginModal();
            closeAddDependencyModal();
            closeEditDependencyModal();
        }
    });
});

// Export functions for robot framework testing
window.DepFlow = {
    openLoginModal,
    closeLoginModal,
    fillAdminCredentials,
    fillUserCredentials,
    handleLogin,
    logout,
    showAddDependencyModal,
    closeAddDependencyModal,
    editDependency,
    closeEditDependencyModal,
    deleteDependency,
    updateDependencyStatus,
    updateDependencyPriority,
    filterByStatus,
    applyFilters,
    clearAllFilters,
    showDashboard,
    updateCounters
};
