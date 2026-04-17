// Student module functions

function renderProfile(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>My Profile</h3>
                <button class="btn btn-primary btn-sm" onclick="showEditProfileModal()">Edit Profile</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" value="${currentUser.name}" disabled>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="${currentUser.email}" disabled>
                </div>
                <div class="form-group">
                    <label>Student ID</label>
                    <input type="text" value="${currentUser.studentId || 'N/A'}" disabled>
                </div>
                <div class="form-group">
                    <label>Course</label>
                    <input type="text" value="${currentUser.course || 'N/A'}" disabled>
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" value="${currentUser.year || 'N/A'}" disabled>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" value="${currentUser.phone || 'N/A'}" disabled>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" value="${currentUser.address || 'N/A'}" disabled>
                </div>
            </div>
        </div>
    `;
}

function renderDocuments(container) {
    const studentDocuments = getData('simms_student_documents').filter(d => d.studentId === currentUser.id);
    const requiredDocuments = getData('simms_required_documents');
    
    const submittedCount = studentDocuments.filter(d => d.status === 'submitted').length;
    const progress = (submittedCount / requiredDocuments.length) * 100;
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Document Submission</h3>
                <span class="badge badge-info">${submittedCount}/${requiredDocuments.length} Submitted</span>
            </div>
            <div class="progress-bar" style="margin-bottom: 20px;">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="document-list">
                ${requiredDocuments.map(doc => {
                    const studentDoc = studentDocuments.find(d => d.documentId === doc.id);
                    const status = studentDoc ? studentDoc.status : 'pending';
                    return `
                        <div class="document-item">
                            <div>
                                <strong>${doc.name}</strong>
                                <p style="font-size: 0.875rem; color: #6b7280;">${doc.description}</p>
                            </div>
                            <div>
                                <span class="badge ${status === 'submitted' ? 'badge-success' : 'badge-warning'}">${status}</span>
                                ${status === 'pending' ? `
                                    <button class="btn btn-primary btn-sm" onclick="uploadDocument(${doc.id})">Upload</button>
                                ` : `
                                    <button class="btn btn-secondary btn-sm" onclick="viewDocument(${studentDoc.id})">View</button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function uploadDocument(documentId) {
    const fileName = prompt('Enter file name (simulating upload):');
    if (fileName) {
        const studentDocuments = getData('simms_student_documents');
        studentDocuments.push({
            id: studentDocuments.length + 1,
            studentId: currentUser.id,
            documentId: documentId,
            status: 'submitted',
            fileName: fileName,
            submittedDate: new Date().toISOString().split('T')[0]
        });
        setData('simms_student_documents', studentDocuments);
        alert('Document uploaded successfully!');
        renderDashboardContent();
    }
}

function viewDocument(docId) {
    const studentDocuments = getData('simms_student_documents');
    const doc = studentDocuments.find(d => d.id === docId);
    if (doc) {
        alert(`Document: ${doc.fileName}\nSubmitted: ${doc.submittedDate}`);
    }
}

function renderApplicationLetter(container) {
    const agencies = getData('simms_agencies').filter(a => a.status === 'approved');
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Application Letter Generator</h3>
            </div>
            <form onsubmit="generateApplicationLetter(event)">
                <div class="form-group">
                    <label>Select Agency</label>
                    <select id="letterAgency" required>
                        <option value="">Select an agency...</option>
                        ${agencies.map(a => `
                            <option value="${a.id}">${a.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Position Applied For</label>
                    <input type="text" id="position" required placeholder="e.g., IT Intern">
                </div>
                <div class="form-group">
                    <label>Additional Notes</label>
                    <textarea id="letterNotes" rows="3" placeholder="Any additional information..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Generate Letter</button>
                </div>
            </form>
        </div>
        <div id="letterPreview" class="card hidden" style="margin-top: 20px;"></div>
    `;
}

function generateApplicationLetter(event) {
    event.preventDefault();
    const agencyId = parseInt(document.getElementById('letterAgency').value);
    const position = document.getElementById('position').value;
    const notes = document.getElementById('letterNotes').value;
    
    const agencies = getData('simms_agencies');
    const agency = agencies.find(a => a.id === agencyId);
    
    const letter = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: right; margin-bottom: 40px;">
                <p>${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="margin-bottom: 40px;">
                <p><strong>${agency.contactPerson}</strong></p>
                <p>${agency.name}</p>
                <p>${agency.address}</p>
            </div>
            
            <p>Dear ${agency.contactPerson},</p>
            
            <p style="margin: 20px 0;">
                I am writing to express my interest in the <strong>${position}</strong> position at ${agency.name}. 
                As a ${currentUser.year} ${currentUser.course} student at [University Name], I am eager to apply my 
                academic knowledge in a practical setting and contribute to your organization's success.
            </p>
            
            <p style="margin: 20px 0;">
                ${notes ? notes + ' ' : ''}I am committed to learning and growing professionally during this immersion program. 
                I believe that my academic background, combined with my enthusiasm and dedication, makes me a strong candidate 
                for this opportunity.
            </p>
            
            <p style="margin: 20px 0;">
                I have attached the required documents for your review. I am available for an interview at your convenience 
                and can be reached at ${currentUser.email} or ${currentUser.phone}.
            </p>
            
            <p style="margin: 40px 0;">
                Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute 
                to your team.
            </p>
            
            <div style="margin-top: 60px;">
                <p>Sincerely,</p>
                <p><strong>${currentUser.name}</strong></p>
                <p>${currentUser.studentId || 'Student ID'}</p>
                <p>${currentUser.course || 'Course'}</p>
            </div>
        </div>
    `;
    
    const preview = document.getElementById('letterPreview');
    preview.classList.remove('hidden');
    preview.innerHTML = `
        <div class="card-header">
            <h3>Application Letter Preview</h3>
            <button class="btn btn-primary btn-sm" onclick="printLetter()">Print</button>
        </div>
        ${letter}
    `;
}

function printLetter() {
    const letterContent = document.getElementById('letterPreview').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Application Letter</title></head>
        <body>${letterContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function renderDeployment(container) {
    const deployment = getData('simms_deployments').find(d => d.studentId === currentUser.id);
    const agencies = getData('simms_agencies');
    
    if (!deployment) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>My Deployment</h3>
                </div>
                <p>You have not been deployed yet. Please wait for faculty assignment.</p>
            </div>
        `;
        return;
    }
    
    const agency = agencies.find(a => a.id === deployment.agencyId);
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>My Deployment</h3>
                <span class="badge ${deployment.status === 'active' ? 'badge-success' : 'badge-warning'}">${deployment.status}</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Agency</label>
                    <input type="text" value="${agency ? agency.name : 'Unknown'}" disabled>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" value="${agency ? agency.address : 'Unknown'}" disabled>
                </div>
                <div class="form-group">
                    <label>Contact Person</label>
                    <input type="text" value="${agency ? agency.contactPerson : 'Unknown'}" disabled>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" value="${agency ? agency.phone : 'Unknown'}" disabled>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" value="${deployment.startDate}" disabled>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" value="${deployment.endDate}" disabled>
                </div>
            </div>
        </div>
    `;
}

function renderAccomplishments(container) {
    const deployment = getData('simms_deployments').find(d => d.studentId === currentUser.id);
    const accomplishments = getData('simms_accomplishments').filter(a => a.studentId === currentUser.id);
    
    if (!deployment) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Daily Accomplishments</h3>
                </div>
                <p>You need to be deployed first to record accomplishments.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Daily Accomplishments</h3>
                <button class="btn btn-primary btn-sm" onclick="showAddAccomplishmentModal()">+ Add Entry</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Task/Activity</th>
                            <th>Hours</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${accomplishments.map(acc => `
                            <tr>
                                <td>${acc.date}</td>
                                <td>${acc.task}</td>
                                <td>${acc.hours}</td>
                                <td>
                                    <button class="btn btn-secondary btn-sm" onclick="editAccomplishment(${acc.id})">Edit</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteAccomplishment(${acc.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddAccomplishmentModal() {
    const date = prompt('Enter date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!date) return;
    
    const task = prompt('Enter task/activity:');
    if (!task) return;
    
    const hours = prompt('Enter number of hours:', '8');
    if (!hours) return;
    
    const accomplishments = getData('simms_accomplishments');
    const deployment = getData('simms_deployments').find(d => d.studentId === currentUser.id);
    
    accomplishments.push({
        id: accomplishments.length + 1,
        studentId: currentUser.id,
        deploymentId: deployment.id,
        date: date,
        task: task,
        hours: parseInt(hours)
    });
    
    setData('simms_accomplishments', accomplishments);
    alert('Accomplishment added successfully!');
    renderDashboardContent();
}

function deleteAccomplishment(id) {
    if (confirm('Are you sure you want to delete this accomplishment?')) {
        const accomplishments = getData('simms_accomplishments');
        const filtered = accomplishments.filter(a => a.id !== id);
        setData('simms_accomplishments', filtered);
        alert('Accomplishment deleted successfully!');
        renderDashboardContent();
    }
}

function editAccomplishment(id) {
    const accomplishments = getData('simms_accomplishments');
    const acc = accomplishments.find(a => a.id === id);
    
    if (acc) {
        const task = prompt('Enter task/activity:', acc.task);
        if (!task) return;
        
        const hours = prompt('Enter number of hours:', acc.hours);
        if (!hours) return;
        
        acc.task = task;
        acc.hours = parseInt(hours);
        
        setData('simms_accomplishments', accomplishments);
        alert('Accomplishment updated successfully!');
        renderDashboardContent();
    }
}

function showEditProfileModal() {
    alert('Edit profile functionality - implement as needed');
}
