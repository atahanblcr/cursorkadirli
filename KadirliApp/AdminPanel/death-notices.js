let currentEditingId = null;

// Load all death notices
async function loadDeathNotices() {
    const tbody = document.getElementById('deathNoticesTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Yükleniyor...</td></tr>';
    
    try {
        const data = await api.get('/DeathNotice');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(notice => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editDeathNotice('${notice.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deleteDeathNotice('${notice.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${notice.id.substring(0, 8)}...</td>
                    <td>${notice.firstName} ${notice.lastName}</td>
                    <td>${notice.deathDate || '-'}</td>
                    <td>${notice.burialPlace || '-'}</td>
                    <td>${notice.burialTime || '-'}</td>
                    <td class="actions">${actionButtons}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="error">Veri yüklenirken hata oluştu</td></tr>';
        showNotification('Veriler yüklenemedi: ' + error.message, 'error');
    }
}

// Open add modal
function openAddModal() {
    if (!auth.canCreate()) {
        auth.showPermissionError('Ekleme');
        return;
    }
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Yeni Vefat İlanı Ekle';
    document.getElementById('deathNoticeForm').reset();
    document.getElementById('deathNoticeId').value = '';
    document.getElementById('modal').classList.add('show');
}

// Edit death notice
async function editDeathNotice(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const notice = await api.get(`/DeathNotice/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Vefat İlanı Düzenle';
        document.getElementById('deathNoticeId').value = id;
        document.getElementById('firstName').value = notice.firstName;
        document.getElementById('lastName').value = notice.lastName;
        document.getElementById('deathDate').value = notice.deathDate || '';
        document.getElementById('burialPlace').value = notice.burialPlace || '';
        document.getElementById('burialTime').value = notice.burialTime || '';
        document.getElementById('condolenceAddress').value = notice.condolenceAddress || '';
        document.getElementById('latitude').value = notice.latitude || '';
        document.getElementById('longitude').value = notice.longitude || '';
        document.getElementById('imageUrl').value = notice.imageUrl || '';
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save death notice (POST or PUT)
async function saveDeathNotice(event) {
    event.preventDefault();
    
    if (currentEditingId && !auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    if (!currentEditingId && !auth.canCreate()) {
        auth.showPermissionError('Ekleme');
        return;
    }
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        deathDate: document.getElementById('deathDate').value,
        burialPlace: document.getElementById('burialPlace').value || null,
        burialTime: document.getElementById('burialTime').value || null,
        condolenceAddress: document.getElementById('condolenceAddress').value || null,
        latitude: document.getElementById('latitude').value ? parseFloat(document.getElementById('latitude').value) : null,
        longitude: document.getElementById('longitude').value ? parseFloat(document.getElementById('longitude').value) : null,
        imageUrl: document.getElementById('imageUrl').value || null,
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/DeathNotice/${currentEditingId}`, formData);
            showNotification('Vefat ilanı güncellendi', 'success');
        } else {
            await api.post('/DeathNotice', formData);
            showNotification('Vefat ilanı eklendi', 'success');
        }
        
        closeModal();
        loadDeathNotices();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete death notice
async function deleteDeathNotice(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/DeathNotice/${id}`);
        showNotification('Vefat ilanı silindi', 'success');
        loadDeathNotices();
    } catch (error) {
        showNotification('Silinemedi: ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
    currentEditingId = null;
}

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDeathNotices();
    
    // Close modal on outside click
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

