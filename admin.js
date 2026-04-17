// Admin module functions

function renderUserManagement(container) {
    const users = getData('simms_users');
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>User Management</h3>
                <button class="btn btn-primary btn-sm" onclick="showAddUserModal()">+ Add User</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td><span class="badge badge-info">${user.role}</span></td>
                                <td>
                                    <button class="btn btn-secondary btn-sm" onclick="editUser(${user.id})">Edit</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAgencyManagement(container) {
    const agencies = getData('simms_agencies');
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Partner Agencies</h3>
                <button class="btn btn-primary btn-sm" onclick="showAddAgencyModal()">+ Add Agency</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Person</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${agencies.map(agency => `
                            <tr>
                                <td>${agency.name}</td>
                                <td>${agency.contactPerson}</td>
                                <td>${agency.phone}</td>
                                <td><span class="badge ${agency.status === 'approved' ? 'badge-success' : 'badge-warning'}">${agency.status}</span></td>
                                <td>
                                    <button class="btn btn-secondary btn-sm" onclick="editAgency(${agency.id})">Edit</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteAgency(${agency.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderSubjectManagement(container) {
    const subjects = getData('simms_subjects');
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Subjects</h3>
                <button class="btn btn-primary btn-sm" onclick="showAddSubjectModal()">+ Add Subject</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Units</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subjects.map(subject => `
                            <tr>
                                <td>${subject.code}</td>
                                <td>${subject.name}</td>
                                <td>${subject.units}</td>
                                <td>
                                    <button class="btn btn-secondary btn-sm" onclick="editSubject(${subject.id})">Edit</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteSubject(${subject.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderConfig(container) {
    const config = getConfig();
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>System Configuration</h3>
            </div>
            <form onsubmit="saveConfig(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Required Immersion Hours</label>
                        <input type="number" id="immersionHours" value="${config.immersionHoursRequired}" required>
                    </div>
                    <div class="form-group">
                        <label>Required Documents</label>
                        <input type="number" id="requiredDocs" value="${config.documentsRequired}" required>
                    </div>
                    <div class="form-group">
                        <label>Max Students per Agency</label>
                        <input type="number" id="maxStudents" value="${config.maxStudentsPerAgency}" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Configuration</button>
                </div>
            </form>
        </div>
    `;
}

function saveConfig(event) {
    event.preventDefault();
    const config = {
        immersionHoursRequired: parseInt(document.getElementById('immersionHours').value),
        documentsRequired: parseInt(document.getElementById('requiredDocs').value),
        maxStudentsPerAgency: parseInt(document.getElementById('maxStudents').value)
    };
    setData('simms_config', config);
    alert('Configuration saved successfully!');
}

function renderSystemEvaluation(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>System Evaluation</h3>
            </div>
            <form onsubmit="submitEvaluation(event)">
                <div class="form-group">
                    <label>Functionality Rating (1-5)</label>
                    <select id="functionality" required>
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Accuracy Rating (1-5)</label>
                    <select id="accuracy" required>
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Reliability Rating (1-5)</label>
                    <select id="reliability" required>
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Efficiency Rating (1-5)</label>
                    <select id="efficiency" required>
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Comments/Feedback</label>
                    <textarea id="comments" rows="4" placeholder="Enter your feedback..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Submit Evaluation</button>
                </div>
            </form>
        </div>
    `;
}

function submitEvaluation(event) {
    event.preventDefault();
    const evaluation = {
        functionality: document.getElementById('functionality').value,
        accuracy: document.getElementById('accuracy').value,
        reliability: document.getElementById('reliability').value,
        efficiency: document.getElementById('efficiency').value,
        comments: document.getElementById('comments').value,
        date: new Date().toISOString(),
        userId: currentUser.id
    };
    
    const evaluations = getData('simms_system_evaluations');
    evaluations.push(evaluation);
    setData('simms_system_evaluations', evaluations);
    
    alert('Evaluation submitted successfully!');
    renderDashboardContent();
}

// Modal functions
function showAddUserModal() {
    const name = prompt('Enter name:');
    if (!name) return;
    
    const email = prompt('Enter email:');
    if (!email) return;
    
    const password = prompt('Enter password:');
    if (!password) return;
    
    const role = prompt('Enter role (admin/student/faculty/agency):');
    if (!role) return;
    
    const users = getData('simms_users');
    users.push({
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        role: role,
        status: 'pending'
    });
    
    setData('simms_users', users);
    alert('User added successfully!');
    renderDashboardContent();
}

function showAddAgencyModal() {
    const name = prompt('Enter agency name:');
    if (!name) return;
    
    const contactPerson = prompt('Enter contact person:');
    if (!contactPerson) return;
    
    const phone = prompt('Enter phone:');
    if (!phone) return;
    
    const address = prompt('Enter address:');
    if (!address) return;
    
    const agencies = getData('simms_agencies');
    agencies.push({
        id: agencies.length + 1,
        name: name,
        contactPerson: contactPerson,
        phone: phone,
        address: address,
        status: 'pending'
    });
    
    setData('simms_agencies', agencies);
    alert('Agency added successfully!');
    renderDashboardContent();
}

function showAddSubjectModal() {
    const code = prompt('Enter subject code:');
    if (!code) return;
    
    const name = prompt('Enter subject name:');
    if (!name) return;
    
    const units = prompt('Enter units:');
    if (!units) return;
    
    const subjects = getData('simms_subjects');
    subjects.push({
        id: subjects.length + 1,
        code: code,
        name: name,
        units: parseInt(units)
    });
    
    setData('simms_subjects', subjects);
    alert('Subject added successfully!');
    renderDashboardContent();
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = getData('simms_users');
        const filtered = users.filter(u => u.id !== id);
        setData('simms_users', filtered);
        alert('User deleted successfully!');
        renderDashboardContent();
    }
}

function deleteAgency(id) {
    if (confirm('Are you sure you want to delete this agency?')) {
        const agencies = getData('simms_agencies');
        const filtered = agencies.filter(a => a.id !== id);
        setData('simms_agencies', filtered);
        alert('Agency deleted successfully!');
        renderDashboardContent();
    }
}

function deleteSubject(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        const subjects = getData('simms_subjects');
        const filtered = subjects.filter(s => s.id !== id);
        setData('simms_subjects', filtered);
        alert('Subject deleted successfully!');
        renderDashboardContent();
    }
}

function editUser(id) {
    alert('Edit functionality - implement as needed');
}

function editAgency(id) {
    alert('Edit functionality - implement as needed');
}

function editSubject(id) {
    alert('Edit functionality - implement as needed');
}
