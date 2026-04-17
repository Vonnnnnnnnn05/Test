// Dashboard rendering functions

function renderDashboard(container) {
    const users = getData('simms_users');
    const agencies = getData('simms_agencies');
    const deployments = getData('simms_deployments');
    const accomplishments = getData('simms_accomplishments');
    
    let statsHtml = '';
    
    switch (currentUser.role) {
        case 'admin':
            statsHtml = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Total Users</h4>
                        <div class="stat-value">${users.length}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Partner Agencies</h4>
                        <div class="stat-value">${agencies.length}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Active Deployments</h4>
                        <div class="stat-value">${deployments.filter(d => d.status === 'active').length}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Total Accomplishments</h4>
                        <div class="stat-value">${accomplishments.length}</div>
                    </div>
                </div>
            `;
            break;
        case 'faculty':
            const facultyDeployments = deployments.filter(d => d.facultyId === currentUser.id);
            statsHtml = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Assigned Students</h4>
                        <div class="stat-value">${facultyDeployments.length}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Active Deployments</h4>
                        <div class="stat-value">${facultyDeployments.filter(d => d.status === 'active').length}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Pending Approvals</h4>
                        <div class="stat-value">${users.filter(u => u.role === 'student' && (!u.status || u.status === 'pending')).length}</div>
                    </div>
                </div>
            `;
            break;
        case 'student':
            const studentDeployment = deployments.find(d => d.studentId === currentUser.id);
            const studentAccomplishments = accomplishments.filter(a => a.studentId === currentUser.id);
            const totalHours = studentAccomplishments.reduce((sum, a) => sum + a.hours, 0);
            const config = getConfig();
            const progress = Math.min((totalHours / config.immersionHoursRequired) * 100, 100);
            
            statsHtml = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Total Hours Completed</h4>
                        <div class="stat-value">${totalHours}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Required Hours</h4>
                        <div class="stat-value">${config.immersionHoursRequired}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Progress</h4>
                        <div class="stat-value">${progress.toFixed(1)}%</div>
                    </div>
                    <div class="stat-card">
                        <h4>Status</h4>
                        <div class="stat-value">${studentDeployment ? studentDeployment.status : 'Not Deployed'}</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>Immersion Progress</h3>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
            break;
        case 'agency':
            const agencyDeployments = deployments.filter(d => {
                const agency = agencies.find(a => a.id === d.agencyId);
                return agency && agency.name === currentUser.name;
            });
            statsHtml = `
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
            break;
    }

    container.innerHTML = `
        <h2>Dashboard</h2>
        <p>Welcome back, ${currentUser.name}!</p>
        ${statsHtml}
    `;
}
