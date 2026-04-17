// SIMMS - Student Immersion Management and Monitoring System
// Main Application File

// Initialize data in localStorage
function initializeData() {
    if (!localStorage.getItem('simms_initialized')) {
        // Test accounts
        const users = [
            { id: 1, email: 'admin@test.com', password: 'admin123', role: 'admin', name: 'Administrator' },
            { id: 2, email: 'student@test.com', password: 'student123', role: 'student', name: 'John Student', 
              studentId: 'STU001', course: 'BSIT', year: '3rd Year', phone: '09123456789', address: '123 Main St' },
            { id: 3, email: 'faculty@test.com', password: 'faculty123', role: 'faculty', name: 'Prof. Jane Faculty', department: 'College of IT' },
            { id: 4, email: 'agency@test.com', password: 'agency123', role: 'agency', name: 'Tech Company Agency', 
              address: '456 Business Ave', contactPerson: 'Mr. Manager', phone: '09876543210' }
        ];

        // Partner agencies
        const agencies = [
            { id: 1, name: 'Tech Company Agency', address: '456 Business Ave', contactPerson: 'Mr. Manager', phone: '09876543210', email: 'info@techcompany.com', status: 'approved' },
            { id: 2, name: 'Health Care Hospital', address: '789 Medical Center', contactPerson: 'Dr. Smith', phone: '0911223344', email: 'hr@hospital.com', status: 'approved' },
            { id: 3, name: 'Government Office', address: '101 Civic Center', contactPerson: 'Ms. Admin', phone: '0955667788', email: 'info@gov.ph', status: 'pending' }
        ];

        // Subjects
        const subjects = [
            { id: 1, code: 'IT101', name: 'Introduction to Computing', units: 3 },
            { id: 2, code: 'IT102', name: 'Programming Fundamentals', units: 3 },
            { id: 3, code: 'IT201', name: 'Database Systems', units: 3 },
            { id: 4, code: 'OJT101', name: 'OJT/Immersion', units: 6 }
        ];

        // Required documents
        const requiredDocuments = [
            { id: 1, name: 'Resume/CV', description: 'Updated curriculum vitae' },
            { id: 2, name: 'Application Letter', description: 'Formal application letter' },
            { id: 3, name: 'Certificate of Enrollment', description: 'Proof of current enrollment' },
            { id: 4, name: 'Medical Certificate', description: 'Health clearance certificate' },
            { id: 5, name: 'NBI Clearance', description: 'National Bureau Investigation clearance' },
            { id: 6, name: 'Parental Consent', description: 'Consent form from parents/guardian' }
        ];

        // Student documents
        const studentDocuments = [
            { id: 1, studentId: 2, documentId: 1, status: 'submitted', fileName: 'resume.pdf', submittedDate: '2024-01-15' },
            { id: 2, studentId: 2, documentId: 2, status: 'pending', fileName: null, submittedDate: null },
            { id: 3, studentId: 2, documentId: 3, status: 'submitted', fileName: 'enrollment.pdf', submittedDate: '2024-01-15' },
            { id: 4, studentId: 2, documentId: 4, status: 'pending', fileName: null, submittedDate: null },
            { id: 5, studentId: 2, documentId: 5, status: 'pending', fileName: null, submittedDate: null },
            { id: 6, studentId: 2, documentId: 6, status: 'submitted', fileName: 'consent.pdf', submittedDate: '2024-01-15' }
        ];

        // Student deployments
        const deployments = [
            { id: 1, studentId: 2, agencyId: 1, startDate: '2024-02-01', endDate: '2024-05-31', status: 'active', facultyId: 3 }
        ];

        // Daily accomplishments
        const accomplishments = [
            { id: 1, studentId: 2, deploymentId: 1, date: '2024-02-01', task: 'Orientation and company introduction', hours: 8 },
            { id: 2, studentId: 2, deploymentId: 1, date: '2024-02-02', task: 'Setup development environment', hours: 8 },
            { id: 3, studentId: 2, deploymentId: 1, date: '2024-02-03', task: 'Learn company coding standards', hours: 8 }
        ];

        // Chat messages
        const chatMessages = [
            { id: 1, senderId: 2, receiverId: 3, message: 'Good morning sir, I have a question about my deployment.', timestamp: '2024-02-01 09:00:00' },
            { id: 2, senderId: 3, receiverId: 2, message: 'Good morning! What is your question?', timestamp: '2024-02-01 09:05:00' }
        ];

        // Student evaluations
        const evaluations = [
            { id: 1, studentId: 2, agencyId: 1, rating: 4, feedback: 'Good performance, needs improvement in documentation', evaluatorId: 4, date: '2024-03-15' }
        ];

        // System configuration
        const config = {
            immersionHoursRequired: 480,
            documentsRequired: 6,
            maxStudentsPerAgency: 10
        };

        localStorage.setItem('simms_users', JSON.stringify(users));
        localStorage.setItem('simms_agencies', JSON.stringify(agencies));
        localStorage.setItem('simms_subjects', JSON.stringify(subjects));
        localStorage.setItem('simms_required_documents', JSON.stringify(requiredDocuments));
        localStorage.setItem('simms_student_documents', JSON.stringify(studentDocuments));
        localStorage.setItem('simms_deployments', JSON.stringify(deployments));
        localStorage.setItem('simms_accomplishments', JSON.stringify(accomplishments));
        localStorage.setItem('simms_chat_messages', JSON.stringify(chatMessages));
        localStorage.setItem('simms_evaluations', JSON.stringify(evaluations));
        localStorage.setItem('simms_config', JSON.stringify(config));
        localStorage.setItem('simms_initialized', 'true');
    }
}

// Data access functions
function getData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getConfig() {
    return JSON.parse(localStorage.getItem('simms_config') || '{}');
}

// Authentication
let currentUser = null;

function login(email, password) {
    const users = getData('simms_users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('simms_current_user', JSON.stringify(user));
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('simms_current_user');
    showLoginScreen();
}

function checkAuth() {
    const savedUser = localStorage.getItem('simms_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLoginScreen();
    }
}

// Screen management
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboardScreen').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');
    document.getElementById('userDisplay').textContent = `${currentUser.name} (${currentUser.role})`;
    renderSidebar();
    renderDashboardContent();
}

// Sidebar rendering
function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    let menuItems = [];

    switch (currentUser.role) {
        case 'admin':
            menuItems = [
                { id: 'dashboard', label: 'Dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' },
                { id: 'users', label: 'User Management', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
                { id: 'agencies', label: 'Partner Agencies', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l8-4 8 4v14"></path></svg>' },
                { id: 'subjects', label: 'Subjects', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>' },
                { id: 'config', label: 'System Configuration', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' },
                { id: 'reports', label: 'Reports', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' },
                { id: 'evaluation', label: 'System Evaluation', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' }
            ];
            break;
        case 'faculty':
            menuItems = [
                { id: 'dashboard', label: 'Dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' },
                { id: 'students', label: 'Student Management', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>' },
                { id: 'approvals', label: 'Approvals', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' },
                { id: 'deployments', label: 'Deployments', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>' },
                { id: 'progress', label: 'Progress Tracking', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>' },
                { id: 'reports', label: 'Reports', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' },
                { id: 'chat', label: 'Chat', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>' }
            ];
            break;
        case 'student':
            menuItems = [
                { id: 'dashboard', label: 'Dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' },
                { id: 'profile', label: 'My Profile', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
                { id: 'documents', label: 'Documents', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>' },
                { id: 'application', label: 'Application Letter', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>' },
                { id: 'deployment', label: 'My Deployment', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>' },
                { id: 'accomplishments', label: 'Daily Accomplishments', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>' },
                { id: 'chat', label: 'Chat', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>' },
                { id: 'reports', label: 'My Reports', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' }
            ];
            break;
        case 'agency':
            menuItems = [
                { id: 'dashboard', label: 'Dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' },
                { id: 'students', label: 'Assigned Students', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>' },
                { id: 'evaluations', label: 'Student Evaluations', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' },
                { id: 'chat', label: 'Chat', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>' }
            ];
            break;
    }

    sidebar.innerHTML = `
        <ul class="sidebar-menu">
            ${menuItems.map(item => `
                <li>
                    <a href="#" onclick="navigateTo('${item.id}')" id="nav-${item.id}">
                        ${item.icon} ${item.label}
                    </a>
                </li>
            `).join('')}
        </ul>
    `;
}

// Navigation
let currentPage = 'dashboard';

function navigateTo(page) {
    currentPage = page;
    
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    const activeLink = document.getElementById(`nav-${page}`);
    if (activeLink) activeLink.classList.add('active');
    
    renderDashboardContent();
}

// Dashboard content routing
function renderDashboardContent() {
    const mainContent = document.getElementById('mainContent');
    
    switch (currentPage) {
        case 'dashboard':
            renderDashboard(mainContent);
            break;
        case 'users':
            renderUserManagement(mainContent);
            break;
        case 'agencies':
            renderAgencyManagement(mainContent);
            break;
        case 'subjects':
            renderSubjectManagement(mainContent);
            break;
        case 'config':
            renderConfig(mainContent);
            break;
        case 'reports':
            renderReports(mainContent);
            break;
        case 'evaluation':
            renderSystemEvaluation(mainContent);
            break;
        case 'students':
            renderStudentManagement(mainContent);
            break;
        case 'approvals':
            renderApprovals(mainContent);
            break;
        case 'deployments':
            renderDeploymentManagement(mainContent);
            break;
        case 'progress':
            renderProgressTracking(mainContent);
            break;
        case 'chat':
            renderChat(mainContent);
            break;
        case 'profile':
            renderProfile(mainContent);
            break;
        case 'documents':
            renderDocuments(mainContent);
            break;
        case 'application':
            renderApplicationLetter(mainContent);
            break;
        case 'accomplishments':
            renderAccomplishments(mainContent);
            break;
        case 'evaluations':
            renderAgencyEvaluations(mainContent);
            break;
        default:
            renderDashboard(mainContent);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkAuth();
    
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (login(email, password)) {
            showDashboard();
        } else {
            alert('Invalid email or password!');
        }
    });
    
    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', logout);
});
