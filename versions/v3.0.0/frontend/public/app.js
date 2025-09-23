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

// Registration Modal Functions
function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    
    // Clear any form data
    const form = document.getElementById('registerForm');
    if (form) {
        form.reset();
    }
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

async function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    try {
        // Call backend registration API
        const response = await fetch('http://localhost:8000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            }),
        });

        const data = await response.json();

        if (data.success) {
            // Registration successful
            currentUser = data.data.user;
            localStorage.setItem('depflow_user', JSON.stringify(currentUser));
            localStorage.setItem('token', data.data.tokens.accessToken);
            
            closeRegisterModal();
            showDashboard();
            showNotification('Account created successfully! Welcome to DepFlow!', 'success');
        } else {
            // Registration failed
            showNotification(`Registration failed: ${data.error.message}`, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please check your connection and try again.', 'error');
    }
}

// Documentation Function
function openDocumentation() {
    // Open the user documentation in a new window/tab
    window.open('docs/DepFlow_User_Documentation.html', '_blank');
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
    const landingPage = document.getElementById('landingPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const userPanel = document.getElementById('userPanel');
    const userWelcome = document.getElementById('userWelcome');
    
    if (landingPage) {
        landingPage.style.display = 'none';
    }
    
    if (dashboardPage) {
        dashboardPage.classList.add('show');
        dashboardPage.style.display = 'block';
    }
    
    if (userPanel) {
        userPanel.style.display = 'block';
    }
    
    if (userWelcome && currentUser) {
        const displayName = currentUser.firstName || currentUser.name || 'User';
        userWelcome.innerHTML = `Welcome, ${displayName}!<br><small>${currentUser.email}</small>`;
    }
    
    updateCounters();
    renderDependencies();
}

function logout() {
    currentUser = null;
    // Clear persisted session
    localStorage.removeItem('depflow_user');
    localStorage.removeItem('token');
    
    // Hide dashboard and user panel explicitly
    const dashboardPage = document.getElementById('dashboardPage');
    const userPanel = document.getElementById('userPanel');
    const landingPage = document.getElementById('landingPage');
    
    if (dashboardPage) {
        dashboardPage.classList.remove('show');
        dashboardPage.style.display = 'none';
    }
    
    if (userPanel) {
        userPanel.style.display = 'none';
    }
    
    if (landingPage) {
        landingPage.style.display = 'block';
    }
    
    // Ensure modal is closed
    closeLoginModal();
    
    // Clear filters
    clearAllFilters();
}

// Sorting Variables
let currentSort = { column: null, direction: 'asc' };

// Sorting Functions
function sortTable(column) {
    // Toggle sort direction if same column clicked, otherwise default to ascending
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    // Update visual indicators
    updateSortIndicators(column, currentSort.direction);
    
    // Sort the filtered dependencies
    filteredDependencies.sort((a, b) => {
        let valueA, valueB;
        
        switch (column) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'team':
                valueA = a.team.toLowerCase();
                valueB = b.team.toLowerCase();
                break;
            case 'status':
                // Custom order for status
                const statusOrder = { 'NOT STARTED': 0, 'IN PROGRESS': 1, 'BLOCKED': 2, 'COMPLETED': 3 };
                valueA = statusOrder[a.status];
                valueB = statusOrder[b.status];
                break;
            case 'priority':
                // Custom order for priority
                const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
                valueA = priorityOrder[a.priority];
                valueB = priorityOrder[b.priority];
                break;
            case 'createdBy':
                valueA = a.createdBy.toLowerCase();
                valueB = b.createdBy.toLowerCase();
                break;
            case 'date':
                valueA = new Date(a.createdAt);
                valueB = new Date(b.createdAt);
                break;
            default:
                return 0;
        }
        
        // Handle comparison for different data types
        if (valueA < valueB) {
            return currentSort.direction === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
            return currentSort.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    // Re-render the table
    renderDependencies();
}

function updateSortIndicators(activeColumn, direction) {
    // Remove all existing sort classes
    document.querySelectorAll('.table-header .sortable').forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add the appropriate class to the active column
    const activeHeader = document.querySelector(`.table-header .sortable[data-sort="${activeColumn}"]`);
    if (activeHeader) {
        activeHeader.classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
    }
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
    
    // Re-apply current sort if any
    if (currentSort.column) {
        sortTable(currentSort.column);
    } else {
        renderDependencies();
    }
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('teamFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    
    activeStatusFilter = null;
    updateCounterVisualStates();
    
    filteredDependencies = [...dependencies];
    
    // Re-apply current sort if any
    if (currentSort.column) {
        sortTable(currentSort.column);
    } else {
        renderDependencies();
    }
}

// Dependency Rendering
function renderDependencies() {
    const container = document.getElementById('dependenciesContainer');
    
    if (filteredDependencies.length === 0) {
        container.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.9rem;">No dependencies found matching the current filters.</div>';
        return;
    }
    
    container.innerHTML = filteredDependencies.map(dep => {
        const createdDate = new Date(dep.createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        const formattedTime = createdDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
        
        return `
            <div class="dependency-row" data-id="${dep.id}">
                <div class="dependency-name" title="${dep.name}">${dep.name}</div>
                <div class="dependency-description" title="${dep.description}">${dep.description}</div>
                <div class="dependency-team">${dep.team}</div>
                <div class="dependency-status">
                    <span class="status-indicator status-${dep.status.toLowerCase().replace(' ', '-')}"></span>
                    <select class="status-dropdown" onchange="updateDependencyStatus(${dep.id}, this.value)" title="Click to change status">
                        <option value="NOT STARTED" ${dep.status === 'NOT STARTED' ? 'selected' : ''}>Not Started</option>
                        <option value="IN PROGRESS" ${dep.status === 'IN PROGRESS' ? 'selected' : ''}>In Progress</option>
                        <option value="BLOCKED" ${dep.status === 'BLOCKED' ? 'selected' : ''}>Blocked</option>
                        <option value="COMPLETED" ${dep.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
                <div class="dependency-priority">
                    <span class="priority-indicator priority-${dep.priority.toLowerCase()}"></span>
                    <select class="priority-dropdown" onchange="updateDependencyPriority(${dep.id}, this.value)" title="Click to change priority">
                        <option value="HIGH" ${dep.priority === 'HIGH' ? 'selected' : ''}>High</option>
                        <option value="MEDIUM" ${dep.priority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
                        <option value="LOW" ${dep.priority === 'LOW' ? 'selected' : ''}>Low</option>
                    </select>
                </div>
                <div class="dependency-created-by" title="${dep.createdBy}">${dep.createdBy.split('@')[0]}</div>
                <div class="dependency-date" title="${formattedDate} at ${formattedTime}">
                    <div class="date-part">${formattedDate}</div>
                    <div class="time-part">${formattedTime}</div>
                </div>
                <div class="dependency-actions">
                    <button class="btn-edit" onclick="editDependency(${dep.id})" title="Edit dependency">✏️</button>
                    <button class="btn-delete" onclick="deleteDependency(${dep.id})" title="Delete dependency">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Update visual indicators after rendering
    updateVisualIndicators();
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

// Legacy handleAddDependency function removed - now handled by addEventListener in initializeApp()

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

// Legacy handleEditDependency function removed - now handled by addEventListener in initializeApp()


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
        
        // Update visual indicator
        const dropdown = document.querySelector(`select[onchange="updateDependencyStatus(${id}, this.value)"]`);
        if (dropdown) {
            const row = dropdown.closest('.dependency-row');
            const indicator = row.querySelector('.status-indicator');
            if (indicator) {
                // Remove all status classes
                indicator.className = indicator.className.replace(/status-\w+(-\w+)*/g, '');
                indicator.classList.add('status-indicator');
                // Add new status class
                const status = newStatus.toLowerCase().replace(' ', '-');
                indicator.classList.add(`status-${status}`);
            }
        }
        
        // Send email notification for status change
        sendEmailNotification('Status Updated', dependency, currentUser).then(result => {
            if (result.success) {
                console.log('✅ Email notification sent for status change');
            }
        });
    } else {
        showNotification('You can only edit dependencies you created', 'error');
        // Revert dropdown selection
        const dropdown = document.querySelector(`select[onchange="updateDependencyStatus(${id}, this.value)"]`);
        if (dropdown) dropdown.value = dependency.status;
    }
}

function updateDependencyPriority(id, newPriority) {
    const dependency = dependencies.find(d => d.id === id);
    if (dependency && canEditDependency(dependency)) {
        dependency.priority = newPriority;
        saveDependencies(); // Persist to localStorage
        applyFilters();
        showNotification(`Priority updated to ${newPriority}`, 'success');
        
        // Update visual indicator
        const dropdown = document.querySelector(`select[onchange="updateDependencyPriority(${id}, this.value)"]`);
        if (dropdown) {
            const row = dropdown.closest('.dependency-row');
            const indicator = row.querySelector('.priority-indicator');
            if (indicator) {
                // Remove all priority classes
                indicator.className = indicator.className.replace(/priority-\w+/g, '');
                indicator.classList.add('priority-indicator');
                // Add new priority class
                const priority = newPriority.toLowerCase();
                indicator.classList.add(`priority-${priority}`);
            }
        }
        
        // Send email notification for priority change
        sendEmailNotification('Priority Updated', dependency, currentUser).then(result => {
            if (result.success) {
                console.log('✅ Email notification sent for priority change');
            }
        });
    } else {
        showNotification('You can only edit dependencies you created', 'error');
        // Revert dropdown selection
        const dropdown = document.querySelector(`select[onchange="updateDependencyPriority(${id}, this.value)"]`);
        if (dropdown) dropdown.value = dependency.priority;
    }
}

// Visual Indicators Management
function updateVisualIndicators() {
    // Add change listeners to status dropdowns
    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const row = this.closest('.dependency-row');
            const indicator = row.querySelector('.status-indicator');
            if (indicator) {
                // Remove all status classes
                indicator.className = indicator.className.replace(/status-\w+(-\w+)*/g, '');
                indicator.classList.add('status-indicator');
                // Add new status class
                const status = this.value.toLowerCase().replace(' ', '-');
                indicator.classList.add(`status-${status}`);
            }
        });
    });

    // Add change listeners to priority dropdowns
    document.querySelectorAll('.priority-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const row = this.closest('.dependency-row');
            const indicator = row.querySelector('.priority-indicator');
            if (indicator) {
                // Remove all priority classes
                indicator.className = indicator.className.replace(/priority-\w+/g, '');
                indicator.classList.add('priority-indicator');
                // Add new priority class
                const priority = this.value.toLowerCase();
                indicator.classList.add(`priority-${priority}`);
            }
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

// Test Mode Authentication Functions (for Robot Framework)
function testModeLogin(userType = 'admin') {
    // Clear any existing state
    localStorage.clear();
    sessionStorage.clear();
    
    // Close all modals immediately
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    // Set up user based on type
    const users = {
        admin: {
            email: 'admin@demo.com',
            name: 'Admin User',
            role: 'admin'
        },
        user: {
            email: 'user@demo.com', 
            name: 'Regular User',
            role: 'user'
        }
    };
    
    const user = users[userType] || users.admin;
    
    // Set authentication state
    currentUser = user;
    localStorage.setItem('depflow_user', JSON.stringify(user));
    localStorage.setItem('token', 'test-jwt-token-' + Date.now());
    
    // Load dependencies if not already loaded
    if (!dependencies || dependencies.length === 0) {
        dependencies = loadDependencies();
        filteredDependencies = [...dependencies];
    }
    
    // Force show dashboard with proper visibility
    const landingPage = document.getElementById('landingPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const userPanel = document.getElementById('userPanel');
    const userWelcome = document.getElementById('userWelcome');
    
    if (landingPage) {
        landingPage.style.display = 'none';
        landingPage.style.visibility = 'hidden';
    }
    
    if (dashboardPage) {
        dashboardPage.classList.add('show');
        dashboardPage.style.display = 'block';
    }
    
    if (userPanel) {
        userPanel.style.display = 'block';
    }
    
    if (userWelcome) {
        userWelcome.textContent = `Welcome, ${user.name}!`;
    }
    
    // Update counters and render dependencies
    setTimeout(() => {
        updateCounters();
        renderDependencies();
        applyFilters();
    }, 100);
    
    console.log(`🧪 Test Mode: Logged in as ${user.name} (${user.role})`);
    return user;
}

function testModeLogout() {
    // Clear authentication state
    currentUser = null;
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset UI to landing page
    const landingPage = document.getElementById('landingPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const userPanel = document.getElementById('userPanel');
    
    if (dashboardPage) {
        dashboardPage.classList.remove('show');
        dashboardPage.style.display = 'none';
    }
    
    if (userPanel) {
        userPanel.style.display = 'none';
    }
    
    if (landingPage) {
        landingPage.style.display = 'block';
        landingPage.style.visibility = 'visible';
    }
    
    // Close all modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    console.log('🧪 Test Mode: Logged out');
}

function testModeReset() {
    // Complete app state reset for clean test environment
    testModeLogout();
    
    // Reset dependencies to default
    dependencies = getDefaultDependencies();
    filteredDependencies = [...dependencies];
    
    // Clear all filters
    activeStatusFilter = null;
    
    // Reset form states
    document.querySelectorAll('form').forEach(form => {
        if (form.reset) form.reset();
    });
    
    // Reset filter inputs
    const searchInput = document.getElementById('searchInput');
    const teamFilter = document.getElementById('teamFilter');  
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    if (searchInput) searchInput.value = '';
    if (teamFilter) teamFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (priorityFilter) priorityFilter.value = '';
    
    console.log('🧪 Test Mode: Complete app reset');
}

function testModeGetState() {
    // Return current app state for test verification
    return {
        isLoggedIn: !!currentUser,
        user: currentUser,
        dependenciesCount: dependencies ? dependencies.length : 0,
        filteredCount: filteredDependencies ? filteredDependencies.length : 0,
        dashboardVisible: document.getElementById('dashboardPage')?.classList.contains('show') || false
    };
}

// Download Functions
function toggleDownloadMenu() {
    const downloadMenu = document.getElementById('downloadMenu');
    const downloadDropdown = document.querySelector('.download-dropdown');
    
    downloadMenu.classList.toggle('show');
    downloadDropdown.classList.toggle('active');
}

function downloadCSV() {
    const data = filteredDependencies || dependencies;
    const headers = ['Name', 'Description', 'Team', 'Status', 'Priority', 'Created By', 'Created Date'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(dep => {
        const row = [
            `"${dep.name}"`,
            `"${dep.description}"`,
            `"${dep.team}"`,
            `"${dep.status}"`,
            `"${dep.priority}"`,
            `"${dep.createdBy}"`,
            `"${new Date(dep.createdAt).toLocaleDateString()}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `depflow-dependencies-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Close the download menu
    toggleDownloadMenu();
    
    console.log(`📥 Downloaded ${data.length} dependencies as CSV`);
}

function downloadExcel() {
    const data = filteredDependencies || dependencies;
    
    // Create HTML table for Excel
    let htmlContent = `
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .status-completed { background-color: #d4edda; }
                .status-in-progress { background-color: #cce5ff; }
                .status-blocked { background-color: #f8d7da; }
                .status-not-started { background-color: #f8f9fa; }
                .priority-high { color: #dc3545; font-weight: bold; }
                .priority-medium { color: #fd7e14; font-weight: bold; }
                .priority-low { color: #28a745; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>DepFlow Dependencies Export</h2>
            <p>Export Date: ${new Date().toLocaleDateString()}</p>
            <p>Total Dependencies: ${data.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Team</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created By</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    data.forEach(dep => {
        const statusClass = `status-${dep.status.toLowerCase().replace(' ', '-')}`;
        const priorityClass = `priority-${dep.priority.toLowerCase()}`;
        
        htmlContent += `
                    <tr>
                        <td><strong>${dep.name}</strong></td>
                        <td>${dep.description}</td>
                        <td>${dep.team}</td>
                        <td class="${statusClass}">${dep.status}</td>
                        <td class="${priorityClass}">${dep.priority}</td>
                        <td>${dep.createdBy}</td>
                        <td>${new Date(dep.createdAt).toLocaleDateString()}</td>
                    </tr>
        `;
    });
    
    htmlContent += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Create and download file
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `depflow-dependencies-${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Close the download menu
    toggleDownloadMenu();
    
    console.log(`📊 Downloaded ${data.length} dependencies as Excel`);
}

// Close download menu when clicking outside
document.addEventListener('click', function(event) {
    const downloadDropdown = document.querySelector('.download-dropdown');
    const downloadMenu = document.getElementById('downloadMenu');
    
    if (downloadDropdown && !downloadDropdown.contains(event.target)) {
        downloadMenu?.classList.remove('show');
        downloadDropdown.classList.remove('active');
    }
});

// Notification System
function showNotification(message, type = 'success', duration = 5000) {
    const notification = document.getElementById('notification');
    const messageElement = document.querySelector('.notification-message');
    
    if (!notification || !messageElement) {
        console.log(`📱 Notification: ${message}`);
        return;
    }
    
    // Clear existing classes and set message
    notification.className = 'notification';
    messageElement.textContent = message;
    
    // Add type class
    notification.classList.add(type);
    notification.classList.add('show');
    
    // Auto hide after duration
    if (duration > 0) {
        setTimeout(() => {
            hideNotification();
        }, duration);
    }
    
    console.log(`📱 ${type.toUpperCase()}: ${message}`);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.classList.remove('show', 'hide', 'success', 'error', 'warning', 'info');
        }, 300);
    }
}

// Form Submission Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Add Dependency Form Handler
    const addForm = document.getElementById('addDependencyForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(addForm);
            const name = formData.get('name');
            const description = formData.get('description');
            
            // Form validation
            if (!name || name.trim().length === 0) {
                showNotification('❌ Name is required!', 'error');
                return;
            }
            
            if (!description || description.trim().length < 10) {
                showNotification('❌ Description must be at least 10 characters!', 'error');
                return;
            }
            
            const newDependency = {
                id: Date.now(), // Simple ID generation
                name: name.trim(),
                description: description.trim(),
                team: formData.get('team'),
                status: formData.get('status') || 'NOT STARTED',
                priority: formData.get('priority') || 'MEDIUM',
                createdBy: currentUser?.email || 'unknown',
                createdAt: new Date().toISOString()
            };
            
            // Add to dependencies array
            dependencies.push(newDependency);
            saveDependencies();
            
            // Update UI
            filteredDependencies = [...dependencies];
            renderDependencies();
            updateCounters();
            
            // Show notification
            showNotification(`✅ Dependency "${newDependency.name}" created successfully!`, 'success');
            
            // Send email notification
            sendEmailNotification('Created', newDependency, currentUser);
            
            // Close modal
            closeAddDependencyModal();
        });
    }
    
    // Edit Dependency Form Handler
    const editForm = document.getElementById('editDependencyForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(editForm);
            const dependencyId = parseInt(editForm.dataset.dependencyId);
            const name = formData.get('name');
            const description = formData.get('description');
            
            // Form validation
            if (!name || name.trim().length === 0) {
                showNotification('❌ Name is required!', 'error');
                return;
            }
            
            if (!description || description.trim().length < 10) {
                showNotification('❌ Description must be at least 10 characters!', 'error');
                return;
            }
            
            // Find and update dependency
            const depIndex = dependencies.findIndex(d => d.id === dependencyId);
            if (depIndex !== -1) {
                const oldDep = { ...dependencies[depIndex] };
                dependencies[depIndex] = {
                    ...dependencies[depIndex],
                    name: name.trim(),
                    description: description.trim(),
                    team: formData.get('team'),
                    status: formData.get('status'),
                    priority: formData.get('priority')
                };
                
                saveDependencies();
                
                // Update UI
                filteredDependencies = [...dependencies];
                renderDependencies();
                updateCounters();
                
                // Show notification
                showNotification(`✅ Dependency "${dependencies[depIndex].name}" updated successfully!`, 'success');
                
                // Send email notification
                sendEmailNotification('Updated', dependencies[depIndex], currentUser);
                
                // Close modal
                closeEditDependencyModal();
            }
        });
    }
});

// Test Mode Functions for Robot Framework
function testModeLogin(userType, role = null) {
    console.log(`🤖 Test Mode: Login as ${userType}`);
    
    // Handle user type to email/name mapping
    let email, name, userRole;
    if (userType === 'admin') {
        email = 'admin@demo.com';
        name = 'Admin User';
        userRole = role || 'admin';
    } else if (userType === 'user') {
        email = 'user@demo.com';
        name = 'Regular User';
        userRole = role || 'user';
    } else if (userType.includes('@')) {
        // If userType is already an email
        email = userType;
        name = userType.split('@')[0];
        userRole = role || 'user';
    } else {
        email = `${userType}@demo.com`;
        name = userType;
        userRole = role || 'user';
    }
    
    currentUser = {
        email: email,
        name: name,
        role: userRole
    };
    localStorage.setItem('depflow_user', JSON.stringify(currentUser));
    localStorage.setItem('token', 'test-mode-token-' + Date.now());
    
    // Hide landing page and login modal
    document.getElementById('landingPage').style.display = 'none';
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
        loginModal.classList.remove('show');
    }
    
    // Show dashboard
    const dashboardPage = document.getElementById('dashboardPage');
    const userPanel = document.getElementById('userPanel');
    
    if (dashboardPage) {
        dashboardPage.style.display = 'block';
        dashboardPage.classList.add('show');
    }
    
    if (userPanel) {
        userPanel.style.display = 'block';
    }
    
    // Update user panel
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome) {
        userWelcome.innerHTML = `Welcome, ${currentUser.name}!<br><small>${currentUser.email}</small>`;
    }
    
    // Load and display dependencies
    loadDependencies();
    applyFilters();
    updateCounters();
    
    return { success: true, user: currentUser };
}

function testModeLogout() {
    console.log('🤖 Test Mode: Logout');
    currentUser = null;
    localStorage.removeItem('depflow_user');
    localStorage.removeItem('token');
    
    // Hide dashboard
    const dashboardPage = document.getElementById('dashboardPage');
    const userPanel = document.getElementById('userPanel');
    
    if (dashboardPage) {
        dashboardPage.style.display = 'none';
        dashboardPage.classList.remove('show');
    }
    
    if (userPanel) {
        userPanel.style.display = 'none';
    }
    
    // Show landing page
    document.getElementById('landingPage').style.display = 'flex';
    
    return { success: true };
}

function testModeReset() {
    console.log('🤖 Test Mode: Reset application state');
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset global state
    currentUser = null;
    dependencies = getDefaultDependencies();
    filteredDependencies = [...dependencies];
    
    // Hide all modals and pages
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('landingPage').style.display = 'flex';
    
    return { success: true };
}

function testModeGetState() {
    return {
        currentUser: currentUser,
        dependenciesCount: dependencies.length,
        filteredCount: filteredDependencies.length,
        hasAuthToken: !!localStorage.getItem('token'),
        dashboardVisible: document.getElementById('dashboardPage').style.display !== 'none'
    };
}

// Export functions for robot framework testing
window.DepFlow = {
    // Test Mode Functions
    testModeLogin,
    testModeLogout,
    testModeReset,
    testModeGetState,
    // Authentication Functions
    openLoginModal,
    closeLoginModal,
    fillAdminCredentials,
    fillUserCredentials,
    handleLogin,
    logout,
    // Registration Functions
    openRegisterModal,
    closeRegisterModal,
    switchToLogin,
    switchToRegister,
    handleRegister,
    // Documentation Function
    openDocumentation,
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
    updateCounters,
    // Sorting Functions
    sortTable,
    updateSortIndicators,
    // Visual Indicators
    updateVisualIndicators,
    // Download Functions
    toggleDownloadMenu,
    downloadCSV,
    downloadExcel,
    // Notification Functions
    showNotification,
    hideNotification,
    // Test Mode Functions
    testModeLogin,
    testModeLogout,
    testModeReset,
    testModeGetState
};
