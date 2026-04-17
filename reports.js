// Reports module functions

function renderReports(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Reports</h3>
            </div>
            <div class="tabs">
                <button class="tab active" onclick="showReportTab('personal')">Personal Information</button>
                <button class="tab" onclick="showReportTab('application')">Application Letter</button>
                <button class="tab" onclick="showReportTab('documents')">Document Status</button>
                <button class="tab" onclick="showReportTab('deployment')">Deployment</button>
                <button class="tab" onclick="showReportTab('completion')">Completion</button>
                <button class="tab" onclick="showReportTab('evaluation')">Evaluation</button>
                <button class="tab" onclick="showReportTab('portfolio')">Portfolio</button>
                <button class="tab" onclick="showReportTab('moa')">MOA</button>
            </div>
            <div id="reportContent">
                ${renderPersonalInfoReport()}
            </div>
        </div>
    `;
}

function showReportTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('reportContent');
    switch(tab) {
        case 'personal': content.innerHTML = renderPersonalInfoReport(); break;
        case 'application': content.innerHTML = renderApplicationLetterReport(); break;
        case 'documents': content.innerHTML = renderDocumentStatusReport(); break;
        case 'deployment': content.innerHTML = renderDeploymentReport(); break;
        case 'completion': content.innerHTML = renderCompletionReport(); break;
        case 'evaluation': content.innerHTML = renderEvaluationReport(); break;
        case 'portfolio': content.innerHTML = renderPortfolioReport(); break;
        case 'moa': content.innerHTML = renderMOAReport(); break;
    }
}

function renderPersonalInfoReport() {
    const users = getData('simms_users').filter(u => u.role === 'student');
    return `
        <h4>Personal Information Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Phone</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>${u.studentId || 'N/A'}</td>
                            <td>${u.name}</td>
                            <td>${u.course || 'N/A'}</td>
                            <td>${u.year || 'N/A'}</td>
                            <td>${u.phone || 'N/A'}</td>
                            <td>${u.email}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <button class="btn btn-primary" onclick="printReport()">Print Report</button>
    `;
}

function renderApplicationLetterReport() {
    const users = getData('simms_users').filter(u => u.role === 'student');
    return `
        <h4>Application Letter Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Agency</th>
                        <th>Letter Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>${u.name}</td>
                            <td>Tech Company Agency</td>
                            <td><span class="badge badge-success">Generated</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="generateLetter(${u.id})">View</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderDocumentStatusReport() {
    const studentDocs = getData('simms_student_documents');
    const requiredDocs = getData('simms_required_documents');
    const users = getData('simms_users').filter(u => u.role === 'student');
    
    return `
        <h4>Document Submission Status Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Date Submitted</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentDocs.map(doc => {
                        const student = users.find(u => u.id === doc.studentId);
                        const reqDoc = requiredDocs.find(d => d.id === doc.documentId);
                        return `
                            <tr>
                                <td>${student ? student.name : 'Unknown'}</td>
                                <td>${reqDoc ? reqDoc.name : 'Unknown'}</td>
                                <td><span class="badge ${doc.status === 'submitted' ? 'badge-success' : 'badge-warning'}">${doc.status}</span></td>
                                <td>${doc.submittedDate || 'N/A'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderDeploymentReport() {
    const deployments = getData('simms_deployments');
    const agencies = getData('simms_agencies');
    const users = getData('simms_users');
    
    return `
        <h4>Deployment Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Agency</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
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
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderCompletionReport() {
    const deployments = getData('simms_deployments');
    const accomplishments = getData('simms_accomplishments');
    const users = getData('simms_users');
    const config = getConfig();
    
    return `
        <h4>Immersion Completion Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Hours Completed</th>
                        <th>Required Hours</th>
                        <th>Progress</th>
                        <th>Status</th>
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
                                <td>${progress.toFixed(1)}%</td>
                                <td><span class="badge ${isComplete ? 'badge-success' : 'badge-warning'}">${isComplete ? 'Complete' : 'In Progress'}</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderEvaluationReport() {
    const evaluations = getData('simms_evaluations');
    const users = getData('simms_users');
    const agencies = getData('simms_agencies');
    
    return `
        <h4>Evaluation Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Agency</th>
                        <th>Rating</th>
                        <th>Feedback</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${evaluations.map(e => {
                        const student = users.find(u => u.id === e.studentId);
                        const agency = agencies.find(a => a.id === e.agencyId);
                        return `
                            <tr>
                                <td>${student ? student.name : 'Unknown'}</td>
                                <td>${agency ? agency.name : 'Unknown'}</td>
                                <td>${'⭐'.repeat(e.rating)}</td>
                                <td>${e.feedback}</td>
                                <td>${e.date}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderPortfolioReport() {
    const users = getData('simms_users').filter(u => u.role === 'student');
    const accomplishments = getData('simms_accomplishments');
    
    return `
        <h4>Student Portfolio Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Total Tasks</th>
                        <th>Total Hours</th>
                        <th>Latest Activity</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => {
                        const studentAccomplishments = accomplishments.filter(a => a.studentId === u.id);
                        const totalHours = studentAccomplishments.reduce((sum, a) => sum + a.hours, 0);
                        const latestActivity = studentAccomplishments.length > 0 
                            ? studentAccomplishments[studentAccomplishments.length - 1].date 
                            : 'N/A';
                        
                        return `
                            <tr>
                                <td>${u.name}</td>
                                <td>${studentAccomplishments.length}</td>
                                <td>${totalHours}</td>
                                <td>${latestActivity}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderMOAReport() {
    const agencies = getData('simms_agencies');
    
    return `
        <h4>Memorandum of Agreement (MOA) Report</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Agency</th>
                        <th>Contact Person</th>
                        <th>Address</th>
                        <th>MOA Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${agencies.map(a => `
                        <tr>
                            <td>${a.name}</td>
                            <td>${a.contactPerson}</td>
                            <td>${a.address}</td>
                            <td><span class="badge ${a.status === 'approved' ? 'badge-success' : 'badge-warning'}">${a.status === 'approved' ? 'Signed' : 'Pending'}</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="viewMOA(${a.id})">View</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function printReport() {
    window.print();
}

function generateLetter(studentId) {
    alert('Generate letter for student ' + studentId + ' - implement as needed');
}

function viewMOA(agencyId) {
    const agencies = getData('simms_agencies');
    const agency = agencies.find(a => a.id === agencyId);
    
    if (agency) {
        alert(`MOA for ${agency.name}\n\nContact Person: ${agency.contactPerson}\nAddress: ${agency.address}\nPhone: ${agency.phone}\n\nStatus: ${agency.status === 'approved' ? 'Signed' : 'Pending'}`);
    }
}
