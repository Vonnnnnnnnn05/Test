// Faculty module functions

function renderStudentManagement(container) {
    const users = getData('simms_users').filter(u => u.role === 'student');
    const deployments = getData('simms_deployments');
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Student Management</h3>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Year</th>
                            <th>Deployment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(student => {
                            const deployment = deployments.find(d => d.studentId === student.id);
                            return `
                                <tr>
                                    <td>${student.studentId || 'N/A'}</td>
                                    <td>${student.name}</td>
                                    <td>${student.course || 'N/A'}</td>
                                    <td>${student.year || 'N/A'}</td>
                                    <td><span class="badge ${deployment ? 'badge-success' : 'badge-warning'}">${deployment ? deployment.status : 'Not Deployed'}</span></td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm" onclick="viewStudentDetails(${student.id})">View Details</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderApprovals(container) {
    const users = getData('simms_users').filter(u => u.role === 'student' && (!u.status || u.status === 'pending'));
    const agencies = getData('simms_agencies').filter(a => a.status === 'pending');
    
    container.innerHTML = `
        <div class="tabs">
            <button class="tab active" onclick="showApprovalTab('students')">Student Approvals</button>
            <button class="tab" onclick="showApprovalTab('agencies')">Agency Approvals</button>
        </div>
        <div id="approvalContent">
            <div class="card">
                <div class="card-header">
                    <h3>Pending Student Approvals</h3>
                </div>
                ${users.length === 0 ? '<p>No pending student approvals.</p>' : `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.course || 'N/A'}</td>
                                        <td>
                                            <button class="btn btn-success btn-sm" onclick="approveStudent(${user.id})">Approve</button>
                                            <button class="btn btn-danger btn-sm" onclick="rejectStudent(${user.id})">Reject</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}

function showApprovalTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('approvalContent');
    if (tab === 'students') {
        const users = getData('simms_users').filter(u => u.role === 'student' && (!u.status || u.status === 'pending'));
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Pending Student Approvals</h3>
                </div>
                ${users.length === 0 ? '<p>No pending student approvals.</p>' : `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.course || 'N/A'}</td>
                                        <td>
                                            <button class="btn btn-success btn-sm" onclick="approveStudent(${user.id})">Approve</button>
                                            <button class="btn btn-danger btn-sm" onclick="rejectStudent(${user.id})">Reject</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    } else {
        const agencies = getData('simms_agencies').filter(a => a.status === 'pending');
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Pending Agency Approvals</h3>
                </div>
                ${agencies.length === 0 ? '<p>No pending agency approvals.</p>' : `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact Person</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${agencies.map(agency => `
                                    <tr>
                                        <td>${agency.name}</td>
                                        <td>${agency.contactPerson}</td>
                                        <td>${agency.address}</td>
                                        <td>
                                            <button class="btn btn-success btn-sm" onclick="approveAgency(${agency.id})">Approve</button>
                                            <button class="btn btn-danger btn-sm" onclick="rejectAgency(${agency.id})">Reject</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    }
}

function approveStudent(id) {
    const users = getData('simms_users');
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index].status = 'approved';
        setData('simms_users', users);
        alert('Student approved successfully!');
        renderDashboardContent();
    }
}

function rejectStudent(id) {
    if (confirm('Are you sure you want to reject this student?')) {
        const users = getData('simms_users');
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index].status = 'rejected';
            setData('simms_users', users);
            alert('Student rejected.');
            renderDashboardContent();
        }
    }
}

function approveAgency(id) {
    const agencies = getData('simms_agencies');
    const index = agencies.findIndex(a => a.id === id);
    if (index !== -1) {
        agencies[index].status = 'approved';
        setData('simms_agencies', agencies);
        alert('Agency approved successfully!');
        renderDashboardContent();
    }
}

function rejectAgency(id) {
    if (confirm('Are you sure you want to reject this agency?')) {
        const agencies = getData('simms_agencies');
        const index = agencies.findIndex(a => a.id === id);
        if (index !== -1) {
            agencies[index].status = 'rejected';
            setData('simms_agencies', agencies);
            alert('Agency rejected.');
            renderDashboardContent();
        }
    }
}

function renderDeploymentManagement(container) {
    const deployments = getData('simms_deployments');
    const users = getData('simms_users');
    const agencies = getData('simms_agencies');
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Deployment Management</h3>
                <button class="btn btn-primary btn-sm" onclick="showAddDeploymentModal()">+ Assign Student</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Agency</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${deployments.map(d => {
                            const student = users.find(u => u.id === d.studentId);
                            const agency = agencies.find(a => a.id === d.agencyId);
                            return `
                                <tr>
                                    <td>${student ? student.name : 'Unknown'}</td>
                                    <td>${agency ? agency.name : 'Unknown'}</td>
                                    <td>${d.startDate}</td>
                                    <td>${d.endDate}</td>
                                    <td><span class="badge ${d.status === 'active' ? 'badge-success' : 'badge-warning'}">${d.status}</span></td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm" onclick="editDeployment(${d.id})">Edit</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddDeploymentModal() {
    const users = getData('simms_users').filter(u => u.role === 'student' && u.status === 'approved');
    const agencies = getData('simms_agencies').filter(a => a.status === 'approved');
    
    if (users.length === 0) {
        alert('No approved students available for deployment');
        return;
    }
    
    if (agencies.length === 0) {
        alert('No approved agencies available for deployment');
        return;
    }
    
    let studentOptions = users.map((u, i) => `${i + 1}. ${u.name} (${u.studentId})`).join('\n');
    const studentIndex = prompt(`Select student:\n${studentOptions}\nEnter number:`);
    
    if (!studentIndex || studentIndex < 1 || studentIndex > users.length) {
        alert('Invalid selection');
        return;
    }
    
    const selectedStudent = users[studentIndex - 1];
    
    let agencyOptions = agencies.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
    const agencyIndex = prompt(`Select agency:\n${agencyOptions}\nEnter number:`);
    
    if (!agencyIndex || agencyIndex < 1 || agencyIndex > agencies.length) {
        alert('Invalid selection');
        return;
    }
    
    const selectedAgency = agencies[agencyIndex - 1];
    
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    if (!startDate) return;
    
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
    if (!endDate) return;
    
    const deployments = getData('simms_deployments');
    deployments.push({
        id: deployments.length + 1,
        studentId: selectedStudent.id,
        agencyId: selectedAgency.id,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        facultyId: currentUser.id
    });
    
    setData('simms_deployments', deployments);
    alert('Deployment created successfully!');
    renderDashboardContent();
}

function renderProgressTracking(container) {
    const deployments = getData('simms_deployments');
    const users = getData('simms_users');
    const accomplishments = getData('simms_accomplishments');
    const config = getConfig();
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Student Progress Tracking</h3>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Hours Completed</th>
                            <th>Required Hours</th>
                            <th>Progress</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${deployments.map(d => {
                            const student = users.find(u => u.id === d.studentId);
                            const studentAccomplishments = accomplishments.filter(a => a.studentId === d.studentId);
                            const totalHours = studentAccomplishments.reduce((sum, a) => sum + a.hours, 0);
                            const progress = Math.min((totalHours / config.immersionHoursRequired) * 100, 100);
                            const isComplete = progress >= 100;
                            
                            return `
                                <tr>
                                    <td>${student ? student.name : 'Unknown'}</td>
                                    <td>${totalHours}</td>
                                    <td>${config.immersionHoursRequired}</td>
                                    <td>
                                        <div class="progress-bar" style="width: 150px;">
                                            <div class="progress-fill" style="width: ${progress}%"></div>
                                        </div>
                                        <small>${progress.toFixed(1)}%</small>
                                    </td>
                                    <td><span class="badge ${isComplete ? 'badge-success' : 'badge-info'}">${isComplete ? 'Complete' : 'In Progress'}</span></td>
                                    <td>
                                        <button class="btn btn-secondary btn-sm" onclick="viewStudentProgress(${d.studentId})">View Details</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function viewStudentDetails(studentId) {
    const users = getData('simms_users');
    const student = users.find(u => u.id === studentId);
    
    if (student) {
        alert(`Student Details:\n\nName: ${student.name}\nStudent ID: ${student.studentId}\nCourse: ${student.course}\nYear: ${student.year}\nEmail: ${student.email}\nPhone: ${student.phone}\nAddress: ${student.address}`);
    }
}

function viewStudentProgress(studentId) {
    const accomplishments = getData('simms_accomplishments').filter(a => a.studentId === studentId);
    const users = getData('simms_users');
    const student = users.find(u => u.id === studentId);
    
    let details = `Progress for ${student.name}:\n\n`;
    accomplishments.forEach(acc => {
        details += `${acc.date}: ${acc.task} (${acc.hours} hours)\n`;
    });
    
    alert(details);
}

function editDeployment(id) {
    alert('Edit deployment functionality - implement as needed');
}
