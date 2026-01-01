let currentEditingId = null;

// Parse image URLs from string
function parseImageUrls(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return value.split(',').map(url => url.trim()).filter(url => url);
    }
}

// Format image URLs for display
function formatImageUrls(imageUrls) {
    if (!imageUrls) return '';
    if (Array.isArray(imageUrls)) {
        return JSON.stringify(imageUrls);
    }
    return imageUrls;
}

// Load all places
async function loadPlaces() {
    const tbody = document.getElementById('placesTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Yükleniyor...</td></tr>';
    
    try {
        const data = await api.get('/Places');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(place => {
            let actionButtons = '';
            if (auth.canEdit()) {
                actionButtons += `<button class="btn-small btn-edit" onclick="editPlace('${place.id}')">✏️ Düzenle</button>`;
            }
            if (auth.canDelete()) {
                actionButtons += `<button class="btn-small btn-delete" onclick="deletePlace('${place.id}')">🗑️ Sil</button>`;
            }
            if (!actionButtons) {
                actionButtons = '<span class="badge">Sadece Görüntüleme</span>';
            }
            
            return `
                <tr>
                    <td class="id-cell">${place.id.substring(0, 8)}...</td>
                    <td><strong>${place.title}</strong></td>
                    <td>${place.distanceText || '-'}</td>
                    <td>${place.distanceKm ? place.distanceKm + ' km' : '-'}</td>
                    <td>${formatDateTime(place.createdAt)}</td>
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
    document.getElementById('modalTitle').textContent = 'Yeni Yer Ekle';
    document.getElementById('placeForm').reset();
    document.getElementById('placeId').value = '';
    document.getElementById('modal').classList.add('show');
}

// Edit place
async function editPlace(id) {
    if (!auth.canEdit()) {
        auth.showPermissionError('Düzenleme');
        return;
    }
    try {
        const place = await api.get(`/Places/${id}`);
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Yer Düzenle';
        document.getElementById('placeId').value = id;
        document.getElementById('title').value = place.title;
        document.getElementById('description').value = place.description || '';
        document.getElementById('distanceText').value = place.distanceText || '';
        document.getElementById('distanceKm').value = place.distanceKm || '';
        document.getElementById('latitude').value = place.latitude || '';
        document.getElementById('longitude').value = place.longitude || '';
        document.getElementById('imageUrls').value = formatImageUrls(place.imageUrls);
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save place (POST or PUT)
async function savePlace(event) {
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
        distanceText: document.getElementById('distanceText').value || null,
        distanceKm: document.getElementById('distanceKm').value ? parseFloat(document.getElementById('distanceKm').value) : null,
        latitude: document.getElementById('latitude').value ? parseFloat(document.getElementById('latitude').value) : null,
        longitude: document.getElementById('longitude').value ? parseFloat(document.getElementById('longitude').value) : null,
        imageUrls: parseImageUrls(document.getElementById('imageUrls').value),
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await api.put(`/Places/${currentEditingId}`, formData);
            showNotification('Yer güncellendi', 'success');
        } else {
            await api.post('/Places', formData);
            showNotification('Yer eklendi', 'success');
        }
        
        closeModal();
        loadPlaces();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete place
async function deletePlace(id) {
    if (!auth.canDelete()) {
        auth.showPermissionError('Silme');
        return;
    }
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/Places/${id}`);
        showNotification('Yer silindi', 'success');
        loadPlaces();
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
    loadPlaces();
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

