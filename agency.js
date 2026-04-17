// Agency module functions

function renderAgencyEvaluations(container) {
    const evaluations = getData('simms_evaluations').filter(e => e.evaluatorId === currentUser.id);
    const deployments = getData('simms_deployments');
    const users = getData('simms_users');
    const agencies = getData('simms_agencies');
    
    const agency = agencies.find(a => a.name === currentUser.name);
    if (!agency) {
        container.innerHTML = '<p>Agency not found.</p>';
        return;
    }
    
    const agencyDeployments = deployments.filter(d => d.agencyId === agency.id);
    const evaluatedStudentIds = evaluations.map(e => e.studentId);
    const pendingStudents = agencyDeployments.filter(d => !evaluatedStudentIds.includes(d.studentId));
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Student Evaluations</h3>
            </div>
        
        <h4>Pending Evaluations</h4>
        ${pendingStudents.length === 0 ? '<p>No pending evaluations.</p>' : `
            <div class="table-container" style="margin-bottom: 20px;">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pendingStudents.map(d => {
                            const student = users.find(u => u.id === d.studentId);
                            return `
                                <tr>
                                    <td>${student ? student.name : 'Unknown'}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="showEvaluationModal(${d.studentId})">Evaluate</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `}
        
        <h4>Completed Evaluations</h4>
        ${evaluations.length === 0 ? '<p>No completed evaluations yet.</p>' : `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Rating</th>
                            <th>Feedback</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${evaluations.map(e => {
                            const student = users.find(u => u.id === e.studentId);
                            return `
                                <tr>
                                    <td>${student ? student.name : 'Unknown'}</td>
                                    <td>${'⭐'.repeat(e.rating)}</td>
                                    <td>${e.feedback}</td>
                                    <td>${e.date}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `}
        </div>
    `;
}

function showEvaluationModal(studentId) {
    const rating = prompt('Enter rating (1-5):', '5');
    if (!rating || rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5');
        return;
    }
    
    const feedback = prompt('Enter feedback:');
    if (!feedback) return;
    
    const evaluations = getData('simms_evaluations');
    const agencies = getData('simms_agencies');
    const agency = agencies.find(a => a.name === currentUser.name);
    
    evaluations.push({
        id: evaluations.length + 1,
        studentId: studentId,
        agencyId: agency.id,
        rating: parseInt(rating),
        feedback: feedback,
        evaluatorId: currentUser.id,
        date: new Date().toISOString().split('T')[0]
    });
    
    setData('simms_evaluations', evaluations);
    alert('Evaluation submitted successfully!');
    renderDashboardContent();
}

// Agency dashboard (reuses the main dashboard function but filters for agency-specific data)
function renderAgencyDashboard(container) {
    const deployments = getData('simms_deployments');
    const agencies = getData('simms_agencies');
    const agency = agencies.find(a => a.name === currentUser.name);
    
    if (!agency) {
        container.innerHTML = '<p>Agency not found.</p>';
        return;
    }
    
    const agencyDeployments = deployments.filter(d => d.agencyId === agency.id);
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Assigned Students</h4>
                <div class="stat-value">${agencyDeployments.length}</div>
            </div>
            <div class="stat-card">
                <h4>Active Immersions</h4>
                <div class="stat-value">${agencyDeployments.filter(d => d.status === 'active').length}</div>
            </div>
        </div>
    `;
}
