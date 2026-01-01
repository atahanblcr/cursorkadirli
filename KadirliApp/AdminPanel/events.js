let currentEditingId = null;

// Load all events
async function loadEvents() {
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Yükleniyor...</td></tr>';
    
    try {
        const data = await api.get('/Events');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(event => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editEvent('${event.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deleteEvent('${event.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${event.id.substring(0, 8)}...</td>
                    <td><strong>${event.title}</strong></td>
                    <td>${formatDateTime(event.eventDate)}</td>
                    <td>${event.locationName || '-'}</td>
                    <td>${event.isActive ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Pasif</span>'}</td>
                    <td class="actions">${actionButtons}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="error">Veri yüklenirken hata oluştu</td></tr>';
        showNotification('Veriler yüklenemedi: ' + error.message, 'error');
    }
}

// Load upcoming events
async function loadUpcomingEvents() {
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Yükleniyor...</td></tr>';
    
    try {
        const data = await api.get('/Events/upcoming');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Yaklaşan etkinlik bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(event => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editEvent('${event.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deleteEvent('${event.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${event.id.substring(0, 8)}...</td>
                    <td><strong>${event.title}</strong></td>
                    <td>${formatDateTime(event.eventDate)}</td>
                    <td>${event.locationName || '-'}</td>
                    <td>${event.isActive ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Pasif</span>'}</td>
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
    document.getElementById('modalTitle').textContent = 'Yeni Etkinlik Ekle';
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    document.getElementById('isActive').checked = true;
    document.getElementById('modal').classList.add('show');
}

// Edit event
async function editEvent(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const event = await api.get(`/Events/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Etkinlik Düzenle';
        document.getElementById('eventId').value = id;
        document.getElementById('title').value = event.title;
        document.getElementById('description').value = event.description || '';
        document.getElementById('locationName').value = event.locationName || '';
        document.getElementById('latitude').value = event.latitude || '';
        document.getElementById('longitude').value = event.longitude || '';
        document.getElementById('imageUrl').value = event.imageUrl || '';
        document.getElementById('isActive').checked = event.isActive;
        
        const eventDate = new Date(event.eventDate);
        const localDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000);
        document.getElementById('eventDate').value = localDate.toISOString().slice(0, 16);
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save event (POST or PUT)
async function saveEvent(event) {
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
        title: document.getElementById('title').value,
        description: document.getElementById('description').value || null,
        eventDate: new Date(document.getElementById('eventDate').value).toISOString(),
        locationName: document.getElementById('locationName').value || null,
        latitude: document.getElementById('latitude').value ? parseFloat(document.getElementById('latitude').value) : null,
        longitude: document.getElementById('longitude').value ? parseFloat(document.getElementById('longitude').value) : null,
        imageUrl: document.getElementById('imageUrl').value || null,
        isActive: document.getElementById('isActive').checked,
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/Events/${currentEditingId}`, formData);
            showNotification('Etkinlik güncellendi', 'success');
        } else {
            await api.post('/Events', formData);
            showNotification('Etkinlik eklendi', 'success');
        }
        
        closeModal();
        loadEvents();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete event
async function deleteEvent(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/Events/${id}`);
        showNotification('Etkinlik silindi', 'success');
        loadEvents();
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
    loadEvents();
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

