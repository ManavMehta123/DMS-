let currentDocuments = [];

// Upload Form Handler
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('doc-title').value;
    const description = document.getElementById('doc-description').value;
    const tags = document.getElementById('doc-tags').value;
    const file = document.getElementById('doc-file').files[0];

    if (!file) {
        showMessage('Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);

    try {
        await apiCall('/documents/upload', {
            method: 'POST',
            body: formData
        });

        showMessage('Document uploaded successfully!', 'success');
        document.getElementById('uploadForm').reset();
        loadDocuments();
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// Load all documents
async function loadDocuments() {
    const documentsList = document.getElementById('documents-list');
    documentsList.innerHTML = '<div class="loading">Loading documents...</div>';

    try {
        const documents = await apiCall('/documents');
        currentDocuments = documents;
        displayDocuments(documents);
    } catch (error) {
        documentsList.innerHTML = '<div class="empty-state"><h3>Error loading documents</h3></div>';
        showMessage(error.message, 'error');
    }
}

// Search documents
async function searchDocuments() {
    const query = document.getElementById('search-query').value;
    const tags = document.getElementById('search-tags').value;

    if (!query && !tags) {
        loadDocuments();
        return;
    }

    const documentsList = document.getElementById('documents-list');
    documentsList.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (tags) params.append('tags', tags);

        const documents = await apiCall(`/documents/search?${params.toString()}`);
        currentDocuments = documents;
        displayDocuments(documents);
    } catch (error) {
        documentsList.innerHTML = '<div class="empty-state"><h3>Search failed</h3></div>';
        showMessage(error.message, 'error');
    }
}

// Display documents
function displayDocuments(documents) {
    const documentsList = document.getElementById('documents-list');

    if (documents.length === 0) {
        documentsList.innerHTML = `
            <div class="empty-state">
                <h3>No documents found</h3>
                <p>Upload your first document to get started!</p>
            </div>
        `;
        return;
    }

    documentsList.innerHTML = documents.map(doc => `
        <div class="document-card">
            <h3>${escapeHtml(doc.title)}</h3>
            <p>${escapeHtml(doc.description || 'No description')}</p>
            
            ${doc.tags.length > 0 ? `
                <div class="document-tags">
                    ${doc.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="document-meta">
                <div>📄 ${escapeHtml(doc.originalName)}</div>
                <div>👤 ${escapeHtml(doc.uploadedBy.username)}</div>
                <div>📅 ${new Date(doc.createdAt).toLocaleDateString()}</div>
                <div>🔢 Version ${doc.currentVersion}</div>
            </div>
            
            <div class="document-actions">
                <button onclick="viewDocument('${doc._id}')" class="btn btn-primary">View</button>
                <button onclick="downloadDocument('${doc._id}', '${escapeHtml(doc.filename)}')" class="btn btn-success">Download</button>
                ${canEdit(doc) ? `
                    <button onclick="showUpdateForm('${doc._id}')" class="btn btn-secondary">Edit</button>
                    <button onclick="deleteDocument('${doc._id}')" class="btn btn-danger">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// View document details
async function viewDocument(id) {
    try {
        const doc = await apiCall(`/documents/${id}`);
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>${escapeHtml(doc.title)}</h2>
            <p><strong>Description:</strong> ${escapeHtml(doc.description || 'No description')}</p>
            
            ${doc.tags.length > 0 ? `
                <div class="document-tags">
                    ${doc.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="document-meta" style="margin: 20px 0;">
                <div><strong>File:</strong> ${escapeHtml(doc.originalName)}</div>
                <div><strong>Size:</strong> ${formatBytes(doc.fileSize)}</div>
                <div><strong>Type:</strong> ${escapeHtml(doc.fileType)}</div>
                <div><strong>Uploaded by:</strong> ${escapeHtml(doc.uploadedBy.username)}</div>
                <div><strong>Created:</strong> ${new Date(doc.createdAt).toLocaleString()}</div>
                <div><strong>Current Version:</strong> ${doc.currentVersion}</div>
            </div>

            ${canEdit(doc) ? `
                <div style="margin: 20px 0;">
                    <h3>Upload New Version</h3>
                    <form id="versionForm" onsubmit="uploadVersion(event, '${doc._id}')">
                        <div class="form-group">
                            <label>New File</label>
                            <input type="file" id="version-file" required>
                        </div>
                        <div class="form-group">
                            <label>Version Comment</label>
                            <input type="text" id="version-comment" placeholder="What changed?">
                        </div>
                        <button type="submit" class="btn btn-primary">Upload Version</button>
                    </form>
                </div>
            ` : ''}
            
            <div class="version-history">
                <h3>Version History</h3>
                ${doc.versions.map(v => `
                    <div class="version-item">
                        <strong>Version ${v.versionNumber}</strong><br>
                        ${v.comment ? `Comment: ${escapeHtml(v.comment)}<br>` : ''}
                        Uploaded: ${new Date(v.uploadedAt).toLocaleString()}
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px;">
                <button onclick="downloadDocument('${doc._id}', '${escapeHtml(doc.filename)}')" class="btn btn-success">Download Current Version</button>
                ${canEdit(doc) ? `
                    <button onclick="closeModal(); showUpdateForm('${doc._id}')" class="btn btn-secondary">Edit Details</button>
                ` : ''}
            </div>
        `;
        
        document.getElementById('document-modal').classList.add('active');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Upload new version
async function uploadVersion(e, docId) {
    e.preventDefault();
    
    const file = document.getElementById('version-file').files[0];
    const comment = document.getElementById('version-comment').value;

    if (!file) {
        showMessage('Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);

    try {
        await apiCall(`/documents/${docId}/version`, {
            method: 'POST',
            body: formData
        });

        showMessage('New version uploaded successfully!', 'success');
        closeModal();
        loadDocuments();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Show update form
function showUpdateForm(id) {
    const doc = currentDocuments.find(d => d._id === id);
    if (!doc) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>Update Document</h2>
        <form id="updateForm" onsubmit="updateDocument(event, '${id}')">
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="update-title" value="${escapeHtml(doc.title)}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" id="update-description" value="${escapeHtml(doc.description || '')}">
            </div>
            <div class="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" id="update-tags" value="${doc.tags.join(', ')}">
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
            <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancel</button>
        </form>
    `;
    
    document.getElementById('document-modal').classList.add('active');
}

// Update document
async function updateDocument(e, id) {
    e.preventDefault();
    
    const title = document.getElementById('update-title').value;
    const description = document.getElementById('update-description').value;
    const tags = document.getElementById('update-tags').value;

    try {
        await apiCall(`/documents/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description, tags })
        });

        showMessage('Document updated successfully!', 'success');
        closeModal();
        loadDocuments();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Delete document
async function deleteDocument(id) {
    if (!confirm('Are you sure you want to delete this document?')) {
        return;
    }

    try {
        await apiCall(`/documents/${id}`, {
            method: 'DELETE'
        });

        showMessage('Document deleted successfully!', 'success');
        loadDocuments();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Download document
function downloadDocument(id, filename) {
    const token = getToken();
    window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
}

// Close modal
function closeModal() {
    document.getElementById('document-modal').classList.remove('active');
}

// Helper functions
function canEdit(doc) {
    const user = getUser();
    return doc.uploadedBy._id === user.id || 
           (doc.permissions.editors && doc.permissions.editors.some(e => e._id === user.id));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('document-modal');
    if (event.target === modal) {
        closeModal();
    }
}
